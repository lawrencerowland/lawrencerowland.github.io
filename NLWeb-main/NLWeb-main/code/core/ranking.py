# Copyright (c) 2025 Microsoft Corporation.
# Licensed under the MIT License

"""
This file contains the code for the ranking stage. 

WARNING: This code is under development and may undergo changes in future releases.
Backwards compatibility is not guaranteed at this time.
"""

from utils.utils import log
from llm.llm import ask_llm
import asyncio
import json
from utils.trim import trim_json
from prompts.prompts import find_prompt, fill_ranking_prompt
from utils.logging_config_helper import get_configured_logger

logger = get_configured_logger("ranking_engine")


class Ranking:
     
    EARLY_SEND_THRESHOLD = 59
    NUM_RESULTS_TO_SEND = 10

    FAST_TRACK = 1
    REGULAR_TRACK = 2

    # This is the default ranking prompt, in case, for some reason, we can't find the site_type.xml file.
    RANKING_PROMPT = ["""  Assign a score between 0 and 100 to the following {site.itemType}
based on how relevant it is to the user's question. Use your knowledge from other sources, about the item, to make a judgement. 
If the score is above 50, provide a short description of the item highlighting the relevance to the user's question, without mentioning the user's question.
Provide an explanation of the relevance of the item to the user's question, without mentioning the user's question or the score or explicitly mentioning the term relevance.
If the score is below 75, in the description, include the reason why it is still relevant.
The user's question is: {request.query}. The item's description is {item.description}""",
    {"score" : "integer between 0 and 100", 
 "description" : "short description of the item"}]
 
    RANKING_PROMPT_NAME = "RankingPrompt"
     
    def get_ranking_prompt(self):
        site = self.handler.site
        item_type = self.handler.item_type
        prompt_str, ans_struc = find_prompt(site, item_type, self.RANKING_PROMPT_NAME)
        if prompt_str is None:
            logger.debug("Using default ranking prompt")
            return self.RANKING_PROMPT[0], self.RANKING_PROMPT[1]
        else:
            logger.debug(f"Using custom ranking prompt for site: {site}, item_type: {item_type}")
            return prompt_str, ans_struc
        
    def __init__(self, handler, items, ranking_type=FAST_TRACK):
        ll = len(items)
        self.ranking_type_str = "FAST_TRACK" if ranking_type == self.FAST_TRACK else "REGULAR_TRACK"
        logger.info(f"Initializing Ranking with {ll} items, type: {self.ranking_type_str}")
        logger.info(f"Ranking {ll} items of type {self.ranking_type_str}")
        self.handler = handler
        self.items = items
        self.num_results_sent = 0
        self.rankedAnswers = []
        self.ranking_type = ranking_type
        self._results_lock = asyncio.Lock()  # Add lock for thread-safe operations

    async def rankItem(self, url, json_str, name, site):
        if not self.handler.connection_alive_event.is_set():
            logger.warning("Connection lost, skipping item ranking")
            return
        if (self.ranking_type == Ranking.FAST_TRACK and self.handler.abort_fast_track_event.is_set()):
            logger.info("Fast track aborted, skipping item ranking")
            logger.info("Aborting fast track")
            return
        try:
            logger.debug(f"Ranking item: {name} from {site}")
            prompt_str, ans_struc = self.get_ranking_prompt()
            description = trim_json(json_str)
            prompt = fill_ranking_prompt(prompt_str, self.handler, description)
            
            logger.debug(f"Sending ranking request to LLM for item: {name}")
            ranking = await ask_llm(prompt, ans_struc, level="low")
            logger.debug(f"Received ranking score: {ranking.get('score', 'N/A')} for item: {name}")
            
            ansr = {
                'url': url,
                'site': site,
                'name': name,
                'ranking': ranking,
                'schema_object': json.loads(json_str),
                'sent': False,
            }
            
            if (ranking["score"] > self.EARLY_SEND_THRESHOLD):
                logger.info(f"High score item: {name} (score: {ranking['score']}) - sending early {self.ranking_type_str}")
                try:
                    await self.sendAnswers([ansr])
                except (BrokenPipeError, ConnectionResetError):
                    logger.warning(f"Client disconnected while sending early answer for {name}")
                    print(f"Client disconnected while sending early answer for {name}")
                    self.handler.connection_alive_event.clear()
                    return
            
            async with self._results_lock:  # Use lock when modifying shared state
                self.rankedAnswers.append(ansr)
            logger.debug(f"Item {name} added to ranked answers")
        
        except Exception as e:
            logger.error(f"Error in rankItem for {name}: {str(e)}")
            logger.debug(f"Full error trace: ", exc_info=True)
            print(f"Error in rankItem for {name}: {str(e)}")

    def shouldSend(self, result):
        should_send = False
        if (self.num_results_sent < self.NUM_RESULTS_TO_SEND - 5):
            should_send = True
        else:
            for r in self.rankedAnswers:
                if r["sent"] == True and r["ranking"]["score"] < result["ranking"]["score"]:
                    should_send = True
                    break
        
        logger.debug(f"Should send result {result['name']}? {should_send} (sent: {self.num_results_sent})")
        return should_send
    
    async def sendAnswers(self, answers, force=False):
        if not self.handler.connection_alive_event.is_set():
            logger.warning("Connection lost during ranking, skipping sending results")
            print("Connection lost during ranking, skipping sending results")
            return
        
        if (self.ranking_type == Ranking.FAST_TRACK and self.handler.abort_fast_track_event.is_set()):
            logger.info("Fast track aborted, not sending answers")
            return
              
        json_results = []
        logger.debug(f"Considering sending {len(answers)} answers (force: {force})")
        
        for result in answers:
            if self.shouldSend(result) or force:
                json_results.append({
                    "url": result["url"],
                    "name": result["name"],
                    "site": result["site"],
                    "siteUrl": result["site"],
                    "score": result["ranking"]["score"],
                    "description": result["ranking"]["description"],
                    "schema_object": result["schema_object"],
                })
                
                result["sent"] = True
            
        if (json_results):  # Only attempt to send if there are results
            # Wait for pre checks to be done using event
            await self.handler.pre_checks_done_event.wait()
            
            # if we got here, prechecks are done. check once again for fast track abort
            if (self.ranking_type == Ranking.FAST_TRACK and self.handler.abort_fast_track_event.is_set()):
                logger.info("Fast track aborted after pre-checks")
                return
            
            try:
                if (self.ranking_type == Ranking.FAST_TRACK):
                    self.handler.fastTrackWorked = True
                    logger.info("Fast track ranking successful")
                
                to_send = {"message_type": "result_batch", "results": json_results, "query_id": self.handler.query_id}
                await self.handler.send_message(to_send)
                self.num_results_sent += len(json_results)
                logger.info(f"Sent {len(json_results)} results, total sent: {self.num_results_sent}")
            except (BrokenPipeError, ConnectionResetError) as e:
                logger.error(f"Client disconnected while sending answers: {str(e)}")
                log(f"Client disconnected while sending answers: {str(e)}")
                self.handler.connection_alive_event.clear()
            except Exception as e:
                logger.error(f"Error sending answers: {str(e)}")
                log(f"Error sending answers: {str(e)}")
                self.handler.connection_alive_event.clear()
  
    async def sendMessageOnSitesBeingAsked(self, top_embeddings):
        if (self.handler.site == "all" or self.handler.site == "nlws"):
            sites_in_embeddings = {}
            for url, json_str, name, site in top_embeddings:
                sites_in_embeddings[site] = sites_in_embeddings.get(site, 0) + 1
            
            top_sites = sorted(sites_in_embeddings.items(), key=lambda x: x[1], reverse=True)[:3]
            top_sites_str = ", ".join([self.prettyPrintSite(x[0]) for x in top_sites])
            message = {"message_type": "asking_sites",  "message": "Asking " + top_sites_str}
            
            logger.info(f"Sending sites message: {top_sites_str}")
            
            try:
                await self.handler.send_message(message)
                self.handler.sites_in_embeddings_sent = True
            except (BrokenPipeError, ConnectionResetError):
                logger.warning("Client disconnected when sending sites message")
                print("Client disconnected when sending sites message")
                self.handler.connection_alive_event.clear()
    
    async def do(self):
        logger.info(f"Starting ranking process with {len(self.items)} items")
        tasks = []
        for url, json_str, name, site in self.items:
            if self.handler.connection_alive_event.is_set():  # Only add new tasks if connection is still alive
                tasks.append(asyncio.create_task(self.rankItem(url, json_str, name, site)))
            else:
                logger.warning("Connection lost, not creating new ranking tasks")
       
        await self.sendMessageOnSitesBeingAsked(self.items)

        try:
            logger.debug(f"Running {len(tasks)} ranking tasks concurrently")
            await asyncio.gather(*tasks, return_exceptions=True)
        except Exception as e:
            logger.error(f"Error during ranking tasks: {str(e)}")
            log(f"Error during ranking tasks: {str(e)}")

        if not self.handler.connection_alive_event.is_set():
            logger.warning("Connection lost during ranking, skipping sending results")
            log("Connection lost during ranking, skipping sending results")
            return

        # Wait for pre checks using event
        await self.handler.pre_checks_done_event.wait()
        
        if (self.ranking_type == Ranking.FAST_TRACK and self.handler.abort_fast_track_event.is_set()):
            logger.info("Fast track aborted after ranking tasks completed")
            return
    
        filtered = [r for r in self.rankedAnswers if r['ranking']['score'] > 51]
        ranked = sorted(filtered, key=lambda x: x['ranking']["score"], reverse=True)
        self.handler.final_ranked_answers = ranked[:self.NUM_RESULTS_TO_SEND]
        
        logger.info(f"Filtered to {len(filtered)} results with score > 51")
        logger.debug(f"Top 3 results: {[(r['name'], r['ranking']['score']) for r in ranked[:3]]}")

        results = [r for r in self.rankedAnswers if r['sent'] == False]
        if (self.num_results_sent > self.NUM_RESULTS_TO_SEND):
            logger.info(f"Already sent {self.num_results_sent} results, returning without sending more")
            return
       
        # Sort by score in descending order
        sorted_results = sorted(results, key=lambda x: x['ranking']["score"], reverse=True)
        good_results = [x for x in sorted_results if x['ranking']["score"] > 51]

        if (len(good_results) + self.num_results_sent >= self.NUM_RESULTS_TO_SEND):
            tosend = good_results[:self.NUM_RESULTS_TO_SEND - self.num_results_sent + 1]
        else:
            tosend = good_results

        try:
            logger.info(f"Sending final batch of {len(tosend)} results")
            await self.sendAnswers(tosend, force=True)
        except (BrokenPipeError, ConnectionResetError):
            logger.error("Client disconnected during final answer sending")
            log("Client disconnected during final answer sending")
            self.handler.connection_alive_event.clear()

    def prettyPrintSite(self, site):
        ans = site.replace("_", " ")
        words = ans.split()
        return ' '.join(word.capitalize() for word in words)

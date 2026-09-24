/* Progressive enhancement for the fieldbook. Everything is local; no network writes. */
(() => {
'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const evidenceNames = {period:'Period record',memory:'Later memory',comparison:'Later comparison',reconstruction:'Reconstruction'};
const rank = n => ['none-er','oner','twoer','three-er','four-er','fiver','six-er','seven-er','eight-er','nine-er','tenner'][n] || `${n}-er`;
const sources = ids => ids.map(n => `<a href="#s${n}" aria-label="Source ${n}">[${n}]</a>`).join(' ');

// Tags deliberately overlap. These are editorial seeds, not claimed universal school labels.
const lexicon = [
 {term:'Conker',aliases:'horse chestnut, nut',tags:['collecting','choosing','playing'],evidence:'comparison',place:'England; not a local dialect claim',date:'2023 guide',definition:'The horse-chestnut seed; also the object once it has a hole, a string and a playing career.',note:'“Nut” is convenient playground language here, rather than a botanical classification.',refs:[12]},
 {term:'Husk / case',aliases:'spiky shell, green case',tags:['collecting'],evidence:'comparison',place:'General botanical description',date:'2023 guide',definition:'The prickly outer casing, not the brown skin of the playing conker.',note:'Do not confuse a split-open green case with a damaged brown seed.',refs:[12]},
 {term:'Windfall',aliases:'fallen, ripe',tags:['collecting','choosing'],evidence:'comparison',place:'General collecting language',date:'2023 guide',definition:'A fallen find. Ripe conkers on the ground, rather than unripe ones on the tree, are the collecting starting point.',note:'This is descriptive vocabulary, not a claim that “windfall” was school slang.',refs:[12]},
 {term:'Cheeser',aliases:'cheese, flat-sided',tags:['choosing','collecting'],evidence:'comparison',place:'Unlocated variant; Surrey not established',date:'2021 guide',definition:'A name for a flat-sided conker.',note:'Do not infer a county or 1979 school vocabulary from an undated regional label.',refs:[4]},
 {term:'Cheggers / obblyonkers',aliases:'cheggies, obbley onkers',tags:['collecting','playing'],evidence:'comparison',place:'Regional names, not mapped by this evidence',date:'2021 guide',definition:'Alternative conker names reported in a later guide.',note:'Useful leads for a former pupil to locate and date, not established late-1970s Surrey usage.',refs:[4]},
 {term:'Spare',aliases:'reserve, pocketful, replacements',tags:['choosing','keeping','ending'],evidence:'reconstruction',place:'The imagined school season',date:'c.1979 scene',definition:'An unplayed replacement. A pocketful of spares makes the early season feel different from the last week.',note:'The season narrative gives supply a role. It does not claim a typical number of nuts per child.',refs:[]},
 {term:'String / shoelace',aliases:'bootlace, lace, thread',tags:['making','playing','keeping'],evidence:'comparison',place:'General game equipment',date:'Modern practical account',definition:'The link between hand and conker, threaded through the seed and secured below.',note:'An old lace and a piece of string need not swing identically. Exact lengths were not necessarily standardised at school.',refs:[5]},
 {term:'Hole and knot',aliases:'pierce, drill, skewer, threading',tags:['making','keeping'],evidence:'comparison',place:'General preparation',date:'Modern practical account',definition:'A central hole takes the string; a sufficiently large knot stops the conker sliding off.',note:'Get adult help making the hole. Replacing string is not replacing the nut.',refs:[5]},
 {term:'Vinegar',aliases:'soaking, hardening, secret',tags:['making','claiming'],evidence:'memory',place:'1970s schoolchildren; no particular school',date:'Recalled in 2022',definition:'A remembered hardening treatment, with a reputation out of proportion to the evidence offered here.',note:'A report of use is not proof that it improved strength. No treatment recipe is supplied.',refs:[7]},
 {term:'Baked / varnished',aliases:'oven, nail varnish, treated, cheat',tags:['making','claiming'],evidence:'comparison',place:'Unlocated treatment lore',date:'Modern account',definition:'Reported ways of trying to harden a nut or improve its chances.',note:'“Cheating” depends on the agreed rules. These reports neither prove effectiveness nor establish Buckland practice.',refs:[5]},
 {term:'Seasoner / yearsie',aliases:'old conker, last year, seasoned',tags:['making','keeping','claiming'],evidence:'comparison',place:'Unlocated; lower-confidence vocabulary lead',date:'2007 informal compilation',definition:'Later-collected names for a nut kept over from an earlier season.',note:'The term is not established for Surrey in 1977–1983. Keeping a nut for a year is also reported in the modern championship guide.',refs:[11,5]},
 {term:'None-er',aliases:'noner, none, new conker, zero',tags:['claiming','playing'],evidence:'comparison',place:'General scoring account',date:'2021 guide',definition:'A new or as-yet winless conker: score zero.',note:'Surviving a first swing does not itself end that status.',refs:[4]},
 {term:'Oner / one-er',aliases:'one, oners, one winner',tags:['claiming','playing'],evidence:'period',place:'Dulwich, south London',date:'Recorded 1983',definition:'The one-victory name in the recorded account.',note:'Compare simple wins with inherited scores in the calculator.',refs:[1]},
 {term:'Twoer / two-er',aliases:'two, three-er, threer, winner',tags:['claiming','playing'],evidence:'period',place:'Dulwich, south London',date:'Recorded 1983',definition:'The two-victory name; the number sequence continues.',note:'These are conker ranks, not names for two swings.',refs:[1]},
 {term:'Hundred up',aliases:'up, score, inherited, reputation',tags:['claiming'],evidence:'period',place:'Stoke Newington, north London',date:'Recorded 1983',definition:'A recorded style of stating a conker’s score.',note:'The printed arithmetic is tentative; it cannot settle a universal plus-one rule.',refs:[1]},
 {term:'Bagsie first cracks!',aliases:'first go, first strike, bagsy',tags:['claiming','playing'],evidence:'period',place:'Wigan, north-west England',date:'Reported 1970; earlier comparison',definition:'A cry claiming the first shot, located to Wigan in a contemporary review of the Opies.',note:'Evidence for a place and an earlier date, not all northern schools in 1979.',refs:[8]},
 {term:'Strike / turn',aliases:'swing, hit, miss, round',tags:['playing'],evidence:'comparison',place:'Rule-dependent vocabulary',date:'Later practical guides',definition:'An attempt to hit is a strike. A turn may contain one attempt, retries after misses, or an agreed group of strikes.',note:'A “round” might mean different things in recollection. Ask whether it meant a swing, a bout, or a tournament stage.',refs:[4,6,9]},
 {term:'Strings / snags',aliases:'tangles, clinks, clinch',tags:['playing','claiming'],evidence:'comparison',place:'Variants; local period distribution unresolved',date:'Undated later guide',definition:'Tangled-lace vocabulary; a quick call may claim an extra go in some versions.',note:'Elsewhere tangles are simply undone or penalised. Shared words need not imply shared consequences.',refs:[9,6]},
 {term:'Windmill',aliases:'round the world, circle, circling',tags:['playing','claiming'],evidence:'period',place:'Stoke Newington, north London',date:'Recorded 1983',definition:'A circling hit described as earning another turn.',note:'“Round the world” is a related later label, not necessarily this speaker’s wording.',refs:[1]},
 {term:'Stampsies',aliases:'stamps, stamping, dropped',tags:['playing','claiming'],evidence:'period',place:'Dulwich, south London',date:'Recorded 1983',definition:'The dropped-conker stamping convention.',note:'Described as historical custom, not recommended play.',refs:[1]},
 {term:'No stampsies',aliases:'no stamps, protection, agreement',tags:['playing','claiming'],evidence:'period',place:'Dulwich, south London',date:'Recorded 1983',definition:'In this account, protection agreed before play.',note:'Do not collapse advance agreement into a last-second rescue cry.',refs:[1]},
 {term:'Scrambles',aliases:'give away, throw, surplus',tags:['collecting','ending'],evidence:'period',place:'Dulwich, south London',date:'Recorded 1983',definition:'A call accompanying conkers thrown up for others to claim.',note:'A reminder that the season has distribution and disposal, not only fights.',refs:[1]},
 {term:'Split / chip',aliases:'crack, scar, white, damage',tags:['choosing','playing','keeping'],evidence:'reconstruction',place:'Practical descriptive language',date:'Reconstructed season',definition:'Visible damage to inspect between games. A small chip and a conker breaking apart are not the same event.',note:'No historical wear scale is claimed. The demonstration’s condition bars are only a model.',refs:[]},
 {term:'Re-thread',aliases:'rethread, knot, maintenance, repair, lace',tags:['making','keeping'],evidence:'comparison',place:'Modern competition comparison',date:'Rules accessed 2026',definition:'Put an intact nut back on its string after it comes off.',note:'A modern explicit rule helps explain the physical distinction; whether your school allowed it remains a local question.',refs:[6]},
 {term:'Champion',aliases:'hardy, best, unbeaten',tags:['claiming','keeping'],evidence:'reconstruction',place:'The imagined school season',date:'c.1979 scene',definition:'The treasured survivor, perhaps with only a few victories. Not necessarily the winner of an organised tournament.',note:'A descriptive reputation label here, not a recovered technical Surrey rank.',refs:[]},
 {term:'Retired',aliases:'drawer, kept, keepsake',tags:['keeping','ending'],evidence:'reconstruction',place:'The imagined school season',date:'c.1979 scene',definition:'Put away without another game. The nut survives; its playing career stops.',note:'An interpretive label rather than a claim about what children called this ending.',refs:[]},
 {term:'Last conker',aliases:'scarcity, no opponent, season over, ran out',tags:['keeping','ending'],evidence:'reconstruction',place:'The remembered seasonal arc in the brief',date:'Reconstructed season',definition:'The final playable nut—or the one left when nobody else brings one.',note:'An undefeated survivor is not proof of an undefeated season full of games. Sometimes the opponents simply disappear.',refs:[]}
];
let act = 0;
function showAct(index, focusTab = false) {
 act = Math.max(0, Math.min(5, index));
 $$('.season-panel').forEach((p,i) => {p.hidden = i !== act; p.setAttribute('role','tabpanel'); p.setAttribute('aria-labelledby',`tab-${i}`);});
 $$('.season-tabs button').forEach((b,i) => {b.setAttribute('aria-selected',String(i === act)); b.tabIndex = i === act ? 0 : -1;});
 $('#previous-act').disabled = act === 0; $('#next-act').disabled = act === 5;
 $('#act-counter').textContent = `${act+1} of 6`;
 if(focusTab) $(`#tab-${act}`).focus();
}
$$('[data-act]').forEach(b => {b.addEventListener('click',() => showAct(Number(b.dataset.act))); b.addEventListener('keydown',e => {let n = act; if(e.key==='ArrowRight') n=(act+1)%6; else if(e.key==='ArrowLeft') n=(act+5)%6; else if(e.key==='Home') n=0; else if(e.key==='End') n=5; else return; e.preventDefault(); showAct(n,true);});});
$$('[data-reset-season]').forEach(a=>a.addEventListener('click',()=>showAct(0)));
$('#previous-act').addEventListener('click',() => showAct(act-1)); $('#next-act').addEventListener('click',() => showAct(act+1));

let expanded = false;
const more = document.createElement('button'); more.className='action secondary'; more.type='button'; more.style.marginTop='20px'; $('#word-grid').after(more);
function renderWords() {
 const query = $('#word-search').value.trim().toLowerCase(); const tag = $('#tag-filter').value; const evidence = $('#evidence-filter').value;
 const matching = lexicon.filter(w => (tag==='all'||w.tags.includes(tag))&&(evidence==='all'||w.evidence===evidence)&&[w.term,w.aliases,w.definition,w.place,...w.tags].join(' ').toLowerCase().includes(query));
 const shown = expanded || query || tag!=='all' || evidence!=='all' ? matching : matching.slice(0,9);
 $('#word-count').textContent = `${shown.length} of ${matching.length} matching entries · ${lexicon.length} in the seed collection`;
 $('#word-grid').innerHTML = shown.length ? shown.map(w => `<article class="word-card" data-evidence="${w.evidence}"><span class="provenance">${evidenceNames[w.evidence]}</span><h3>${esc(w.term)}</h3><div class="meta">${esc(w.place)}<br>${esc(w.date)}</div><p>${esc(w.definition)} ${sources(w.refs)}</p><details><summary>Meaning, limits &amp; related words</summary><p>${esc(w.note)}</p><p class="meta">Also search: ${esc(w.aliases)}</p></details><div class="card-tags">${w.tags.map(t=>`<button type="button" data-tag="${t}">#${t}</button>`).join('')}</div></article>`).join('') : '<p class="empty-results">No matching word. Try a broader spelling, choose “All tags”, or add your own memory below.</p>';
 more.hidden = shown.length === matching.length; more.textContent = `Open all ${matching.length} words ↓`;
}
more.addEventListener('click',() => {expanded=true;renderWords();});
['word-search','tag-filter','evidence-filter'].forEach(id => $(`#${id}`).addEventListener('input',renderWords));
$('#word-grid').addEventListener('click',e => {const b=e.target.closest('[data-tag]');if(!b)return;$('#tag-filter').value=b.dataset.tag;$('#word-search').value='';$('#evidence-filter').value='all';renderWords();$('#word-search').focus({preventScroll:true});$('#words').scrollIntoView();});
$$('[data-word]').forEach(b => b.addEventListener('click',() => {$('#word-search').value=b.dataset.word;$('#tag-filter').value='all';$('#evidence-filter').value='all';renderWords();$('#words').scrollIntoView();$('#word-search').focus({preventScroll:true});}));

function calculate() {
 const fields=[$('#your-score'),$('#their-score')], values=fields.map(f=>Number(f.value));
 const valid = fields.every((f,i) => f.value.trim()!=='' && Number.isInteger(values[i]) && values[i]>=0 && values[i]<=999);
 if(!valid){$('#score-result').textContent='Use whole scores from 0 to 999.';$('#score-explanation').textContent='Both scores are needed to compare the conventions.';return;}
 const [a,b]=values, inherited=$('#scoring-rule').value==='inherit', total=a+1+(inherited?b:0);
 $('#score-result').textContent=`${a}${inherited?` + ${b}`:''} + 1 = ${total} · ${rank(total)}`;
 $('#score-explanation').textContent=inherited?'The total includes inherited points. It need not equal the number of games this particular nut has won.':'One more completed victory. The defeated nut’s score does not transfer under this agreement.';
}
['your-score','their-score','scoring-rule'].forEach(id=>$(`#${id}`).addEventListener('input',calculate));

// A finite, reproducible toy model. Condition values and outcomes are invented.
const nutSpecs=[{name:'small round one',hp:14},{name:'handsome large one',hp:11},{name:'flat-edged one',hp:7}];
const rivals=[{hp:4,score:0},{hp:5,score:1},{hp:7,score:2},{hp:4,score:0},{hp:6,score:1}];
let game;
function resetGame() {
 game={started:false,phase:'ready',used:[],rival:0,current:null,opponent:null,turn:0,totalWins:0,rule:'simple',history:[],checked:true};
 $('#game-nut').disabled=false;$('#game-rule').disabled=false;$('#game-nut').value='0';$('#game-rule').value='simple';
 $$('#game-nut option').forEach(o=>o.disabled=false);
 log('The leaves are still falling. There are three hopeful conkers in your pocket. Choose one and make a start.');renderGame();
}
function log(text){$('#game-log').textContent=text;}
function takeNut() {
 const index=Number($('#game-nut').value);
 if(game.used.includes(index))return;
 game.used.push(index);game.current={...nutSpecs[index],max:nutSpecs[index].hp,index,score:0,wins:0};
 game.started=true;game.checked=true;$('#game-rule').disabled=true;$('#game-nut').disabled=true;
 $$('#game-nut option').forEach(o=>o.disabled=game.used.includes(Number(o.value)));
 beginBout();
}
function beginBout(){game.opponent={...rivals[game.rival],max:rivals[game.rival].hp};game.phase='strike';log(`Challenger ${game.rival+1} brings a ${rank(game.opponent.score)}. Your ${game.current.name} is a ${rank(game.current.score)}. You have first strike.`);renderGame();}
function renderGame(){
 const g=game,c=g.current,o=g.opponent;
 const remaining=3-g.used.length+(c&&c.hp>0?1:0);
 $('#game-stats').innerHTML=`<span><b>${g.started?remaining:3}</b>playable nuts left</span><span><b>${Math.max(0,5-g.rival)}</b>challengers remaining</span><span><b>${c?rank(c.score):'none-er'}</b>${c?`${c.wins} actual win${c.wins===1?'':'s'} with this nut`:'current rank'}</span>`;
 $('#your-wear').max=c?c.max:14;$('#your-wear').value=c?Math.max(0,c.hp):14;$('#their-wear').max=o?o.max:4;$('#their-wear').value=o?Math.max(0,o.hp):4;
 $('#your-pendulum .nut').classList.toggle('cracked',Boolean(c&&c.hp<c.max*.65));$('#their-pendulum .nut').classList.toggle('cracked',Boolean(o&&o.hp<o.max*.65));
 $('#your-pendulum').style.opacity=c&&c.hp<=0?'.25':'1';$('#their-pendulum').style.opacity=o&&o.hp<=0?'.25':'1';
 const labels={ready:'Thread it & start',strike:'Take a careful swing',receive:'Hold it still',between:'Find the next opponent',spare:'Thread the next conker',slipped:'Re-thread the same nut',ended:'The season is over'};
 $('#game-main').textContent=labels[g.phase];$('#game-main').disabled=g.phase==='ended';$('#game-hard').hidden=g.phase!=='strike';$('#game-maintain').hidden=g.phase!=='between';$('#game-maintain').disabled=g.checked;
 $('#game-care').textContent=g.phase==='ended'?g.history.join(' · '):g.phase==='between'?(g.checked?'Knot checked. No damage repaired; no score changed.':'Between games: inspect the chip, check the knot, wind in the loose lace. The wear stays.'):'One attempt per turn. A miss adds no score. Hard swings also wear your own nut.';
}
function endSeason(reason){game.phase='ended';$('#game-nut').disabled=true;$('#game-rule').disabled=true;const c=game.current;
 if(c&&c.hp>0){game.history.push(`${c.name}: ${rank(c.score)}, kept`);log(`${reason} Your ${c.name} is still a ${rank(c.score)}, with ${c.wins} actual ${c.wins===1?'victory':'victories'}. But no one else brings a conker out to play. Put it in the drawer. Somewhere on the playground, a different game has started.`);}else{log(`${reason} The last fragment goes into the leaves. ${game.totalWins} games won across your conkers; now a different game has started. There is no final to wait for.`);}renderGame();}
function settle(text){
 const c=game.current,o=game.opponent;
 if(c.hp>0 && o.hp>0)return false;
 const won=c.hp>0;
 if(won){c.wins++;game.totalWins++;c.score+=1+(game.rule==='inherit'?o.score:0);text+=` Their conker breaks. Yours is now a ${rank(c.score)} (${c.wins} actual ${c.wins===1?'win':'wins'}).`;}
 else{game.history.push(`${c.name}: ${rank(c.score)}, broken`);text+=o.hp<=0?' Both nuts break: no winner in this demonstration.':' Your conker breaks. This nut’s career is over.';}
 game.rival++;game.checked=false;
 if(game.rival>=rivals.length){endSeason('The fifth challenger has gone, and the collecting spots are picked over.');return true;}
 if(!won&&game.used.length===nutSpecs.length){endSeason('All three of your conkers are gone.');return true;}
 if(won){game.phase='between';text+=' Check it between games; it will carry this damage into the next one.';}
 else{game.phase='spare';$('#game-nut').disabled=false;const next=nutSpecs.findIndex((_,i)=>!game.used.includes(i));$('#game-nut').value=String(next);text+=' Choose a spare from the remaining pocketful. It starts at zero.';}
 log(text);renderGame();return true;
}
function swing(hard=false){
 if(game.phase!=='strike'&&game.phase!=='receive')return;
 const attacking=game.phase==='strike',c=game.current,o=game.opponent;
 game.turn++;
 const element=attacking?$('#your-pendulum'):$('#their-pendulum');
 const gap=Math.abs($('#their-pendulum').offsetLeft-$('#your-pendulum').offsetLeft), theta=Math.min(.77,Math.asin(Math.min(.8,gap/290))), direction=attacking?1:-1;
 element.style.setProperty('--lunge-x',`${direction*(gap-145*Math.sin(theta))}px`);element.style.setProperty('--lunge-y',`${145*(1-Math.cos(theta))}px`);element.style.setProperty('--angle',`${-direction*theta}rad`);
 element.classList.remove('swing');void element.offsetWidth;element.classList.add('swing');
 const roll=(game.turn*7+game.rival*5+c.index*3)%11;
 let text;
 if(roll===0||roll===6){text=attacking?'A swish of string. You miss; there is no score to claim.':'The other conker whistles past. Your nut survives the miss, but that is not a win.';}
 else if(attacking){const force=hard?3:2;o.hp-=force;if(hard||roll===3)c.hp--;text=hard?'A heavy crack. More force, but wear on your own nut too.':'A clean knock. Their shell takes the blow.';}
 else{c.hp-=2;if(roll===3)o.hp--;text='Hold still. Their conker connects; yours takes another scar.';}
 if(settle(text))return;
 game.phase=attacking?'receive':'strike';text+=attacking?' Now hold yours out.':' Your turn to strike.';
 log(text);renderGame();
}
$('#game-main').addEventListener('click',()=>{
 if(game.phase==='ready'){game.rule=$('#game-rule').value;takeNut();}
 else if(game.phase==='spare')takeNut();
 else if(game.phase==='strike'||game.phase==='receive')swing(false);
 else if(game.phase==='between'){if(!game.checked&&game.rival===2){game.phase='slipped';log('The loose knot has pulled through. The same conker is intact, on the ground. Under your no-stamps agreement you may re-thread it. Its rank stays; its damage does too.');renderGame();}else beginBout();}
 else if(game.phase==='slipped'){game.checked=true;beginBout();}
});
$('#game-hard').addEventListener('click',()=>swing(true));
$('#game-maintain').addEventListener('click',()=>{if(game.phase!=='between')return;game.checked=true;log(`You examine the scar and secure the knot. Still the same ${rank(game.current.score)}. A tidier lace is not a new shell: the existing damage stays.`);renderGame();});
$('#game-reset').addEventListener('click',resetGame);

const surreyHtml=$('#place-note').innerHTML;
const places={surrey:surreyHtml,dulwich:'<span class="provenance">Child testimony · 1983</span><h3>Dulwich, south London</h3><p>The vocabulary cards preserve this account’s victory names, advance no-stamping agreement and giveaway call. Together they describe claims, protection and the circulation of surplus conkers—not just striking technique. <a href="#s1">[1]</a></p><p>This is nearby comparative evidence for a Surrey reconstruction, not a Surrey transcript. Nor does recording these words here prove they were exclusive to Dulwich.</p>',stoke:'<span class="provenance">Child testimony · 1983</span><h3>Stoke Newington, north London</h3><p>The circling-hit bonus and “up” score language give a different glimpse of the game. The printed account flags its arithmetic as uncertain. <a href="#s1">[1]</a></p><p>Keep the uncertainty: do not turn this into proof that all northern London schools used one formula, or that Dulwich children never used a circling-hit rule.</p>',wigan:'<span class="provenance">Contemporary review · 1970 · earlier comparison</span><h3>Wigan, north-west England</h3><p>The first-strike cry in the word index is located to Wigan by George Steiner’s review of the Opies. <a href="#s8">[8]</a></p><p>This supplies a real northern point of comparison, but is earlier than the main period. It does not establish a Lancashire-wide rule, or prove the phrase was absent in southern England.</p>'};
$$('[data-place]').forEach(b=>b.addEventListener('click',()=>{$$('[data-place]').forEach(p=>p.setAttribute('aria-pressed',String(p===b)));$('#place-note').innerHTML=places[b.dataset.place];}));

// Small, opt-in personal notebook. The storage key is scoped to this page only.
const storageKey='conker-fieldbook-memories-v1';let memories=[];let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(saved))memories=saved.filter(n=>n&&['term','place','text','tags'].every(k=>typeof n[k]==='string')).slice(0,30).map(n=>({term:n.term.slice(0,70),place:n.place.slice(0,100),text:n.text.slice(0,700),tags:n.tags.slice(0,100)}));}catch{storageOK=false;}
function renderMemories(){const list=$('#memory-list');list.replaceChildren();memories.forEach(n=>{const p=document.createElement('p');p.className='local-note';const strong=document.createElement('strong');strong.textContent=`${n.term} — ${n.place}`;p.append(strong,document.createElement('br'),document.createTextNode(n.text),document.createElement('br'),document.createTextNode(`Tags: ${n.tags||'untagged'} · Unverified personal memory`));list.append(p);});}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(memories));storageOK=true;}catch{storageOK=false;}}
$('#memory-form').addEventListener('submit',e=>{e.preventDefault();if(memories.length>=30){$('#memory-status').textContent='This notebook holds 30 entries. Export a copy before clearing it to start another.';return;}const n={term:$('#memory-term').value.trim(),place:$('#memory-place').value.trim(),text:$('#memory-text').value.trim(),tags:$('#memory-tags').value.trim()};if(!n.term||!n.place||!n.text){$('#memory-status').textContent='Please add a word, a place/date and the memory itself.';return;}memories.push(n);persist();renderMemories();$('#memory-form').reset();$('#memory-status').textContent=storageOK?'Saved on this device only. Nothing has been published.':'Kept for this session only: browser storage is unavailable. Export now to keep a copy.';});
function downloadJSON(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#export-memories').addEventListener('click',()=>downloadJSON({type:'Unverified personal conker memories',entries:memories},'my-conker-memories.json'));
$('#clear-memories').addEventListener('click',()=>{if(!memories.length){$('#memory-status').textContent='There are no notes to clear.';return;}if(!window.confirm('Clear only your conker fieldbook notes on this device? Export them first to keep a copy.'))return;memories=[];persist();renderMemories();$('#memory-status').textContent=storageOK?'Your local conker notes have been cleared.':'Notes cleared for this session; browser storage could not be updated.';});
const exportWords=document.createElement('button');exportWords.className='action secondary';exportWords.type='button';exportWords.textContent='Export the seed folksonomy';exportWords.style.margin='20px 0 0 12px';more.after(exportWords);exportWords.addEventListener('click',()=>downloadJSON({title:'Until the conkers ran out',scope:'England c.1977–1983, bounded Surrey reconstruction; evidence dates vary',status:'Curated seeds, not universal terms or verified community submissions',terms:lexicon,sources:$$('.sources li').map(li=>({id:li.id,reference:li.textContent.trim(),links:[...li.querySelectorAll('a')].map(a=>a.href)}))},'conker-folksonomy.json'));

renderWords();calculate();resetGame();renderMemories();showAct(0);document.documentElement.classList.add('enhanced');
})();

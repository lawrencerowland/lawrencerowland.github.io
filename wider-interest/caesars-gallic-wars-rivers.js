'use strict';
// Selected passages checked against the linked public-domain source, 3 October 2026.
const references = [
  {
    "seq": 1,
    "legacySeq": [
      1,
      31
    ],
    "book": 1,
    "chapter": 1,
    "sentence": "The river Garonne separates the Gauls from the Aquitani; the Marne and the Seine separate them from the Belgae.",
    "rivers": [
      "Garonne",
      "Marne",
      "Seine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00061"
  },
  {
    "seq": 2,
    "legacySeq": [
      2,
      32
    ],
    "book": 1,
    "chapter": 1,
    "sentence": "Of all these, the Belgae are the bravest, because they are farthest from the civilisation and refinement of [our] Province, and merchants least frequently resort to them and import those things which tend to effeminate the mind; and they are the nearest to the Germans, who dwell beyond the Rhine, with whom they are continually waging war; for which reason the Helvetii also surpass the rest of the Gauls in valour, as they contend with the Germans in almost daily battles, when they either repel them from their own territories, or themselves wage war on their frontiers.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00061"
  },
  {
    "seq": 3,
    "legacySeq": [
      3,
      33
    ],
    "book": 1,
    "chapter": 1,
    "sentence": "One part of these, which it has been said that the Gauls occupy, takes its beginning at the river Rhone: it is bounded by the river Garonne, the ocean, and the territories of the Belgae: it borders, too, on the side of the Sequani and the Helvetii, upon the river Rhine, and stretches towards the north.",
    "rivers": [
      "Garonne",
      "Rhine",
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00061"
  },
  {
    "seq": 4,
    "legacySeq": [
      4,
      34
    ],
    "book": 1,
    "chapter": 1,
    "sentence": "The Belgae rise from the extreme frontier of Gaul, extend to the lower part of the river Rhine; and look towards the north and the rising sun.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00061"
  },
  {
    "seq": 5,
    "legacySeq": [
      5,
      35
    ],
    "book": 1,
    "chapter": 1,
    "sentence": "Aquitania extends from the river Garonne to the Pyrenaean mountains and to that part of the ocean which is near Spain: it looks between the setting of the sun and the north star.",
    "rivers": [
      "Garonne"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00061"
  },
  {
    "seq": 6,
    "legacySeq": [
      6,
      36
    ],
    "book": 1,
    "chapter": 2,
    "sentence": "To this he the more easily persuaded them, because the Helvetii are confined on every side by the nature of their situation; on one side by the Rhine, a very broad and deep river, which separates the Helvetian territory from the Germans; on a second side by the Jura, a very high mountain which is [situated] between the Sequani and the Helvetii; on a third by the Lake of Geneva, and by the river Rhone, which separates our Province from the Helvetii.",
    "rivers": [
      "Rhine",
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00062"
  },
  {
    "seq": 7,
    "legacySeq": [
      7,
      37
    ],
    "book": 1,
    "chapter": 5,
    "sentence": "They persuade the Rauraci, and the Tulingi, and the Latobrigi, their neighbours, to adopt the same plan, and after burning down their towns and villages, to set out with them: and they admit to their party and unite to themselves as confederates the Boii, who had dwelt on the other side of the Rhine, and had crossed over into the Norican territory, and assaulted Noreia.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00065"
  },
  {
    "seq": 8,
    "legacySeq": [
      8,
      38
    ],
    "book": 1,
    "chapter": 6,
    "sentence": "There were in all two routes by which they could go forth from their country—one through the Sequani, narrow and difficult, between Mount Jura and the river Rhone (by which scarcely one waggon at a time could be led; there was, moreover, a very high mountain overhanging, so that a very few might easily intercept them); the other, through our Province, much easier and freer from obstacles, because the Rhone flows between the boundaries of the Helvetii and those of the Allobroges, who had lately been subdued, and is in some places crossed by a ford.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00066"
  },
  {
    "seq": 9,
    "legacySeq": [
      9,
      39
    ],
    "book": 1,
    "chapter": 6,
    "sentence": "Having provided everything for the expedition, they appoint a day on which they should all meet on the bank of the Rhone.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00066"
  },
  {
    "seq": 10,
    "legacySeq": [
      10,
      40
    ],
    "book": 1,
    "chapter": 8,
    "sentence": "Meanwhile, with the legion which he had with him and the soldiers who had assembled from the Province, he carries along for nineteen [Roman, not quite eighteen English] miles a wall, to the height of sixteen feet, and a trench, from the lake of Geneva, which flows into the river Rhone, to Mount Jura, which separates the territories of the Sequani from those of the Helvetii.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00068"
  },
  {
    "seq": 11,
    "legacySeq": [
      11,
      41
    ],
    "book": 1,
    "chapter": 8,
    "sentence": "The Helvetii, disappointed in this hope, tried if they could force a passage (some by means of a bridge of boats and numerous rafts constructed for the purpose; others, by the fords of the Rhone, where the depth of the river was least, sometimes by day, but more frequently by night), but being kept at bay by the strength of our works, and by the concourse of the soldiers, and by the missiles, they desisted from this attempt.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00068"
  },
  {
    "seq": 12,
    "legacySeq": [
      12,
      42
    ],
    "book": 1,
    "chapter": 10,
    "sentence": "These people are the first beyond the Province on the opposite side of the Rhone.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00070"
  },
  {
    "seq": 13,
    "legacySeq": [
      13,
      43
    ],
    "book": 1,
    "chapter": 11,
    "sentence": "At the same time the Ambarri, the friends and kinsmen of the Aedui, apprise Caesar that it was not easy for them, now that their fields had been devastated, to ward off the violence of the enemy from their towns: the Allobroges likewise, who had villages and possessions on the other side of the Rhone, betake themselves in flight to Caesar and assure him that they had nothing remaining, except the soil of their land.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00071"
  },
  {
    "seq": 14,
    "legacySeq": [
      14,
      44
    ],
    "book": 1,
    "chapter": 12,
    "sentence": "There is a river [called] the Saone, which flows through the territories of the Aedui and Sequani into the Rhone with such incredible slowness, that it cannot be determined by the eye in which direction it flows.",
    "rivers": [
      "Rhone",
      "Saone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00072"
  },
  {
    "seq": 15,
    "legacySeq": [
      15,
      45
    ],
    "book": 1,
    "chapter": 12,
    "sentence": "When Caesar was informed by spies that the Helvetii had already conveyed three parts of their forces across that river, but that the fourth part was left behind on this side of the Saone, he set out from the camp with three legions during the third watch, and came up with that division which had not yet crossed the river.",
    "rivers": [
      "Saone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00072"
  },
  {
    "seq": 16,
    "legacySeq": [
      16,
      46
    ],
    "book": 1,
    "chapter": 13,
    "sentence": "This battle ended, that he might be able to come up with the remaining forces of the Helvetii, he procures a bridge to be made across the Saone, and thus leads his army over.",
    "rivers": [
      "Saone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00073"
  },
  {
    "seq": 17,
    "legacySeq": [
      17,
      47
    ],
    "book": 1,
    "chapter": 16,
    "sentence": "Meanwhile, Caesar kept daily importuning the Aedui for the corn which they had promised in the name of their state; for, in consequence of the coldness (Gaul being, as before said, situated towards the north), not only was the corn in the fields not ripe, but there was not in store a sufficiently large quantity even of fodder: besides he was unable to use the corn which he had conveyed in ships up the river Saone, because the Helvetii, from whom he was unwilling to retire, had diverted their march from the Saone.",
    "rivers": [
      "Saone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00076"
  },
  {
    "seq": 18,
    "legacySeq": [
      18,
      48
    ],
    "book": 1,
    "chapter": 27,
    "sentence": "Whilst those things are being sought for and got together, after a night's interval, about 6000 men of that canton which is called the Verbigene, whether terrified by fear, lest, after delivering up their arms, they should suffer punishment, or else induced by the hope of safety, because they supposed that, amid so vast a multitude of those who had surrendered themselves, their flight might either be concealed or entirely overlooked, having at night-fall departed out of the camp of the Helvetii, hastened to the Rhine and the territories of the Germans.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00087"
  },
  {
    "seq": 19,
    "legacySeq": [
      19,
      49
    ],
    "book": 1,
    "chapter": 28,
    "sentence": "This he did, chiefly on this account, because he was unwilling that the country, from which the Helvetii had departed, should be untenanted, lest the Germans, who dwell on the other side of the Rhine, should, on account of the excellence of the lands, cross over from their own territories into those of the Helvetii, and become borderers upon the province of Gaul and the Allobroges.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00088"
  },
  {
    "seq": 20,
    "legacySeq": [
      20,
      50
    ],
    "book": 1,
    "chapter": 31,
    "sentence": "That about 15,000 of them [i.e. of the Germans] had at first crossed the Rhine: but after that these wild and savage men had become enamoured of the lands and the refinement and the abundance of the Gauls, more were brought over, that there were now as many as 120,000 of them in Gaul: that with these the Aedui and their dependants had repeatedly struggled in arms, that they had been routed and had sustained a great calamity—had lost all their nobility, all their senate, all their cavalry.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00093"
  },
  {
    "seq": 21,
    "legacySeq": [
      21,
      51
    ],
    "book": 1,
    "chapter": 31,
    "sentence": "The consequence would be, that in a few years they would all be driven from the territories of Gaul, and all the Germans would cross the Rhine; for neither must the land of Gaul be compared with the land of the Germans, nor must the habit of living of the latter be put on a level with that of the former.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00093"
  },
  {
    "seq": 22,
    "legacySeq": [
      22,
      52
    ],
    "book": 1,
    "chapter": 31,
    "sentence": "If these things were to be disclosed to Ariovistus, [Divitiacus adds] that he doubts not that he would inflict the most severe punishment on all the hostages who are in his possession, [and says] that Caesar could, either by his own influence and by that of his army, or by his late victory, or by name of the Roman people, intimidate him, so as to prevent a greater number of Germans being brought over the Rhine, and could protect all Gaul from the outrages of Ariovistus.\"",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00093"
  },
  {
    "seq": 23,
    "legacySeq": [
      23,
      53
    ],
    "book": 1,
    "chapter": 33,
    "sentence": "That, moreover, the Germans should by degrees become accustomed to cross the Rhine, and that a great body of them should come into Gaul, he saw [would be] dangerous to the Roman people, and judged that wild and savage men would not be likely to restrain themselves, after they had possessed themselves of all Gaul, from going forth into the province and thence marching into Italy (as the Cimbri and Teutones had done before them), particularly as the Rhone [was the sole barrier that] separated the Sequani from our province.",
    "rivers": [
      "Rhine",
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00095"
  },
  {
    "seq": 24,
    "legacySeq": [
      24,
      54
    ],
    "book": 1,
    "chapter": 35,
    "sentence": "When these answers were reported to Caesar, he sends ambassadors to him a second time with this message \"Since, after having been treated with so much kindness by himself and the Roman people (as he had in his consulship [B.C. 59] been styled 'king and friend' by the senate), he makes this recompense to [Caesar] himself and the Roman people, [viz.] that when invited to a conference he demurs, and does not think that it concerns him to advise and inform himself about an object of mutual interest, these are the things which he requires of him; first, that he do not any more bring over any body of men across the Rhine into Gaul; in the next place, that he restore the hostages which he has from the Aedui, and grant the Sequani permission to restore to them with his consent those hostages which they have, and that he neither provoke the Aedui by outrage nor make war upon them or their allies; if he would accordingly do this,\" [Caesar says] that \"he himself and the Roman people will entertain a perpetual feeling of favour and friendship towards him; but that if he [Caesar] does not obtain [his desires], that he (forasmuch as in the consulship of Marcus Messala and Marcus Piso [B.C. 61] the senate had decreed that, whoever should have the administration of the province of Gaul should, as far as he could do so consistently with the interests of the republic, protect the Aedui and the other friends of the Roman people) will not overlook the wrongs of the Aedui.\"",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00097"
  },
  {
    "seq": 25,
    "legacySeq": [
      25,
      55
    ],
    "book": 1,
    "chapter": 37,
    "sentence": "At the same time that this message was delivered to Caesar, ambassadors came from the Aedui and the Treviri; from the Aedui to complain that the Harudes, who had lately been brought over into Gaul, were ravaging their territories; that they had not been able to purchase peace from Ariovistus, even by giving hostages: and from the Treviri, [to state] that a hundred cantons of the Suevi had encamped on the banks of the Rhine, and were attempting to cross it; that the brothers, Nasuas and Cimberius, headed them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00099"
  },
  {
    "seq": 26,
    "legacySeq": [
      26,
      56
    ],
    "book": 1,
    "chapter": 38,
    "sentence": "Caesar thought that he ought to take the greatest precautions lest this should happen, for there was in that town a most ample supply of everything which was serviceable for war; and so fortified was it by the nature of the ground as to afford a great facility for protracting the war, inasmuch as the river Doubs almost surrounds the whole town, as though it were traced round it with a pair of compasses.",
    "rivers": [
      "Doubs"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00100"
  },
  {
    "seq": 27,
    "legacySeq": [
      27,
      57
    ],
    "book": 1,
    "chapter": 43,
    "sentence": "He informed him too, how old and how just were the grounds of connexion that existed between themselves [the Romans] and the Aedui, what decrees of the senate had been passed in their favour, and how frequent and how honourable; how from time immemorial the Aedui had held the supremacy of the whole of Gaul; even [said Caesar] before they had sought our friendship; that it was the custom of the Roman people to desire not only that its allies and friends should lose none of their property, but be advanced in influence, dignity, and honour: who then could endure that what they had brought with them to the friendship of the Roman people, should be torn from them?\" He then made the same demands which he had commissioned the ambassadors to make, that [Ariovistus] should not make war either upon the Aedui or their allies, that he should restore the hostages; that, if he could not send back to their country any part of the Germans, he should at all events suffer none of them any more to cross the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00105"
  },
  {
    "seq": 28,
    "legacySeq": [
      28,
      58
    ],
    "book": 1,
    "chapter": 44,
    "sentence": "Ariovistus replied briefly to the demands of Caesar; but expatiated largely on his own virtues, \"that he had crossed the Rhine not of his own accord, but on being invited and sent for by the Gauls; that he had not left home and kindred without great expectations and great rewards; that he had settlements in Gaul, granted by the Gauls themselves; that the hostages had been given by their own good-will; that he took by right of war the tribute which conquerors are accustomed to impose on the conquered; that he had not made war upon the Gauls, but the Gauls upon him; that all the states of Gaul came to attack him, and had encamped against him; that all their forces had been routed and beaten by him in a single battle; that if they chose to make a second trial, he was ready to encounter them again; but if they chose to enjoy peace, it was unfair to refuse the tribute, which of their own free-will they had paid up to that time.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00106"
  },
  {
    "seq": 29,
    "legacySeq": [
      29,
      59
    ],
    "book": 1,
    "chapter": 53,
    "sentence": "Thereupon the engagement was renewed, and all the enemy turned their backs, nor did they cease to flee until they arrived at the river Rhine, about fifty miles from that place.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00115"
  },
  {
    "seq": 30,
    "legacySeq": [
      30,
      60
    ],
    "book": 1,
    "chapter": 54,
    "sentence": "This battle having been reported beyond the Rhine, the Suevi, who had come to the banks of that river, began to return home, when the Ubii, who dwelt nearest to the Rhine, pursuing them, while much alarmed, slew a great number of them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00116"
  },
  {
    "seq": 31,
    "legacySeq": [
      61,
      69
    ],
    "book": 2,
    "chapter": 3,
    "sentence": "As he arrived there unexpectedly and sooner than any one anticipated, the Remi, who are the nearest of the Belgae to [Celtic] Gaul, sent to him Iccius and Antebrogius, [two of] the principal persons of the state, as their ambassadors: to tell him that they surrendered themselves and all their possessions to the protection and disposal of the Roman people: and that they had neither combined with the rest of the Belgae, nor entered into any confederacy against the Roman people: and were prepared to give hostages, to obey his commands, to receive him into their towns, and to aid him with corn and other things; that all the rest of the Belgae were in arms; and that the Germans, who dwell on this side the Rhine, had joined themselves to them; and that so great was the infatuation of them all that they could not restrain even the Suessiones, their own brethren and kinsmen, who enjoy the same rights, and the same laws, and who have one government and one magistracy [in common] with themselves, from uniting with them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00120"
  },
  {
    "seq": 32,
    "legacySeq": [
      62,
      70
    ],
    "book": 2,
    "chapter": 4,
    "sentence": "When Caesar inquired of them what states were in arms, how powerful they were, and what they could do in war, he received the following information: that the greater part of the Belgae were sprung from the Germans, and that having crossed the Rhine at an early period, they had settled there, on account of the fertility of the country, and had driven out the Gauls who inhabited those regions; and that they were the only people who, in the memory of our fathers, when all Gaul was overrun, had prevented the Teutones and the Cimbri from entering their territories; the effect of which was that, from the recollection of those events, they assumed to themselves great authority and haughtiness in military matters.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00121"
  },
  {
    "seq": 33,
    "legacySeq": [
      63,
      71
    ],
    "book": 2,
    "chapter": 5,
    "sentence": "After he perceived that all the forces of the Belgae, which had been collected in one place, were approaching towards him, and learnt from the scouts whom he had sent out, and [also] from the Remi, that they were not then far distant, he hastened to lead his army over the Aisne, which is on the borders of the Remi, and there pitched his camp.",
    "rivers": [
      "Aisne"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00122"
  },
  {
    "seq": 34,
    "legacySeq": [
      64,
      72
    ],
    "book": 2,
    "chapter": 9,
    "sentence": "The enemy immediately hastened from that place to the river Aisne, which it has been stated was behind our camp.",
    "rivers": [
      "Aisne"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00126"
  },
  {
    "seq": 35,
    "legacySeq": [
      65,
      73
    ],
    "book": 2,
    "chapter": 16,
    "sentence": "After he had made three days' march through their territories, he discovered from some prisoners, that the river Sambre was not more than ten miles from his camp: that all the Nervii had stationed themselves on the other side of that river, and together with the Atrebates and the Veromandui, their neighbours, were there awaiting the arrival of the Romans; for they had persuaded both these nations to try the same fortune of war [as themselves]: that the forces of the Aduatuci were also expected by them, and were on their march; that they had put their women, and those who through age appeared useless for war, in a place to which there was no approach for an army, on account of the marshes.",
    "note": "The translation calls the river “Sambre”. Caesar’s Sabis has also been identified with the Selle. The Sambre pin shows the older translation’s identification, not an established battle site.",
    "noteUrl": "https://thelandmarkcaesar.com/LandmarkCaesarWebEssays_5Jan2018.pdf",
    "rivers": [
      "Sambre"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00133"
  },
  {
    "seq": 36,
    "legacySeq": [
      66,
      74
    ],
    "book": 2,
    "chapter": 18,
    "sentence": "The nature of the ground which our men had chosen for the camp was this: A hill, declining evenly from the top, extended to the river Sambre, which we have mentioned above: from this river there arose a [second] hill of like ascent, on the other side and opposite to the former, and open from about 200 paces at the lowest part; but in the upper part, woody, (so much so) that it was not easy to see through it into the interior.",
    "note": "The translation calls the river “Sambre”. Caesar’s Sabis has also been identified with the Selle. The Sambre pin shows the older translation’s identification, not an established battle site.",
    "noteUrl": "https://thelandmarkcaesar.com/LandmarkCaesarWebEssays_5Jan2018.pdf",
    "rivers": [
      "Sambre"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00135"
  },
  {
    "seq": 37,
    "legacySeq": [
      67,
      75
    ],
    "book": 2,
    "chapter": 29,
    "sentence": "They were descended from the Cimbri and Teutones, who, when they were marching into our province and Italy, having deposited on this side the river Rhine such of their baggage-trains as they could not drive or convey with them, left 6000 of their men as a guard and defence for them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00146"
  },
  {
    "seq": 38,
    "legacySeq": [
      68,
      76
    ],
    "book": 2,
    "chapter": 35,
    "sentence": "These things being achieved, [and] all Gaul being subdued, so high an opinion of this war was spread among the barbarians, that ambassadors were sent to Caesar by those nations who dwelt beyond the Rhine, to promise that they would give hostages and execute his commands.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00152"
  },
  {
    "seq": 39,
    "legacySeq": [
      77
    ],
    "book": 3,
    "chapter": 1,
    "sentence": "When Caesar was setting out for Italy, he sent Servius Galba with the twelfth legion and part of the cavalry against the Nantuates, the Veragri, and Seduni, who extend from the territories of the Allobroges, and the lake of Geneva, and the river Rhone to the top of the Alps.",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00154"
  },
  {
    "seq": 40,
    "legacySeq": [
      78
    ],
    "book": 3,
    "chapter": 9,
    "sentence": "Caesar, being informed of these things by Crassus, since he was so far distant himself, orders ships of war to be built in the meantime on the river Loire, which flows into the ocean; rowers to be raised from the province; sailors and pilots to be provided.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00162"
  },
  {
    "seq": 41,
    "legacySeq": [
      79
    ],
    "book": 3,
    "chapter": 11,
    "sentence": "He therefore sends T. Labienus, his lieutenant, with the cavalry to the Treviri, who are nearest to the river Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00164"
  },
  {
    "seq": 42,
    "legacySeq": [
      80
    ],
    "book": 4,
    "chapter": 1,
    "sentence": "The following winter (this was the year in which Cn. Pompey and M. Crassus were consuls), those Germans [called] the Usipetes, and likewise the Tenchtheri, with a great number of men, crossed the Rhine, not far from the place at which that river discharges itself into the sea.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00184"
  },
  {
    "seq": 43,
    "legacySeq": [
      81
    ],
    "book": 4,
    "chapter": 3,
    "sentence": "On the other side they border on the Ubii, whose state was large and flourishing, considering the condition of the Germans, and who are somewhat more refined than those of the same race and the rest [of the Germans], and that because they border on the Rhine, and are much resorted to by merchants, and are accustomed to the manners of the Gauls, by reason of their approximity to them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00186"
  },
  {
    "seq": 44,
    "legacySeq": [
      82
    ],
    "book": 4,
    "chapter": 4,
    "sentence": "In the same condition were the Usipetes and the Tenchtheri (whom we have mentioned above), who for many years resisted the power of the Suevi, but being at last driven from their possessions, and having wandered through many parts of Germany, came to the Rhine, to districts which the Menapii inhabited, and where they had lands, houses, and villages on either side of the river.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00187"
  },
  {
    "seq": 45,
    "legacySeq": [
      83
    ],
    "book": 4,
    "chapter": 4,
    "sentence": "The latter people, alarmed by the arrival of so great a multitude, removed from those houses which they had on the other side of the river, and having placed guards on this side the Rhine, proceeded to hinder the Germans from crossing.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00187"
  },
  {
    "seq": 46,
    "legacySeq": [
      84
    ],
    "book": 4,
    "chapter": 4,
    "sentence": "They, finding themselves, after they had tried all means, unable either to force a passage on account of their deficiency in shipping, or cross by stealth on account of the guards of the Menapii, pretended to return to their own settlements and districts; and, after having proceeded three days' march, returned; and their cavalry having performed the whole of this journey in one night, cut off the Menapii, who were ignorant of, and did not expect [their approach, and] who, having moreover been informed of the departure of the Germans by their scouts, had without apprehension returned to their villages beyond the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00187"
  },
  {
    "seq": 47,
    "legacySeq": [
      85
    ],
    "book": 4,
    "chapter": 4,
    "sentence": "Having slain these, and seized their ships, they crossed the river before that part of the Menapii, who were at peace in their settlements over the Rhine, were apprised of [their intention]; and seizing all their houses, maintained themselves upon their provisions during the rest of the winter.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00187"
  },
  {
    "seq": 48,
    "legacySeq": [
      86
    ],
    "book": 4,
    "chapter": 6,
    "sentence": "When he had arrived there, he discovered that those things, which he had suspected would occur, had taken place; that embassies had been sent to the Germans by some of the states, and that they had been entreated to leave the Rhine, and had been promised that all things which they desired should be provided by the Gauls.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00189"
  },
  {
    "seq": 49,
    "legacySeq": [
      87
    ],
    "book": 4,
    "chapter": 10,
    "sentence": "The Meuse rises from mount Le Vosge, which is in the territories of the Lingones; and, having received a branch of the Rhine, which is called the Waal, forms the island of the Batavi, and not more than eighty miles from it it falls into the ocean.",
    "rivers": [
      "Rhine",
      "Meuse",
      "Waal"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00193"
  },
  {
    "seq": 50,
    "legacySeq": [
      88
    ],
    "book": 4,
    "chapter": 10,
    "sentence": "But the Rhine takes its course among the Lepontii, who inhabit the Alps, and is carried with a rapid current for a long distance through the territories of the Sarunates, Helvetii, Sequani, Mediomatrici, Tribuci, and Treviri, and when it approaches the ocean, divides into several branches; and, having formed many and extensive islands, a great part of which are inhabited by savage and barbarous nations (of whom there are some who are supposed to live on fish and the eggs of sea-fowl), flows into the ocean by several mouths.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00193"
  },
  {
    "seq": 51,
    "legacySeq": [
      89
    ],
    "book": 4,
    "chapter": 14,
    "sentence": "Their consternation being made apparent by their noise and tumult, our soldiers, excited by the treachery of the preceding day, rushed into the camp: such of them as could readily get their arms for a short time withstood our men, and gave battle among their carts and baggage-waggons; but the rest of the people, [consisting] of boys and women (for they had left their country and crossed the Rhine with all their families), began to fly in all directions; in pursuit of whom Caesar sent the cavalry.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00197"
  },
  {
    "seq": 52,
    "legacySeq": [
      90
    ],
    "book": 4,
    "chapter": 15,
    "sentence": "The Germans when, upon hearing a noise behind them, [they looked and] saw that their families were being slain, throwing away their arms and abandoning their standards, fled out of the camp, and when they had arrived at the confluence of the Meuse and the Rhine, the survivors despairing of farther escape, as a great number of their countrymen had been killed, threw themselves into the river and there perished, overcome by fear, fatigue, and the violence of the stream.",
    "rivers": [
      "Rhine",
      "Meuse"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00198"
  },
  {
    "seq": 53,
    "legacySeq": [
      91
    ],
    "book": 4,
    "chapter": 16,
    "sentence": "The German war being finished, Caesar thought it expedient for him to cross the Rhine, for many reasons; of which this was the most weighty, that, since he saw the Germans were so easily urged to go into Gaul, he desired they should have their fears for their own territories when they discovered that the army of the Roman people both could and dared pass the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00199"
  },
  {
    "seq": 54,
    "legacySeq": [
      92
    ],
    "book": 4,
    "chapter": 16,
    "sentence": "There was added also, that that portion of the cavalry of the Usipetes and the Tenchtheri, which I have above related to have crossed the Meuse for the purpose of plundering and procuring forage, and was not present at the engagement, had betaken themselves, after the retreat of their countrymen, across the Rhine into the territories of the Sigambri, and united themselves to them.",
    "rivers": [
      "Rhine",
      "Meuse"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00199"
  },
  {
    "seq": 55,
    "legacySeq": [
      93
    ],
    "book": 4,
    "chapter": 16,
    "sentence": "When Caesar sent ambassadors to them, to demand that they should give up to him those who had made war against him and against Gaul, they replied, \"That the Rhine bounded the empire of the Roman people; if he did not think it just for the Germans to pass over into Gaul against his consent, why did he claim that anything beyond the Rhine should be subject to his dominion or power?\" The Ubii also, who alone, out of all the nations lying beyond the Rhine, had sent ambassadors to Caesar, and formed an alliance and given hostages, earnestly entreated \"that he would bring them assistance, because they were grievously oppressed by the Suevi; or, if he was prevented from doing so by the business of the commonwealth, he would at least transport his army over the Rhine; that that would be sufficient for their present assistance and their hope for the future; that so great was the name and the reputation of his army, even among the most remote nations of the Germans, arising from the defeat of Ariovistus and this last battle which was fought, that they might be safe under the fame and friendship of the Roman people.\" They promised a large number of ships for transporting the army.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00199"
  },
  {
    "seq": 56,
    "legacySeq": [
      94
    ],
    "book": 4,
    "chapter": 17,
    "sentence": "Caesar, for those reasons which I have mentioned, had resolved to cross the Rhine; but to cross by ships he neither deemed to be sufficiently safe, nor considered consistent with his own dignity or that of the Roman people.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00200"
  },
  {
    "seq": 57,
    "legacySeq": [
      95
    ],
    "book": 4,
    "chapter": 19,
    "sentence": "When Caesar discovered this, having already accomplished all those things on account of which he had resolved to lead his army over, namely, to strike fear into the Germans, take vengeance on the Sigambri, and free the Ubii from the invasion of the Suevi, having spent altogether eighteen days beyond the Rhine, and thinking he had advanced far enough to serve both honour and interest, he returned into Gaul, and cut down the bridge.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00202"
  },
  {
    "seq": 58,
    "legacySeq": [
      96
    ],
    "book": 5,
    "chapter": 2,
    "sentence": "He left what seemed a sufficient number of soldiers for that design; he himself proceeds into the territories of the Treviri with four legions without baggage, and 800 horse, because they neither came to the general diets [of Gaul], nor obeyed his commands, and were, moreover, said to be tampering with the Germans beyond the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00224"
  },
  {
    "seq": 59,
    "legacySeq": [
      97
    ],
    "book": 5,
    "chapter": 3,
    "sentence": "This state is by far the most powerful of all Gaul in cavalry, and has great forces of infantry, and as we have remarked above, borders on the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00225"
  },
  {
    "seq": 60,
    "legacySeq": [
      98
    ],
    "book": 5,
    "chapter": 3,
    "sentence": "But Indutiomarus began to collect cavalry and infantry, and make preparations for war, having concealed those who by reason of their age could not be under arms in the forest Arduenna, which is of immense size, [and] extends from the Rhine across the country of the Treviri to the frontiers of the Remi.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00225"
  },
  {
    "seq": 61,
    "legacySeq": [
      99
    ],
    "book": 5,
    "chapter": 24,
    "sentence": "One legion which he had raised last on the other side of the Po, and five cohorts, he sent amongst the Eburones, the greatest portion of whom lie between the Meuse and the Rhine, [and] who were under the government of Ambiorix and Cativolcus.",
    "rivers": [
      "Rhine",
      "Meuse",
      "Po"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00246"
  },
  {
    "seq": 62,
    "legacySeq": [
      100
    ],
    "book": 5,
    "chapter": 27,
    "sentence": "Since he had performed his duty to them on the score of patriotism [he said], he has now regard to gratitude for the kindness of Caesar; that he warned, that he prayed Titurius by the claims of hospitality, to consult for his and his soldiers' safety; that a large force of the Germans had been hired and had passed the Rhine; that it would arrive in two days; that it was for them to consider whether they thought fit, before the nearest people perceived it, to lead off their soldiers when drawn out of winter-quarters, either to Cicero or to Labienus; one of whom was about fifty miles distant from them, the other rather more; that this he promised and confirmed by oath, that he would give them a safe passage through his territories; and when he did that, he was both consulting for his own state, because it would be relieved from the winter-quarters, and also making a requital to Caesar for his obligations.\"",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00249"
  },
  {
    "seq": 63,
    "legacySeq": [
      101
    ],
    "book": 5,
    "chapter": 29,
    "sentence": "In opposition to those things Titurius exclaimed, \"That they would do this too late, when greater forces of the enemy, after a junction with the Germans, should have assembled; or when some disaster had been received in the neighbouring winter-quarters; that the opportunity for deliberating was short; that he believed that Caesar had set forth into Italy, as the Carnutes would not otherwise have taken the measure of slaying Tasgetius, nor would the Eburones, if he had been present, have come to the camp with so great defiance of us; that he did not regard the enemy, but the fact, as the authority; that the Rhine was near; that the death of Ariovistus and our previous victories were subjects of great indignation to the Germans; that Gaul was inflamed, that after having received so many defeats she was reduced under the sway of the Roman people, her pristine glory in military matters being extinguished.\" Lastly, \"who would persuade himself of this, that Ambiorix had resorted to a design of that nature without sure grounds?",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00251"
  },
  {
    "seq": 64,
    "legacySeq": [
      102
    ],
    "book": 5,
    "chapter": 41,
    "sentence": "When permission was granted, they recount the same things which Ambiorix had related to Titurius, namely, \"that all Gaul was in arms, that the Germans had passed the Rhine, that the winter-quarters of Caesar and of the others were attacked.\" They report in addition also, about the death of Sabinus.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00263"
  },
  {
    "seq": 65,
    "legacySeq": [
      103
    ],
    "book": 5,
    "chapter": 55,
    "sentence": "But the Treviri and Indutiomarus let no part of the entire winter pass without sending ambassadors across the Rhine, importuning the states, promising money, and asserting that, as a large portion of our army had been cut off, a much smaller portion remained.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00277"
  },
  {
    "seq": 66,
    "legacySeq": [
      104
    ],
    "book": 5,
    "chapter": 55,
    "sentence": "However, none of the German states could be induced to cross the Rhine, since \"they had twice essayed it,\" they said, \"in the war with Ariovistus and in the passage of the Tenchtheri there; that fortune was not to be tempted any more.\" Indutiomarus disappointed in this expectation, nevertheless began to raise troops, and discipline them, and procure horses from the neighbouring people and allure to him by great rewards the outlaws and convicts throughout Gaul.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00277"
  },
  {
    "seq": 67,
    "legacySeq": [
      105
    ],
    "book": 6,
    "chapter": 2,
    "sentence": "Caesar, on being informed of their acts, since he saw that war was being prepared on all sides, that the Nervii, Aduatuci, and Menapii, with the addition of all the Germans on this side of the Rhine were under arms, that the Senones did not assemble according to his command, and were concerting measures with the Carnutes and the neighbouring states, that the Germans were importuned by the Treviri in frequent embassies, thought that he ought to take measures for the war earlier [than usual].",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00283"
  },
  {
    "seq": 68,
    "legacySeq": [
      106
    ],
    "book": 6,
    "chapter": 5,
    "sentence": "He thought that these auxiliaries ought to be detached from him before he provoked him to war; lest he, despairing of safety, should either proceed to conceal himself in the territories of the Menapii, or should be driven to coalesce with the Germans beyond the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00286"
  },
  {
    "seq": 69,
    "legacySeq": [
      107
    ],
    "book": 6,
    "chapter": 9,
    "sentence": "Caesar, after he came from the territories of the Menapii into those of the Treviri, resolved for two reasons to cross the Rhine; one of which was, because they had sent assistance to the Treviri against him; the other, that Ambiorix might not have a retreat among them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00290"
  },
  {
    "seq": 70,
    "legacySeq": [
      108
    ],
    "book": 6,
    "chapter": 24,
    "sentence": "And there was formerly a time when the Gauls excelled the Germans in prowess, and waged war on them offensively, and, on account of the great number of their people and the insufficiency of their land, sent colonies over the Rhine.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00304"
  },
  {
    "seq": 71,
    "legacySeq": [
      109
    ],
    "book": 6,
    "chapter": 29,
    "sentence": "Over that fort and guard he appointed C. Volcatius Tullus, a young man; he himself, when the corn began to ripen, having set forth for the war with Ambiorix (through the forest Arduenna, which is the largest of all Gaul, and reaches from the banks of the Rhine and the frontiers of the Treviri to those of the Nervii, and extends over more than 500 miles), he sends forward L. Minucius Basilus with all the cavalry, to try if he might gain any advantage by rapid marches and the advantage of time, he warns him to forbid fires being made in the camp, lest any indication of his approach be given at a distance: he tells him that he will follow immediately.",
    "note": "A stray “40” in the online transcription has been removed before Ambiorix.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00309"
  },
  {
    "seq": 72,
    "legacySeq": [
      110
    ],
    "book": 6,
    "chapter": 32,
    "sentence": "The Segui and Condrusi, of the nation and number of the Germans, and who are between the Eburones and the Treviri, sent ambassadors to Caesar to entreat that he would not regard them in the number of his enemies, nor consider that the cause of all the Germans on this side the Rhine was one and the same; that they had formed no plans of war, and had sent no auxiliaries to Ambiorix.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00312"
  },
  {
    "seq": 73,
    "legacySeq": [
      111
    ],
    "book": 6,
    "chapter": 33,
    "sentence": "Having divided the army, he orders T. Labienus to proceed with three legions towards the ocean into those parts which border on the Menappii; he sends C. Trebonius with a like number of legions to lay waste that district which lies contiguous to the Aduatuci; he himself determines to go with the remaining three to the river Sambre, which flows into the Meuse, and to the most remote parts of Arduenna, whither he heard that Ambiorix had gone with a few horse.",
    "note": "The translation uses “Sambre”; the Latin at 6.33 names Scaldis. Treat the modern identification and the stated confluence with caution: the pin is an orientation aid for this translation.",
    "noteUrl": "https://www.thelatinlibrary.com/caesar/gall6.shtml#33",
    "rivers": [
      "Sambre",
      "Meuse"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00313"
  },
  {
    "seq": 74,
    "legacySeq": [
      112
    ],
    "book": 6,
    "chapter": 35,
    "sentence": "The report extends beyond the Rhine to the Germans that the Eburones are being pillaged, and that all were without distinction invited to the plunder.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00315"
  },
  {
    "seq": 75,
    "legacySeq": [
      113
    ],
    "book": 6,
    "chapter": 35,
    "sentence": "The Sigambri, who are nearest to the Rhine, by whom, we have mentioned above, the Tenchtheri and Usipetes were received after their retreat, collect 2000 horse; they cross the Rhine in ships and barks thirty miles below that place where the bridge was entire and the garrison left by Caesar; they arrive at the frontiers of the Eburones, surprise many who were scattered in flight, and get possession of a large amount of cattle, of which barbarians are extremely covetous.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00315"
  },
  {
    "seq": 76,
    "legacySeq": [
      114
    ],
    "book": 6,
    "chapter": 41,
    "sentence": "The Germans, despairing of taking the camp by storm, because they saw that our men had taken up their position on the fortifications, retreated beyond the Rhine with that plunder which they had deposited in the woods.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00321"
  },
  {
    "seq": 77,
    "legacySeq": [
      115
    ],
    "book": 6,
    "chapter": 42,
    "sentence": "Of all which events, it seemed the most surprising that the Germans, who had crossed the Rhine with this object, that they might plunder the territories of Ambiorix, being led to the camp of the Romans, rendered Ambiorix a most acceptable service.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00322"
  },
  {
    "seq": 78,
    "legacySeq": [
      116
    ],
    "book": 7,
    "chapter": 5,
    "sentence": "When they came to the river Loire, which separates the Bituriges from the Aedui, they delayed a few days there, and, not daring to pass the river, return home, and send back word to the lieutenants that they had returned through fear of the treachery of the Bituriges, who, they ascertained, had formed this design, that if the Aedui should cross the river, the Bituriges on the one side, and the Arverni on the other, should surround them.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00330"
  },
  {
    "seq": 79,
    "legacySeq": [
      117
    ],
    "book": 7,
    "chapter": 11,
    "sentence": "Caesar arrived here in two days; after pitching his camp before the town, being prevented by the time of the day, he defers the attack to the next day, and orders his soldiers to prepare whatever was necessary for that enterprise; and as a bridge over the Loire connected the town of Genabum with the opposite bank, fearing lest the inhabitants should escape by night from the town, he orders two legions to keep watch under arms.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00337"
  },
  {
    "seq": 80,
    "legacySeq": [
      118
    ],
    "book": 7,
    "chapter": 11,
    "sentence": "He pillages and burns the town, gives the booty to the soldiers, then leads his army over the Loire, and marches into the territories of the Bituriges.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00337"
  },
  {
    "seq": 81,
    "legacySeq": [
      119
    ],
    "book": 7,
    "chapter": 34,
    "sentence": "Having pronounced this decree between [the contending parties], he exhorted the Aedui to bury in oblivion their disputes and dissensions, and, laying aside all these things, devote themselves to the war, and expect from him, on the conquest of Gaul, those rewards which they should have earned, and send speedily to him all their cavalry and ten thousand infantry, which he might place in different garrisons to protect his convoys of provisions, and then divided his army into two parts: he gave Labienus four legions to lead into the country of the Senones and Parisii; and led in person six into the country of the Arverni, in the direction of the town of Gergovia, along the banks of the Allier.",
    "rivers": [
      "Allier"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00360"
  },
  {
    "seq": 82,
    "legacySeq": [
      120
    ],
    "book": 7,
    "chapter": 34,
    "sentence": "Vercingetorix, on learning this circumstance, broke down all the bridges over the river and began to march on the other bank of the Allier.",
    "rivers": [
      "Allier"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00360"
  },
  {
    "seq": 83,
    "legacySeq": [
      121
    ],
    "book": 7,
    "chapter": 35,
    "sentence": "When each army was in sight of the other, and was pitching their camp almost opposite that of the enemy, scouts being distributed in every quarter, lest the Romans should build a bridge and bring over their troops; it was to Caesar a matter attended with great difficulties, lest he should be hindered from passing the river during the greater part of the summer, as the Allier cannot generally be forded before the autumn.",
    "rivers": [
      "Allier"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00361"
  },
  {
    "seq": 84,
    "legacySeq": [
      122
    ],
    "book": 7,
    "chapter": 53,
    "sentence": "The enemy not even then pursuing us, on the third day he repaired the bridge over the river Allier, and led over his whole army.",
    "rivers": [
      "Allier"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00379"
  },
  {
    "seq": 85,
    "legacySeq": [
      123
    ],
    "book": 7,
    "chapter": 55,
    "sentence": "Noviodunum was a town of the Aedui, advantageously situated on the banks of the Loire.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00381"
  },
  {
    "seq": 86,
    "legacySeq": [
      124
    ],
    "book": 7,
    "chapter": 55,
    "sentence": "Therefore, having put to the sword the garrison of Noviodunum and those who had assembled there for the purpose of trading or were on their march, they divided the money and horses among themselves; they took care that the hostages of the [different] states should be brought to Bibracte, to the chief magistrate; they burnt the town to prevent its being of any service to the Romans, as they were of opinion that they could not hold it; they carried away in their vessels whatever corn they could in the hurry; they destroyed the remainder, by [throwing it] into the river or setting it on fire; they themselves began to collect forces from the neighbouring country, to place guards and garrisons in different positions along the banks of the Loire, and to display the cavalry on all sides to strike terror into the Romans, [to try] if they could cut them off from a supply of provisions.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00381"
  },
  {
    "seq": 87,
    "legacySeq": [
      125
    ],
    "book": 7,
    "chapter": 55,
    "sentence": "In which expectation they were much aided, from the circumstance that the Loire had swollen to such a degree from the melting of the snows, that it did not seem capable of being forded at all.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00381"
  },
  {
    "seq": 88,
    "legacySeq": [
      126
    ],
    "book": 7,
    "chapter": 56,
    "sentence": "Therefore, having made very long marches by day and night, he came to the river Loire, contrary to the expectation of all; and having by means of the cavalry found out a ford, suitable enough considering the emergency, of such depth that their arms and shoulders could be above water for supporting their accoutrements, he dispersed his cavalry in such a manner as to break the force of the current, and having confounded the enemy at the first sight, led his army across the river in safety; and finding corn and cattle in the fields, after refreshing his army with them, he determined to march into the country of the Senones.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00382"
  },
  {
    "seq": 89,
    "legacySeq": [
      127
    ],
    "book": 7,
    "chapter": 57,
    "sentence": "Whilst these things are being done by Caesar, Labienus, leaving at Agendicum the recruits who had lately arrived from Italy, to guard the baggage, marches with four legions to Lutetia (which is a town of the Parisii, situated on an island of the river Seine), whose arrival being discovered by the enemy, numerous forces arrived from the neighbouring states.",
    "rivers": [
      "Seine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00383"
  },
  {
    "seq": 90,
    "legacySeq": [
      128
    ],
    "book": 7,
    "chapter": 57,
    "sentence": "He, when he observed that there was a large marsh which communicated with the Seine, and rendered all that country impassable, encamped there, and determined to prevent our troops from passing it.",
    "rivers": [
      "Seine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00383"
  },
  {
    "seq": 91,
    "legacySeq": [
      129
    ],
    "book": 7,
    "chapter": 58,
    "sentence": "This is a town of the Senones, situated on an island in the Seine, as we have just before observed of Lutetia.",
    "rivers": [
      "Seine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00384"
  },
  {
    "seq": 92,
    "legacySeq": [
      130
    ],
    "book": 7,
    "chapter": 58,
    "sentence": "The enemy, on learning the circumstance from those who had escaped from Melodunum, set fire to Lutetia, and order the bridges of that town to be broken down: they themselves set out from the marsh, and take their position on the banks of the Seine, over against Lutetia and opposite the camp of Labienus.",
    "rivers": [
      "Seine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00384"
  },
  {
    "seq": 93,
    "legacySeq": [
      131
    ],
    "book": 7,
    "chapter": 59,
    "sentence": "Caesar was now reported to have departed from Gergovia; intelligence was likewise brought to them concerning the revolt of the Aedui, and a successful rising in Gaul; and that Caesar, having been prevented from prosecuting his journey and crossing the Loire, and having been compelled by the want of corn, had marched hastily to the province.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00385"
  },
  {
    "seq": 94,
    "legacySeq": [
      132
    ],
    "book": 7,
    "chapter": 65,
    "sentence": "The Allobroges, placing guards along the course of the [Rhone], defend their frontiers with great vigilance and energy.",
    "note": "Correction: this translation prints “Rhine”, but the Latin at 7.65.3 says Rhodanum (Rhône). The following sentence refers to the Rhine.",
    "noteUrl": "https://www.thelatinlibrary.com/caesar/gall7.shtml#65",
    "rivers": [
      "Rhone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00391"
  },
  {
    "seq": 95,
    "legacySeq": [
      133
    ],
    "book": 7,
    "chapter": 65,
    "sentence": "Caesar, as he perceived that the enemy were superior in cavalry, and he himself could receive no aid from the province or Italy, while all communication was cut off, sends across the Rhine into Germany to those states which he had subdued in the preceding campaigns, and summons from them cavalry and the light-armed infantry, who were accustomed to engage among them.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00391"
  },
  {
    "seq": 96,
    "legacySeq": [
      134
    ],
    "book": 7,
    "chapter": 90,
    "sentence": "He stations Quintus Tullius Cicero, and Publius Sulpicius among the Aedui at Cabillo and Matisco on the Saone, to procure supplies of corn.",
    "rivers": [
      "Saone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00415"
  },
  {
    "seq": 97,
    "legacySeq": [
      135
    ],
    "book": 8,
    "chapter": 4,
    "sentence": "Upon this intelligence, though he had not remained more than eighteen days in winter quarters, he draws the fourteenth and sixth legion out of quarters on the Saone, where he had posted them as mentioned in a former Commentary to procure supplies of corn.",
    "rivers": [
      "Saone"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00423"
  },
  {
    "seq": 98,
    "legacySeq": [
      136
    ],
    "book": 8,
    "chapter": 13,
    "sentence": "In one of these contests the Germans, whom Caesar had brought over the Rhine, to fight intermixed with the horse, having resolutely crossed the marsh, and slain the few who made resistance, and boldly pursued the rest, so terrified them, that not only those who were attacked hand to hand, or wounded at a distance, but even those who were stationed at a greater distance to support them, fled disgracefully; and being often beaten from the rising grounds, did not stop till they had retired into their camp, or some, impelled by fear, had fled farther.",
    "rivers": [
      "Rhine"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00432"
  },
  {
    "seq": 99,
    "legacySeq": [
      137
    ],
    "book": 8,
    "chapter": 27,
    "sentence": "Nor did he think that he should be sufficiently secure from danger, unless he led his army across the Loire, which was too deep a river to pass except by a bridge.",
    "rivers": [
      "Loire"
    ],
    "sourceUrl": "https://www.gutenberg.org/cache/epub/10657/pg10657.html#id00446"
  }
];
const riverLocations = {
  "Garonne": {
    "latlon": [
      44.84,
      -0.58
    ],
    "place": "Bordeaux"
  },
  "Marne": {
    "latlon": [
      48.96,
      2.88
    ],
    "place": "Meaux"
  },
  "Seine": {
    "latlon": [
      48.86,
      2.35
    ],
    "place": "Paris"
  },
  "Rhine": {
    "latlon": [
      48.58,
      7.75
    ],
    "place": "Strasbourg"
  },
  "Rhone": {
    "latlon": [
      45.76,
      4.84
    ],
    "place": "Lyon"
  },
  "Saone": {
    "latlon": [
      46.78,
      4.85
    ],
    "place": "Chalon-sur-Saône"
  },
  "Loire": {
    "latlon": [
      47.39,
      0.69
    ],
    "place": "Tours"
  },
  "Allier": {
    "latlon": [
      46.13,
      3.43
    ],
    "place": "Vichy"
  },
  "Aisne": {
    "latlon": [
      49.38,
      3.32
    ],
    "place": "Soissons"
  },
  "Doubs": {
    "latlon": [
      47.24,
      6.02
    ],
    "place": "Besançon"
  },
  "Sambre": {
    "latlon": [
      50.41,
      4.44
    ],
    "place": "Charleroi; see identification note"
  },
  "Meuse": {
    "latlon": [
      50.47,
      4.87
    ],
    "place": "Namur"
  },
  "Waal": {
    "latlon": [
      51.85,
      5.87
    ],
    "place": "Nijmegen"
  },
  "Po": {
    "latlon": [
      45.07,
      7.69
    ],
    "place": "Turin"
  }
};

function normalizeSearch(value) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
function filterReferences(query = '', river = '', book = '') {
  const needle = normalizeSearch(query.trim());
  return references.filter(ref => (!river || ref.rivers.includes(river)) && (!book || ref.book === Number(book)) &&
    (!needle || normalizeSearch(`${ref.seq} ${ref.book}.${ref.chapter} ${ref.rivers.join(' ')} ${ref.sentence}`).includes(needle)));
}
if (typeof module !== 'undefined') module.exports = { references, riverLocations, filterReferences };
if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  let map = null, markers = {}, selected = null, visible = references;
  const name = river => ({Rhone:'Rhône',Saone:'Saône'}[river] || river);
  Object.keys(riverLocations).sort().forEach(river => { const option = document.createElement('option'); option.value = river; option.textContent = name(river); $('river').append(option); });
  function markOnMap(ref) {
    if (!map) return;
    Object.entries(markers).forEach(([river, marker]) => marker.setStyle({fillColor:ref.rivers.includes(river)?'#c14f2d':'#347b9a',radius:ref.rivers.includes(river)?10:6,fillOpacity:ref.rivers.includes(river)?1:.45}));
    const points = ref.rivers.map(river => riverLocations[river].latlon);
    if (points.length === 1) { map.setView(points[0],7); markers[ref.rivers[0]].openPopup(); }
    else { map.closePopup(); map.fitBounds(points,{padding:[45,45],maxZoom:7}); }
  }
  function showReference(ref) {
    selected = ref;
    document.querySelectorAll('.ref-item').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.seq)===ref.seq)));
    $('selection-title').textContent = `Passage ${ref.seq} · Book ${ref.book}, chapter ${ref.chapter}${ref.book===8?' (Hirtius)':''}`;
    $('sentence').textContent = ref.sentence;
    $('source').href = ref.sourceUrl;
    $('source').textContent = `Read Book ${ref.book}, chapter ${ref.chapter} in context ↗`;
    $('river-list').textContent = ref.rivers.map(river => `${name(river)} — near ${riverLocations[river].place}`).join('; ');
    $('passage-note').hidden = !ref.note;
    $('note-text').textContent = ref.note || '';
    $('note-source').hidden = !ref.noteUrl;
    if(ref.noteUrl) $('note-source').href=ref.noteUrl;
    const index = visible.indexOf(ref); $('previous').disabled = index<=0; $('next').disabled = index<0 || index>=visible.length-1;
    markOnMap(ref);
  }
  function render() {
    visible = filterReferences($('search').value,$('river').value,$('book').value);
    $('count').textContent = `${visible.length} of ${references.length} passages`;
    $('items').replaceChildren();
    visible.forEach(ref => { const button=document.createElement('button'); button.type='button';button.className='ref-item';button.dataset.seq=ref.seq;button.setAttribute('aria-pressed','false');button.textContent=`${ref.seq}. ${ref.rivers.map(name).join(', ')} · ${ref.book}.${ref.chapter}`;button.addEventListener('click',()=>showReference(ref));$('items').append(button); });
    $('empty').hidden = visible.length>0;
    $('selection').hidden = visible.length===0;
    if(visible.length) showReference(visible.includes(selected)?selected:visible[0]);
    else {selected=null;if(map){map.closePopup();Object.values(markers).forEach(marker=>marker.setStyle({fillColor:'#347b9a',radius:6,fillOpacity:.45}));}}
  }
  ['search','river','book'].forEach(id=>$ (id).addEventListener(id==='search'?'input':'change',render));
  $('clear').addEventListener('click',()=>{$('search').value='';$('river').value='';$('book').value='';render();$('search').focus();});
  $('previous').addEventListener('click',()=>showReference(visible[visible.indexOf(selected)-1]));
  $('next').addEventListener('click',()=>showReference(visible[visible.indexOf(selected)+1]));
  $('overview').addEventListener('click',()=>{if(map)map.fitBounds(Object.values(riverLocations).map(location=>location.latlon),{padding:[30,30]});});
  if (typeof L !== 'undefined') {
    map=L.map('map').setView([47.4,3.4],5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on('tileerror',()=>{$('map-status').textContent='Some map tiles could not load. Passage text and orientation markers remain available.';}).addTo(map);
    Object.entries(riverLocations).forEach(([river,location])=>{markers[river]=L.circleMarker(location.latlon,{radius:6,color:'#fff',weight:2,fillColor:'#347b9a',fillOpacity:.6}).addTo(map).bindPopup(`${name(river)} · near ${location.place}<br>Approximate orientation point`);});
    $('map-status').textContent='Orange pins: rivers named in the selected passage. Pins locate a modern town, not a crossing or battle.';
    window.addEventListener('resize',()=>map.invalidateSize());
  } else { $('map-status').textContent='The online map library could not load. You can still search, filter and read every passage below.'; $('map').hidden=true; $('overview').disabled=true; }
  render();
}

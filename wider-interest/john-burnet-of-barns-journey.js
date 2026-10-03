'use strict';
/* OS grid projection adapted from Chris Veness's geodesy work:
 * https://www.movable-type.co.uk/scripts/latlong-os-gridref.html
 * Copyright (c) Chris Veness. MIT License.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the Software), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions: the above copyright notice and this
 * permission notice shall be included in all copies or substantial portions.
 * THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
        class LatLonEllipsoidal {
            constructor(lat, lon, height=0) {
                if (isNaN(lat) || isNaN(lon)) throw new TypeError(`Invalid LatLon [${lat},${lon}]`);
                this._lat = Number(lat);
                this._lon = Number(lon);
                this._height = Number(height);
            }
            get lat() { return this._lat; }
            get latitude() { return this._lat; }
            get lon() { return this._lon; }
            get longitude() { return this._lon; }
            get height() { return this._height; }
            static get Dms() { return { N: 'N', S: 'S', E: 'E', W: 'W' }; }
        }

        class OsGridRef {
            constructor(easting, northing) {
                this.easting = Number(easting);
                this.northing = Number(northing);
            }

            static parse(gridref) {
                gridref = String(gridref).trim();
                let match = gridref.match(/^([A-HJ-Z]{2})\s*(\d{2,10})$/i);
                if (!match) throw new Error(`Invalid OS Grid Reference ‘${gridref}’`);
                let gr = match[1].toUpperCase();
                let e = match[2].slice(0, match[2].length / 2);
                let n = match[2].slice(match[2].length / 2);
                if (e.length != n.length) throw new Error(`Invalid OS Grid Reference ‘${gridref}’`);
                e = e.padEnd(5, '0');
                n = n.padEnd(5, '0');
                let l1 = gr.charCodeAt(0) - 'A'.charCodeAt(0);
                let l2 = gr.charCodeAt(1) - 'A'.charCodeAt(0);
                if (l1 > 7) l1--;
                if (l2 > 7) l2--;
                let e100km = ((l1 - 2) % 5) * 5 + (l2 % 5);
                let n100km = (19 - Math.floor(l1 / 5) * 5) - Math.floor(l2 / 5);
                if (e100km < 0 || e100km > 6 || n100km < 0 || n100km > 12) throw new Error(`Invalid OS Grid Reference ‘${gridref}’`);
                let easting = e100km * 100000 + Number(e);
                let northing = n100km * 100000 + Number(n);
                return new OsGridRef(easting, northing);
            }

            toLatLon() {
                const { easting: E, northing: N } = this;
                const a = 6377563.396, b = 6356256.909; // Airy 1830: British National Grid is OSGB36, not WGS84.
                const F0 = 0.9996012717;
                const φ0 = 49 * Math.PI / 180;
                const λ0 = -2 * Math.PI / 180;
                const N0 = -100000, E0 = 400000;
                const e2 = 1 - (b * b) / (a * a);
                const n = (a - b) / (a + b);
                let φ = φ0, M = 0;
                do {
                    φ = (N - N0 - M) / (a * F0) + φ;
                    let Ma = (1 + n + (5 / 4) * n * n + (5 / 4) * n * n * n) * (φ - φ0);
                    let Mb = (3 * n + 3 * n * n + (21 / 8) * n * n * n) * Math.sin(φ - φ0) * Math.cos(φ + φ0);
                    let Mc = ((15 / 8) * n * n + (15 / 8) * n * n * n) * Math.sin(2 * (φ - φ0)) * Math.cos(2 * (φ + φ0));
                    let Md = (35 / 24) * n * n * n * Math.sin(3 * (φ - φ0)) * Math.cos(3 * (φ + φ0));
                    M = b * F0 * (Ma - Mb + Mc - Md);
                } while (Math.abs(N - N0 - M) >= 0.00001);
                const cosφ = Math.cos(φ), sinφ = Math.sin(φ);
                const ν = a * F0 / Math.sqrt(1 - e2 * sinφ * sinφ);
                const ρ = a * F0 * (1 - e2) / Math.pow(1 - e2 * sinφ * sinφ, 1.5);
                const η2 = ν / ρ - 1;
                const tanφ = Math.tan(φ);
                let secφ = 1 / cosφ;
                let VII = tanφ / (2 * ρ * ν);
                let VIII = tanφ / (24 * ρ * Math.pow(ν, 3)) * (5 + 3 * tanφ * tanφ + η2 - 9 * tanφ * tanφ * η2);
                let IX = tanφ / (720 * ρ * Math.pow(ν, 5)) * (61 + 90 * tanφ * tanφ + 45 * Math.pow(tanφ, 4));
                let X = secφ / ν;
                let XI = secφ / (6 * Math.pow(ν, 3)) * (ν / ρ + 2 * tanφ * tanφ);
                let XII = secφ / (120 * Math.pow(ν, 5)) * (5 + 28 * tanφ * tanφ + 24 * Math.pow(tanφ, 4));
                let XIIA = secφ / (5040 * Math.pow(ν, 7)) * (61 + 662 * tanφ * tanφ + 1320 * Math.pow(tanφ, 4) + 720 * Math.pow(tanφ, 6));
                const dE = E - E0;
                φ = φ - VII * dE * dE + VIII * Math.pow(dE, 4) - IX * Math.pow(dE, 6);
                let λ = λ0 + X * dE - XI * Math.pow(dE, 3) + XII * Math.pow(dE, 5) - XIIA * Math.pow(dE, 7);
                // Convert OSGB36 geodetic -> Cartesian -> WGS84 using a Helmert transform.
                // This approximate transform is adequate for this unverified literary sketch;
                // it is not the high-precision Ordnance Survey OSTN15 transformation.
                const v = a / Math.sqrt(1 - e2 * Math.sin(φ) ** 2);
                const x = v * Math.cos(φ) * Math.cos(λ);
                const y = v * Math.cos(φ) * Math.sin(λ);
                const z = (1 - e2) * v * Math.sin(φ);
                const arcsec = Math.PI / (180 * 3600), scale = 1 - 20.4894 / 1e6;
                const rx = 0.1502 * arcsec, ry = 0.2470 * arcsec, rz = 0.8421 * arcsec;
                const x2 = 446.448 + x * scale - y * rz + z * ry;
                const y2 = -125.157 + x * rz + y * scale - z * rx;
                const z2 = 542.060 - x * ry + y * rx + z * scale;
                const a2 = 6378137, b2 = 6356752.314245, e22 = 1 - b2*b2/(a2*a2);
                const p = Math.hypot(x2, y2);
                let latitude = Math.atan2(z2, p * (1-e22));
                for (let i=0; i<12; i++) {
                    const v2 = a2 / Math.sqrt(1-e22*Math.sin(latitude)**2);
                    const next = Math.atan2(z2+e22*v2*Math.sin(latitude),p);
                    if (Math.abs(next-latitude)<1e-12) {latitude=next;break;}
                    latitude=next;
                }
                return new LatLonEllipsoidal(latitude * 180 / Math.PI, Math.atan2(y2,x2) * 180 / Math.PI, 0);
            }
        }
        
        const journeyData = [
            { day: "US1", description: "Barns–Tweed–Dawyck loop", total_km: 20.5, ascent_m: 200, legs: [["Barns", "NT240390", "Tweed_Ford", "NT238389", 243, 0.2], ["Tweed_Ford", "NT238389", "Wood_of_Dawyck", "NT166319", 226, 10.0], ["Wood_of_Dawyck", "NT166319", "Barns", "NT240390", 46, 10.3]] },
            { day: "US2", description: "Flood round of Peebles & Manor", total_km: 11.3, ascent_m: 120, legs: [["Barns", "NT240390", "Peebles_Bridge", "NT251403", 40, 1.7], ["Peebles_Bridge", "NT251403", "Manor_Detour", "NT235350", 197, 5.5], ["Manor_Detour", "NT235350", "Barns", "NT240390", 7, 4.1]] },
            { day: "US3", description: "Barns → Biggar → Lanark → Crossford", total_km: 43.8, ascent_m: 650, legs: [["Barns", "NT240390", "Biggar", "NT046375", 266, 19.5], ["Biggar", "NT046375", "Lanark", "NS878425", 287, 17.5], ["Lanark", "NS878425", "Crossford", "NS820460", 301, 6.8]] },
            { day: "US3+1", description: "Crossford → Hamilton → Glasgow", total_km: 29.8, ascent_m: 300, legs: [["Crossford", "NS820460", "Hamilton", "NS715567", 316, 15.0], ["Hamilton", "NS715567", "Glasgow_Bridge", "NS592650", 304, 14.8]] },
            { day: "US4", description: "Glasgow → Hamilton (term break ride)", total_km: 14.8, ascent_m: 200, legs: [["Glasgow_Bridge", "NS592650", "Hamilton", "NS715567", 124, 14.8]] },
            { day: "US4+1", description: "Hamilton → Lanark Moor → Symington → Barns", total_km: 59.0, ascent_m: 700, legs: [["Hamilton", "NS715567", "Lanark_Moor", "NS878430", 130, 21.3], ["Lanark_Moor", "NS878430", "Symington_Knoll", "NS986373", 118, 12.2], ["Symington_Knoll", "NS986373", "Barns", "NT240390", 86, 25.5]] },
            { day: "US5", description: "‘Red Syke’ wager circuit", total_km: 25.8, ascent_m: 600, legs: [["Barns", "NT240390", "The_Deid_Wife", "NT198305", 227, 9.8], ["The_Deid_Wife", "NT198305", "Red_Syke", "NT180300", 215, 3.0], ["Red_Syke", "NT180300", "Barns", "NT240390", 34, 13.0]] },
            { day: "US6", description: "Barns → Eddleston → Leadburn → Leith", total_km: 37.9, ascent_m: 400, legs: [["Barns", "NT240390", "Eddleston", "NT245460", 4, 7.0], ["Eddleston", "NT245460", "Leadburn_Inn", "NT241573", 358, 11.3], ["Leadburn_Inn", "NT241573", "Leith_Harbour", "NT275766", 10, 19.6]] },
            { day: "US7", description: "Leith → Liberton (evening landing dash)", total_km: 7.7, ascent_m: 90, legs: [["Leith_Harbour", "NT275766", "Leith_Walk", "NT270735", 189, 3.1], ["Leith_Walk", "NT270735", "Liberton_Kirk", "NT273689", 176, 4.6]] },
            { day: "US7+1", description: "Pentlands night ride to Broughton", total_km: 37.6, ascent_m: 880, legs: [["Liberton_Kirk", "NT273689", "Penicuik_Hawes_Burn", "NT235600", 203, 9.7], ["Penicuik_Hawes_Burn", "NT235600", "Leadburn_X-roads", "NT241573", 167, 2.8], ["Newlands_Moor", "NT196509", "Black_Mount", "NT135470", 235, 7.2], ["Black_Mount", "NT135470", "Kirkurd_Ford", "NT154447", 148, 3.5], ["Kirkurd_Ford", "NT154447", "Hell’s_Cleuch", "NT163424", 159, 2.5], ["Hell’s_Cleuch", "NT163424", "Broughton", "NT152352", 189, 7.3]] },
            { day: "US7+2", description: "Dawn trot into Dawyck", total_km: 3.7, ascent_m: 120, legs: [["Broughton", "NT152352", "Dawyck_House", "NT159316", 169, 3.7]] },
            { day: "US7+3", description: "Stanhope & Talla ridges to Cor", total_km: 11.0, ascent_m: 620, legs: [["Dawyck_House", "NT159316", "Glenstivon_Dod", "NT158275", 172, 4.2], ["Glenstivon_Dod", "NT158275", "Stanhope_Watershed", "NT163235", 125, 4.1], ["Stanhope_Watershed", "NT163235", "Talla_Linns_Ford", "NT152223", 223, 1.6], ["Talla_Linns_Ford", "NT152223", "Cor_Water_Cave", "NT140220", 256, 1.2]] },
            { day: "US7+4", description: "Final scramble into cave", total_km: 0.2, ascent_m: 40, legs: [["Foot_of_Cor_Glen", "NT141218", "Cor_Water_Cave", "NT140220", 256, 0.2]] },
            { day: "US8", description: "Cor → Caerdon courier loop", total_km: 11.8, ascent_m: 530, legs: [["Cor_Water_Cave", "NT140220", "Kingledoors_Ridge", "NT119225", 283, 2.2], ["Kingledoors_Ridge", "NT119225", "Wormel", "NT140240", 54, 2.6], ["Wormel", "NT140240", "Caerdon_Cairn", "NT116246", 284, 2.5], ["Caerdon_Cairn", "NT116246", "Wormel", "NT140240", 104, 2.5], ["Wormel", "NT140240", "Cor_Water_Cave", "NT140220", 180, 2.0]] },
            { day: "US8+2", description: "Storm escape – Cor → Coomb Dod", total_km: 16.8, ascent_m: 790, legs: [["Cor_Water_Cave", "NT140220", "Wormel", "NT140240", 0, 2.0], ["Wormel", "NT140240", "Coulter_Fell_Shldr", "NT054279", 294, 9.4], ["Coulter_Fell_Shldr", "NT054279", "Holmes_Water_Head", "NT063246", 165, 3.4], ["Holmes_Water_Head", "NT063246", "Coomb_Dod_Plateau", "NT083250", 79, 2.0]] },
            { day: "US8+3", description: "Descent to Roberton", total_km: 9.8, ascent_m: 120, legs: [["Coomb_Dod_Plateau", "NT083250", "Redshaw_Shieling", "NT088235", 162, 1.6], ["Redshaw_Shieling", "NT088235", "Wildshaw", "NT078225", 225, 1.4], ["Wildshaw", "NT078225", "Roberton_Burn", "NT031274", 316, 6.8]] },
            { day: "US8+4", description: "White-out chase – Coulter Fell → Little Scrape", total_km: 48.1, ascent_m: 1050, legs: [["Coulter_Fell_Shldr", "NT054279", "Biggar", "NT046375", 350, 8.8], ["Biggar", "NT046375", "Kilbucho", "NT067358", 129, 2.7], ["Kilbucho", "NT067358", "Blendewing", "NT084380", 38, 2.8], ["Blendewing", "NT084380", "Whiteslade", "NT089368", 157, 1.3], ["Whiteslade", "NT089368", "Wormel", "NT140240", 158, 13.8], ["Wormel", "NT140240", "Tweed_Ford", "NT150350", 5, 11.0], ["Tweed_Ford", "NT150350", "Little_Scrape_Hags", "NT162274", 171, 7.7]] },
            { day: "US8+9", description: "First Scrape → Caerdon letter-run", total_km: 13.4, ascent_m: 510, legs: [["Little_Scrape_Hags", "NT162274", "Stanhope_Ridge", "NT163235", 10, 6.1], ["Stanhope_Ridge", "NT163235", "Caerdon_Cairn", "NT116246", 284, 5.4], ["Caerdon_Cairn", "NT116246", "Little_Scrape_Hags", "NT162274", 118, 1.9]] },
            { day: "US8+18", description: "Repeat courier loop", total_km: 13.4, ascent_m: 510, legs: [["Little_Scrape_Hags", "NT162274", "Stanhope_Ridge", "NT163235", 10, 6.1], ["Stanhope_Ridge", "NT163235", "Caerdon_Cairn", "NT116246", 284, 5.4], ["Caerdon_Cairn", "NT116246", "Little_Scrape_Hags", "NT162274", 118, 1.9]] },
            { day: "US8+26", description: "Shift lair – Glenhurn → Pykestone", total_km: 3.6, ascent_m: 110, legs: [["Glenhurn_Ravine", "NT168275", "Scrape_Top", "NT165285", 343, 1.0], ["Scrape_Top", "NT165285", "Pykestone_Hill", "NT172260", 164, 2.6]] },
            { day: "US9", description: "Gipsy escort – Rachan → Biggar", total_km: 23.2, ascent_m: 400, legs: [["Rachan", "NT086347", "Mossfennan", "NT137300", 133, 6.9], ["Mossfennan", "NT137300", "Broughton", "NT152352", 16, 5.4], ["Broughton", "NT152352", "Biggar", "NT046375", 282, 10.8]] },
            { day: "US10", description: "Pursuit – Biggar → Lanark Moor → Douglas W. → Fords o’ Clyde", total_km: 34.4, ascent_m: 600, legs: [["Biggar", "NT046375", "Lanark_Moor", "NS878430", 288, 17.7], ["Lanark_Moor", "NS878430", "Douglas_Water", "NS840368", 212, 7.3], ["Douglas_Water", "NS840368", "Fords_o_Clyde_Inn", "NS820460", 99, 9.4]] },
            { day: "US10+1", description: "Snow-ride – Fords o’ Clyde → Glasgow", total_km: 29.8, ascent_m: 350, legs: [["Fords_o_Clyde_Inn", "NS820460", "Blantyre", "NS686592", 315, 18.8], ["Blantyre", "NS686592", "Cambuslang", "NS645615", 299, 4.7], ["Cambuslang", "NS645615", "Rutherglen", "NS622622", 287, 2.4], ["Rutherglen", "NS622622", "Gorbals", "NS597646", 314, 3.5], ["Gorbals", "NS597646", "Glasgow_Gates", "NS595650", 333, 0.4]] },
            { day: "US11", description: "Westlands climax – Glasgow → Douglas Muir → Smitwood", total_km: 41.4, ascent_m: 500, legs: [["Glasgow", "NS595650", "Hamilton", "NS715567", 125, 14.6], ["Hamilton", "NS715567", "Douglas_Muir", "NS833344", 152, 25.2], ["Douglas_Muir", "NS833344", "Smitwood_House", "NS840330", 153, 1.6]] }
        ];
        
        // Editorial narrative paraphrases; these are not quotations from Buchan.
        const waypointTooltips = {
            'Wood_of_Dawyck': "Here, a boy of twelve, I first met Marjory Veitch after falling asleep and tumbling into the Tweed.",
            'Peebles_Bridge': "Watching the annual match at bowls when news of a great flood arrived.",
            'Glasgow_Bridge': "Arriving in the city to begin my studies at the College.",
            'Red_Syke': "The goal of a foolhardy race against my cousin Gilbert over the wild hills.",
            'Leith_Harbour': "Riding to Leith to take ship for the Low Countries and a life of study.",
            'Cor_Water_Cave': "Seeking refuge in the hillmen's cave on the Cor Water.",
            'Coomb_Dod_Plateau': "Fleeing the collapsing cave, I made for the desolate moors of Clyde.",
            'Little_Scrape_Hags': "Hiding in the moss-hags after being hunted across the moors.",
            'Fords_o_Clyde_Inn': "The pursuit of my cousin Gilbert begins in earnest.",
            'Smitwood_House': "The final ride to Smitwood, where I believed my troubles would end."
        };


function routeGaps(stage) {
  return stage.legs.slice(1).filter((leg,index)=>stage.legs[index][3]!==leg[1]).map(leg=>leg[0]);
}
if(typeof module!=='undefined') module.exports={OsGridRef,journeyData,waypointTooltips,routeGaps};
if(typeof document!=='undefined') {
  const $=id=>document.getElementById(id), clean=value=>value.replace(/_/g,' ');
  const colors=['#a13636','#28628d','#547744','#754d94','#9c5523','#277b7b'];
  let map=null,routeLayers=[],allBounds=null, selected=0;
  journeyData.forEach((stage,index)=>{const option=document.createElement('option');option.value=index;option.textContent=`${stage.day} · ${stage.description}`;$('stage').append(option);});
  $('stage-count').textContent=`${journeyData.length} reconstructed stages`;
  function updateLayers() {
    if(!map)return;
    routeLayers.forEach((layer,index)=>{
      if(index===selected || $('all-routes').checked){if(!map.hasLayer(layer))layer.addTo(map);}else map.removeLayer(layer);
      layer.eachLayer(part=>{if(part.setStyle)part.setStyle({weight:index===selected?6:3,opacity:index===selected?.95:.3});});
    });
    routeLayers[selected].bringToFront();
  }
  function selectStage(index,zoom=true) {
    selected=index;const stage=journeyData[index];$('stage').value=index;
    $('stage-title').textContent=`${stage.day} · ${stage.description}`;
    $('stage-position').textContent=`Stage ${index+1} of ${journeyData.length}`;
    $('estimates').textContent=`Original estimates: ${stage.total_km} km total; ${stage.ascent_m} m ascent. These figures have not been checked against a surveyed route.`;
    $('legs').replaceChildren();
    stage.legs.forEach((leg,i)=>{
      const li=document.createElement('li');
      const title=document.createElement('strong');title.textContent=`${clean(leg[0])} → ${clean(leg[2])}`;
      const detail=document.createElement('span');detail.textContent=`Grid references: ${leg[1]} → ${leg[3]}. Original estimate: ${leg[5]} km, bearing ${leg[4]}°.`;
      li.append(title,detail);
      if(i && stage.legs[i-1][3]!==leg[1]){const note=document.createElement('em');note.textContent='Gap in supplied route: this leg does not start where the previous leg ends.';li.prepend(note);}
      for(const point of [leg[0],leg[2]])if(waypointTooltips[point]){const note=document.createElement('p');note.className='paraphrase';note.textContent=`Narrative paraphrase: ${waypointTooltips[point]}`;li.append(note);}
      $('legs').append(li);
    });
    $('previous').disabled=index===0;$('next').disabled=index===journeyData.length-1;
    updateLayers();if(map&&zoom)map.fitBounds(routeLayers[index].getBounds(),{padding:[35,35],maxZoom:13});
  }
  $('stage').addEventListener('change',()=>selectStage(Number($('stage').value)));
  $('previous').addEventListener('click',()=>selectStage(selected-1));
  $('next').addEventListener('click',()=>selectStage(selected+1));
  $('all-routes').addEventListener('change',updateLayers);
  $('overview').addEventListener('click',()=>{if(map){$('all-routes').checked=true;updateLayers();map.fitBounds(allBounds,{padding:[35,35]});}});
  if(typeof L!=='undefined') {
    map=L.map('map').setView([55.65,-3.6],9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on('tileerror',()=>{$('map-status').textContent='Some background map tiles could not load. The route sketch and stage list remain available.';}).addTo(map);
    allBounds=L.latLngBounds([]);
    journeyData.forEach((stage,index)=>{
      const group=L.featureGroup(),points=new Set();
      stage.legs.forEach(leg=>{
        const start=OsGridRef.parse(leg[1]).toLatLon(),end=OsGridRef.parse(leg[3]).toLatLon();
        const line=L.polyline([[start.lat,start.lon],[end.lat,end.lon]],{color:colors[index%colors.length],weight:3,opacity:.3}).addTo(group);
        line.bindPopup(`<b>${stage.day}: ${stage.description}</b><br>${clean(leg[0])} → ${clean(leg[2])}<br>Reconstructed connector; not a path.<br>Original estimate: ${leg[5]} km; ${leg[4]}°.<br>${leg[1]} → ${leg[3]}`);
        line.on('click',()=>selectStage(index,false));
        [[leg[0],leg[1],start],[leg[2],leg[3],end]].forEach(([point,grid,location])=>{
          if(points.has(grid))return;points.add(grid);
          const content=`<b>${clean(point)}</b><br>Supplied grid reference: ${grid}<br>${waypointTooltips[point]?'Narrative paraphrase: '+waypointTooltips[point]:'Approximate reconstructed waypoint.'}`;
          L.circleMarker([location.lat,location.lon],{radius:5,weight:1,color:colors[index%colors.length],fillColor:'#fff',fillOpacity:1}).bindPopup(content).addTo(group);
        });
      });
      routeLayers.push(group);allBounds.extend(group.getBounds());
    });
    $('map-status').textContent='Bold line: selected stage. Faint lines: other stages. Click a line or waypoint for details.';
    window.addEventListener('resize',()=>map.invalidateSize());
  }else{$('map').hidden=true;$('overview').disabled=true;$('all-routes').disabled=true;$('map-status').textContent='The online map library could not load. All stage descriptions, grid references and original estimates remain available.';}
  selectStage(0,false);if(map)map.fitBounds(allBounds,{padding:[30,30]});
}

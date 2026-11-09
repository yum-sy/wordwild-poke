import {SPECIES} from './monsters.js';
export const DEX_KEY='wordwild-pokemon-v2-dex';
export function normalizeDex(value){const result={};for(const s of SPECIES){const d=value?.[s.id];if(d&&typeof d==='object')result[s.id]={seen:!!d.seen||!!d.caught,caught:!!d.caught,shiny:!!d.shiny&&!!d.caught};}return result;}
export function recordDex(dex,m,caught=false){if(!m||!SPECIES.some(s=>s.id===m.speciesId))return;const d=dex[m.speciesId]||{seen:false,caught:false,shiny:false};d.seen=true;d.caught||=caught;d.shiny||=caught&&m.rareForm==='shiny';dex[m.speciesId]=d;}
export function collectRunDex(dex,g){if(!g)return;if(!g.luckyEvent)recordDex(dex,g.enemy);for(const m of [...g.party,...(g.dexCaught||[])])recordDex(dex,m,true);}

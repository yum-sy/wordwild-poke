import { POKEMON_ROSTER } from './pokemon-roster.js';
import { BOSS_DRAGONS } from './boss-dragons.js';
import { MONSTER_FRAMES } from './monster-frames.js';
import { EXPANSION_SPECIES } from './monster-expansion.js';
export const SPECIES = [
  { id:'sprout', name:'Thornix', title:'The leaf raptor', passive:'growth', color:'#9be569', dark:'#4d9d59', type:'LEAF', cell:0, note:'Fast claws. Big growth.' },
  { id:'ember', name:'Pyrofang', title:'The fire wolf', passive:'attack', color:'#ffac57', dark:'#d8623e', type:'FIRE', cell:1, note:'A brave heart. A fierce bite.' },
  { id:'aqua', name:'Riptide', title:'The steel shark', passive:'heal', color:'#74d8ed', dark:'#4d97cb', type:'WATER', cell:2, note:'Strong armor. A kind heart.' },
  { id:'mush', name:'Shroomshade', title:'The hidden hunter', passive:'heal', color:'#c7a1ed', dark:'#8d6fb7', type:'SPORE', cell:3, note:'Small steps. Sharp blades.' },
  { id:'sun', name:'Voltusk', title:'The thunder beetle', passive:'attack', color:'#f8d365', dark:'#bd983d', type:'SPARK', cell:7, note:'Gold armor. Thunder horns.' },
  { id:'cloud', name:'Stormwing', title:'The sky hunter', passive:'growth', color:'#9cbbff', dark:'#6589db', type:'SKY', cell:11, note:'Ride the wind. Rule the sky.' },
  ...BOSS_DRAGONS,
  ...EXPANSION_SPECIES,
].map(s => ({...s, ...POKEMON_ROSTER[s.id], title:'Your Pokémon friend', note:`Meet ${POKEMON_ROSTER[s.id].name}.`}));
export const speciesOf = m => SPECIES.find(s=>s.id===m.speciesId)||SPECIES[0];
export const monsterName = m => speciesOf(m).name;
export const PASSIVES = {
  attack:{name:'Power',icon:'✦',description:'Get 2 right. Hit harder!'},
  heal:{name:'Heal',icon:'♥',description:'Get 2 right. Gain HP!'},
  growth:{name:'Grow',icon:'◆',description:'Get 2 right. Get more loot!'},
};
// One base sprite per species. Evolution reuses it with CSS scale, tint and aura only.
export function monsterArt(m,size=160,view='front') {
  const s=typeof m==='string'?(SPECIES.find(s=>s.id===m)||SPECIES[0]):speciesOf(m);
  const evo=typeof m==='object'?m.evolutionStage||0:0;
  const sparkles=typeof m==='object'&&['gold','silver','large'].includes(m.rareForm)?'<i class="rare-sparkles">'+Array.from({length:6},(_,i)=>`<i class="rare-sparkle sparkle-${i}"></i>`).join('')+'</i>':'';
  const shiny=typeof m==='object'&&m.rareForm==='gold';
  const facing=view==='back'?'back':'front';
  const src='/assets/pokemon/'+`${s.pokemonId}-${facing}${shiny?'-shiny':''}.png`;
  return `<span class="monster-art pokemon-art rare-${typeof m==='object'?m.rareForm||'normal':'normal'} atlas-${s.atlas||'original'} evo-${evo} ${typeof m==='object'?m.evolutionRoute||'':''}" style="--sprite-size:${size}px;--ground-bottom:8%;--aura:${s.color}" aria-hidden="true"><i class="monster-ground"></i><span class="sprite-pixels"><span class="pokemon-fallback">?</span><img class="pokemon-image" src="${src}" alt="" width="96" height="96" onerror="this.hidden=true" draggable="false"></span>${sparkles}</span>`;
}

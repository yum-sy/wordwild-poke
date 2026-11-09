import {POKEMON_DATA} from './pokemon-data.js';
const colors={GRASS:'#9be569',FIRE:'#ffac57',WATER:'#74d8ed',ELECTRIC:'#f8d365',ICE:'#9ddcf4',GROUND:'#d5ba86',ROCK:'#d5ba86',POISON:'#c7a1ed',BUG:'#b7ed82',FLYING:'#9cbbff',PSYCHIC:'#eea4ce',GHOST:'#c7a1ed',DARK:'#b9a2df',DRAGON:'#b5a1ff',STEEL:'#c1d0dd',NORMAL:'#d7c7ab',FIGHTING:'#eeab86',FAIRY:'#eea4ce'};
const passiveFor=t=>['FIRE','FIGHTING','ELECTRIC','DRAGON','DARK'].includes(t)?'attack':['WATER','ICE','FAIRY','PSYCHIC'].includes(t)?'heal':'growth';
export const SPECIES=POKEMON_DATA.map(s=>({...s,color:colors[s.type]||'#b4e77a',dark:colors[s.type]||'#b4e77a',passive:passiveFor(s.type),bossPassives:[passiveFor(s.type),passiveFor(s.type)==='attack'?'growth':'attack'],title:'Your Pokémon friend',note:`Meet ${s.name}.`}));
export const speciesOf=m=>SPECIES.find(s=>s.id===(typeof m==='string'?m:m?.speciesId))||SPECIES[0];
export const monsterName=m=>speciesOf(m).name;
export const PASSIVES={attack:{name:'Power',icon:'✦',description:'Get 2 right. Hit harder!'},heal:{name:'Heal',icon:'♥',description:'Get 2 right. Gain HP!'},growth:{name:'Grow',icon:'◆',description:'Get 2 right. Get more loot!'}};
export function monsterArt(m,size=160,view='front',animated=false,battleScale=1){
 const s=speciesOf(m),evo=typeof m==='object'?m.evolutionStage||0:0,shiny=m?.rareForm==='shiny';
 const base='/assets/pokemon/'+`${s.pokemonId}-${view==='back'?'back':'front'}${shiny?'-shiny':''}`;
 const sparkles=shiny?'<i class="rare-sparkles">'+Array.from({length:6},(_,i)=>`<i class="rare-sparkle sparkle-${i}"></i>`).join('')+'</i>':'';
 return `<span class="monster-art pokemon-art rare-${shiny?'shiny':'normal'} evo-${evo} ${m?.evolutionRoute||''}" style="--battle-scale:${battleScale};--sprite-size:${size}px;--ground-bottom:8%;--aura:${s.color}" aria-hidden="true"><i class="monster-ground"></i><span class="sprite-pixels"><span class="pokemon-fallback">?</span><img class="pokemon-image" src="${base}.png" data-static="${base}.png" ${animated&&s.animated?`data-animated="${base}.gif"`:''} alt="" width="96" height="96" draggable="false"></span>${sparkles}</span>`;
}

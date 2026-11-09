export const STARTER_KEY='wordwild-pokemon-v2-starters';
export const STARTER_POOLS=[['p001','p152'],['p004','p155'],['p007','p158']];
export const rollStarters=(rng=Math.random)=>STARTER_POOLS.map(pool=>pool[Math.min(1,Math.floor(rng()*2))]);
const valid=v=>v&&Array.isArray(v.choices)&&v.choices.length===3&&v.choices.every((id,i)=>STARTER_POOLS[i].includes(id))&&v.choices.includes(v.selected);
export function loadStarters(storage,rng=Math.random){let v;try{v=JSON.parse(storage?.getItem(STARTER_KEY));}catch{}return valid(v)?v:{choices:rollStarters(rng),selected:null,finishedRun:null};}
export function saveStarters(storage,state){if(!state.selected)state.selected=state.choices[1];try{storage.setItem(STARTER_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function finishStarters(state,runId,rng=Math.random){if(!runId||state.finishedRun===runId)return state;const choices=rollStarters(rng);return {choices,selected:choices[1],finishedRun:runId};}
export function resetLegacyStorage(storage){try{const keys=[];for(let i=0;i<storage.length;i++){const k=storage.key(i);if(k.startsWith('wordwild-pokemon-')&&!k.startsWith('wordwild-pokemon-v2-'))keys.push(k);}for(const k of keys)storage.removeItem(k);return true;}catch{return false;}}

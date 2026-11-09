export const RARE_CHANCE=.01;
export const RARE_FORMS=Object.freeze({shiny:{name:'Shiny',chance:RARE_CHANCE}});
export function rollRareForm(rng=Math.random){return rng()<RARE_CHANCE?'shiny':null;}
export const rareLabel=m=>m?.rareForm==='shiny'?'Shiny':'';
export function normalizeCollection(value){if(!Array.isArray(value))return [];const seen=new Set();return value.filter(x=>{if(!x||typeof x.speciesId!=='string'||x.rareForm!=='shiny'||seen.has(x.speciesId))return false;seen.add(x.speciesId);return true;}).map(x=>({speciesId:x.speciesId,rareForm:'shiny',evolutionStage:0}));}
export function mergeCollection(a,b){return normalizeCollection([...(a||[]),...(b||[])]);}

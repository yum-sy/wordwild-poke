import test from 'node:test';
import assert from 'node:assert/strict';
import {createMonster,evolve,newGame,reward,previewGrowthReward,pickWild,claimLuckyEvent} from '../src/game.js';
import {speciesOf} from '../src/monsters.js';
import {growthGoals} from '../src/growth.js';
import {STARTER_KEY,STARTER_POOLS,rollStarters,loadStarters,saveStarters,finishStarters,resetLegacyStorage} from '../src/starter-store.js';
import {recordDex,collectRunDex,normalizeDex} from '../src/pokedex.js';
const storage=()=>{const m=new Map();return {get length(){return m.size;},key:i=>[...m.keys()][i],getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
test('real evolution changes species once and preserves individual stats, skill and shiny identity',()=>{
 const m=createMonster('p001',1,()=>.1);m.rareForm='shiny';m.maxHp=10;m.evolutionBaseline.hp=5;const id=m.id,skills=[...m.passiveTypes],attack=m.attack,fragments=m.shieldFragments;
 assert.equal(evolve(m,'hp'),true);assert.equal(m.speciesId,'p002');assert.equal(m.maxHp,12);assert.equal(m.currentHp,12);assert.equal(m.attack,attack);assert.equal(m.shieldFragments,fragments);assert.equal(m.id,id);assert.deepEqual(m.passiveTypes,skills);assert.equal(m.rareForm,'shiny');assert.equal(m.lastEvolution.fromSpeciesId,'p001');assert.equal(m.lastEvolution.toSpeciesId,'p002');
 m.maxHp=24;assert.equal(evolve(m,'hp'),true);assert.equal(m.speciesId,'p003');assert.equal(m.maxHp,29);assert.equal(evolve(m,'hp',true),false);
});
test('Eevee picks each of the five generation I/II branches uniformly then powers up that body',()=>{
 const expected=['p134','p135','p136','p196','p197'];
 for(let i=0;i<5;i++){const m=createMonster('p133');assert.ok(evolve(m,'attack',true,()=>((i+.5)/5)));assert.equal(m.speciesId,expected[i]);assert.ok(evolve(m,'hp',true,()=>.99));assert.equal(m.speciesId,expected[i]);assert.equal(m.evolutionStage,2);assert.equal(evolve(m,'hp',true),false);}
});
test('other branches use a random valid outcome; final and single bodies power up without species changes',()=>{
 for(const [id,outcomes] of [['p044',['p045','p182']],['p061',['p062','p186']],['p079',['p080','p199']],['p236',['p106','p107','p237']]])for(let i=0;i<outcomes.length;i++){const m=createMonster(id);evolve(m,'hp',true,()=>((i+.5)/outcomes.length));assert.equal(m.speciesId,outcomes[i]);}
 for(const id of ['p131','p026','p003']){const m=createMonster(id);evolve(m,'attack',true);evolve(m,'hp',true);assert.equal(m.speciesId,id);assert.equal(m.evolutionStage,2);}
 const boss=createMonster('p151');assert.equal(evolve(boss,'hp',true),false);assert.equal(boss.evolutionStage,0);
});
test('growth goals depend on permanent stats and match the exact evolution thresholds',()=>{
 const m=createMonster('p001');m.maxHp=9;m.attack=3;m.maxShield=2;m.shieldFragments=3;m.evolutionBaseline={hp:5,attack:2,shieldStat:1};
 const goals=growthGoals(m);assert.deepEqual(goals.map(g=>[g.value,g.target,g.remaining,g.ready]),[[9,10,1,false],[3,4,1,false],[11,12,1,false]]);
 m.currentHp=0;m.currentShield=0;assert.deepEqual(growthGoals(m),goals);assert.equal(evolve(m,'shield'),false);m.maxShield=3;m.shieldFragments=0;assert.equal(growthGoals(m)[2].ready,true);assert.ok(evolve(m,'shield'));assert.equal(m.maxShield,4);assert.equal(growthGoals(m)[2].target,48);
 m.evolutionStage=2;assert.deepEqual(growthGoals(m),[]);assert.deepEqual(growthGoals(createMonster('p150')),[]);
});
test('reward preview is side-effect free and shows the same pre-evolution permanent increase',()=>{
 const g=newGame('p004',null,()=>.1),m=g.party[0];m.evolutionStage=0;m.evolutionBaseline={hp:100,attack:100,shieldStat:100};g.phase='reward-target';g.rewardChoices=['shield-pair'];g.selectedReward='shield-pair';g.growthCombo=3;m.maxShield=2;m.shieldFragments=3;const before=structuredClone(g),preview=previewGrowthReward(g,m);
 assert.deepEqual(g,before);reward(g,g.selectedReward,m.id);assert.deepEqual(growthGoals(m),growthGoals(preview));assert.equal(m.maxShield,3);assert.equal(m.shieldFragments,2);
});
test('starter sampling produces exactly eight type-balanced combinations with independent half intervals',()=>{
 const combos=new Set();for(let mask=0;mask<8;mask++){let i=0;const choices=rollStarters(()=>mask&(1<<i++)?.5:0);assert.equal(choices.length,3);choices.forEach((v,j)=>assert.equal(v,STARTER_POOLS[j][(mask>>j)&1]));combos.add(choices.join());}assert.equal(combos.size,8);
 assert.deepEqual(rollStarters(()=>.5-Number.EPSILON),['p001','p004','p007']);assert.deepEqual(rollStarters(()=>.5),['p152','p155','p158']);
});
test('starter candidates survive reload and one completed run rotates only once',()=>{
 const s=storage(),initial=loadStarters(s,()=>0);assert.equal(saveStarters(s,initial),true);const loaded=loadStarters(s,()=>.999);assert.deepEqual(loaded,initial);
 const after=finishStarters(loaded,'run-a',()=>.999);assert.deepEqual(after.choices,['p152','p155','p158']);assert.equal(saveStarters(s,after),true);const restored=loadStarters(s,()=>0);assert.deepEqual(restored,after);assert.deepEqual(finishStarters(restored,'run-a',()=>0),after);
 const next=finishStarters(restored,'run-b',()=>0);assert.deepEqual(next.choices,['p001','p004','p007']);assert.equal(next.finishedRun,'run-b');assert.equal(STARTER_KEY,'wordwild-pokemon-v2-starters');
});
test('reset deletes only the old fan game namespace and never backs up or deletes original progress',()=>{
 const s=storage();for(const key of ['wordwild-run-v1','wordwild-hall','wordwild-pokemon-run-v1','wordwild-pokemon-learning-v2','wordwild-pokemon-v2-starters','other'])s.setItem(key,'keep');assert.equal(resetLegacyStorage(s),true);assert.equal(s.length,4);for(const k of ['wordwild-run-v1','wordwild-hall','wordwild-pokemon-v2-starters','other'])assert.equal(s.getItem(k),'keep');assert.equal(s.getItem('wordwild-pokemon-run-v1'),undefined);
});
test('Pokédex distinguishes seen from caught shiny and records retained evolution/capture history',()=>{
 const dex={};recordDex(dex,{speciesId:'p025',rareForm:'shiny'});assert.deepEqual(dex.p025,{seen:true,caught:false,shiny:false});recordDex(dex,{speciesId:'p025',rareForm:null},true);assert.equal(dex.p025.shiny,false);recordDex(dex,{speciesId:'p025',rareForm:'shiny'},true);assert.equal(dex.p025.shiny,true);
 const g=newGame('p004',null,()=>.1);g.dexCaught.push({speciesId:'p002',rareForm:'shiny'});collectRunDex(dex,g);assert.equal(dex.p004.caught,true);assert.equal(dex.p002.shiny,true);assert.equal(dex[g.enemy.speciesId].seen,true);
 assert.equal(normalizeDex({unknown:{seen:true},p001:{seen:false,caught:true,shiny:true}}).p001.seen,true);assert.equal(normalizeDex({unknown:{seen:true}}).unknown,undefined);
});
test('wild evolution-depth boundaries preserve early basics and unlock later forms without bosses',()=>{
 for(const [stage,n,depth] of [[1,.999,0],[30,.999,0],[31,.699999,0],[31,.7,1],[60,.999,1],[61,.449999,0],[61,.45,1],[61,.85,2],[81,.299999,0],[81,.3,1],[81,.75,2]]){
  let i=0;const id=pickWild(stage,()=>i++===0?n:.1);assert.equal(speciesOf(id).depth,depth);assert.equal(speciesOf(id).isBoss,false);
 }
});
test('later-generation evolutions are excluded but generation II cross-generation links remain',()=>{
 for(const [id,next] of [['p095','p208'],['p113','p242'],['p123','p212']]){const m=createMonster(id);evolve(m,'attack',true);assert.equal(m.speciesId,next);}
 for(const id of ['p126','p125','p114','p200']){const m=createMonster(id);evolve(m,'attack',true);assert.equal(m.speciesId,id);}
});

test('treasure stages never count the hidden generated enemy as a seen Pokémon, even after the gift',()=>{
 const g=newGame('p004',null,()=>0);assert.equal(g.phase,'lucky-event');assert.notEqual(g.enemy.speciesId,g.party[0].speciesId);
 for(const claim of [false,true]){if(claim)assert.ok(claimLuckyEvent(g));const dex={};collectRunDex(dex,g);assert.equal(dex[g.enemy.speciesId],undefined);assert.equal(dex.p004.caught,true);}
});

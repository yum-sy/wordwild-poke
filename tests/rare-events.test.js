import test from 'node:test';import assert from 'node:assert/strict';
import {rollRareForm,mergeCollection,RARE_CHANCE,RARE_FORMS} from '../src/rare-monsters.js';
import {newGame,beginBattle,claimLuckyEvent,capture,evolve,LUCKY_EVENT_CHANCE} from '../src/game.js';
import {saveRun,loadRun} from '../src/run-store.js';
const storage=()=>{let value=null;return {getItem:()=>value,setItem:(k,v)=>value=v,removeItem:()=>value=null};};
test('shiny alone occupies exactly the 1% interval',()=>{
 assert.equal(RARE_CHANCE,.01);assert.deepEqual(Object.keys(RARE_FORMS),['shiny']);
 assert.equal(RARE_FORMS.shiny.chance,.01);
 for(const [n,expected] of [[0,'shiny'],[.01-1e-12,'shiny'],[.01,null],[.999999,null]])assert.equal(rollRareForm(()=>n),expected);
 assert.deepEqual(mergeCollection([{speciesId:'p001',rareForm:'gold'},{speciesId:'p001',rareForm:'silver'},{speciesId:'p001',rareForm:'large'}],[]),[]);
});
test('capture, evolution, collection and inheritance preserve a rare appearance',()=>{
 const g=newGame('p004',null,()=>.1);g.enemy.rareForm='shiny';g.phase='capture';capture(g,()=>0);const caught=g.party[1];assert.equal(caught.rareForm,'shiny');evolve(caught,'attack',true);assert.equal(caught.rareForm,'shiny');assert.equal(mergeCollection(g.rareFinds,g.rareFinds).length,1);const fresh=newGame(caught.speciesId,caught,()=>.1);assert.equal(fresh.party[0].rareForm,'shiny');
});
test('lucky stages give no question or learning exposure and cannot happen at bosses',()=>{
 const g=newGame('p004',null,()=>.1),seen=g.learning.sequence;g.stage=9;beginBattle(g,()=>0);assert.equal(g.phase,'lucky-event');assert.equal(g.question,null);assert.equal(g.learning.sequence,seen);g.stage=10;beginBattle(g,()=>0);assert.equal(g.phase,'battle');assert.equal(g.enemy.isBoss,true);assert.equal(LUCKY_EVENT_CHANCE,.0075);
});
test('event reward is claim-once and stays fixed after reload, including initial-stage events',()=>{
 const g=newGame('p004',null,()=>0),s=storage();assert.equal(g.phase,'lucky-event');saveRun(s,g);const r=loadRun(s);assert.ok(r);assert.deepEqual(r.luckyEvent,g.luckyEvent);assert.ok(claimLuckyEvent(r));assert.equal(r.goldenNets,1);assert.equal(claimLuckyEvent(r),false);saveRun(s,r);const resumed=loadRun(s);assert.equal(resumed.phase,'camp');assert.equal(resumed.goldenNets,1);
});
test('all gifts apply with no targeting; spring has value even at full health',()=>{
 for(const reward of ['golden-net','shield-all','restore-all']){const g=newGame('p004',null,()=>0);g.luckyEvent.reward=reward;assert.ok(claimLuckyEvent(g));assert.ok(['camp','evolution'].includes(g.phase));if(reward==='restore-all')assert.equal(g.goldenNets,1);}
});

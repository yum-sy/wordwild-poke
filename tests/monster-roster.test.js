import test from 'node:test';
import assert from 'node:assert/strict';
import {SPECIES,speciesOf} from '../src/monsters.js';
import {makeEnemy,newGame,nextStage,capture,activeMonster,pickWild,rollBossOrder,BOSS_IDS} from '../src/game.js';
function sequence(values){let i=0;return ()=>values[i++%values.length];}
test('251 unique national species have bounded evolution links and the 11 legendary/mythical bosses',()=>{
 assert.equal(SPECIES.length,251);assert.equal(new Set(SPECIES.map(s=>s.id)).size,251);
 assert.deepEqual(SPECIES.map(s=>s.pokemonId).sort((a,b)=>a-b),Array.from({length:251},(_,i)=>i+1));
 for(const s of SPECIES){assert.ok(['attack','heal','growth'].includes(s.passive));assert.ok(SPECIES.some(p=>p.id===s.family));for(const next of s.evolvesTo)assert.ok(SPECIES.some(p=>p.id===next));}
 assert.deepEqual(BOSS_IDS.map(id=>speciesOf(id).pokemonId).sort((a,b)=>a-b),[144,145,146,150,151,243,244,245,249,250,251]);
 assert.equal(speciesOf('p025').family,'p172');assert.equal(speciesOf('p025').depth,1);
});
test('every eligible species can be selected through family-first wild sampling',()=>{
 for(const [stage,depth,roll] of [[1,0,.5],[31,1,.9],[61,2,.99]]){
  const eligible=SPECIES.filter(s=>!s.isBoss&&s.depth===depth),families=[...new Set(eligible.map(s=>s.family))],seen=new Set();
  for(let i=0;i<families.length;i++){const members=eligible.filter(s=>s.family===families[i]);for(let j=0;j<members.length;j++)seen.add(pickWild(stage,sequence([roll,(i+.5)/families.length,(j+.5)/members.length])));}
  assert.deepEqual([...seen].sort(),eligible.map(s=>s.id).sort());
 }
 for(let i=0;i<100;i++){const s=speciesOf(pickWild(30,()=>i/100));assert.equal(s.depth,0);assert.equal(s.isBoss,false);}
});
test('recent wild families are avoided and captured newcomers keep their identity',()=>{
 const g=newGame('p004',null,()=>0),recent=[];
 for(let i=0;i<8;i++){const family=speciesOf(g.enemy).family;assert.ok(!recent.slice(-3).includes(family));recent.push(family);g.phase='camp';nextStage(g,()=>0);}
 const banned=['p001','p004','p007'];for(let i=0;i<100;i++){const s=speciesOf(pickWild(50,()=>i/100,banned));assert.ok(!banned.includes(s.family));}
 g.enemy=makeEnemy(31,()=>.99);g.phase='capture';const id=g.enemy.speciesId;assert.equal(capture(g,()=>0),true);assert.ok(g.party.some(m=>m.speciesId===id));assert.ok(activeMonster(g));
});
test('ten bosses follow the saved shuffled order and remain catchable with their own skills',()=>{
 const orders=[rollBossOrder(()=>0),rollBossOrder(()=>.999)];assert.notDeepEqual(...orders);
 for(const order of orders){assert.equal(order.length,10);assert.equal(new Set(order).size,10);assert.ok(order.every(id=>BOSS_IDS.includes(id)));}
 const order=orders[0];for(let stage=10;stage<=100;stage+=10){const enemy=makeEnemy(stage,()=>0,[],order);assert.equal(enemy.speciesId,order[stage/10-1]);assert.equal(enemy.isBoss,true);assert.deepEqual(enemy.passiveTypes,speciesOf(enemy).bossPassives);const g=newGame('p004',null,()=>0);g.enemy=enemy;g.phase='capture';g.goldenNets=1;assert.equal(capture(g,()=>.999),true);assert.ok(g.party.some(m=>m.speciesId===enemy.speciesId));}
});

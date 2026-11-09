import test from 'node:test';
import assert from 'node:assert/strict';
import {SPECIES} from '../src/monsters.js';
import {battleScales} from '../src/battle-scale.js';
const m=(id,boss=false)=>({speciesId:id,isBoss:boss});
test('all 251 have canonical heights; Charmander and Ho-Oh retain their scale ordering',()=>{
 assert.ok(SPECIES.every(s=>s.heightM>0));
 assert.equal(SPECIES.find(s=>s.id==='p004').heightM,.6);
 assert.equal(SPECIES.find(s=>s.id==='p250').heightM,3.8);
 const scale=battleScales(m('p004'),m('p250',true));
 assert.ok(scale.enemy/scale.player>2);assert.equal(scale.enemy,1);
});
test('relative size is side-neutral, bounded, and does not make small legendary Pokémon gigantic',()=>{
 const forward=battleScales(m('p004'),m('p006')),reverse=battleScales(m('p006'),m('p004'));
 assert.equal(forward.player,reverse.enemy);assert.equal(forward.enemy,reverse.player);
 const equal=battleScales(m('p025'),m('p025'));assert.equal(equal.player,equal.enemy);
 const tinyBoss=battleScales(m('p208'),m('p151',true));assert.ok(tinyBoss.enemy<tinyBoss.player);assert.ok(tinyBoss.enemy>=.7);
 for(const a of SPECIES)for(const b of SPECIES){const s=battleScales(m(a.id,a.isBoss),m(b.id,b.isBoss));assert.ok(s.player>=.42&&s.player<=1&&s.enemy>=.42&&s.enemy<=1);}
});

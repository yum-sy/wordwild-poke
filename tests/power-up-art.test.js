import test from 'node:test';
import assert from 'node:assert/strict';
import {createMonster,evolve,newGame} from '../src/game.js';
import {monsterArt,powerUpStage} from '../src/monsters.js';
test('real evolution has no power-up aura, including reaching a final form',()=>{const m=createMonster('p001');evolve(m,'hp',true);assert.equal(m.speciesId,'p002');assert.match(monsterArt(m),/evo-0/);evolve(m,'hp',true);assert.equal(m.speciesId,'p003');assert.match(monsterArt(m),/evo-0/);});
test('Eevee evolves without aura then earns aura on same-form growth',()=>{const m=createMonster('p133');evolve(m,'attack',true,()=>0);assert.equal(powerUpStage(m),0);evolve(m,'hp',true);assert.equal(powerUpStage(m),1);assert.match(monsterArt(m),/evo-1/);assert.equal(newGame(m.speciesId,m).party[0].powerUpStage,1);});
test('no-evolution species receive one aura rank per growth',()=>{const m=createMonster('p131');evolve(m,'hp',true);assert.equal(powerUpStage(m),1);evolve(m,'attack',true);assert.equal(powerUpStage(m),2);});
test('existing saves distinguish real evolution from same-species growth',()=>{const m=createMonster('p133');evolve(m,'hp',true,()=>0);delete m.powerUpStage;assert.equal(powerUpStage(m),0);evolve(m,'attack',true);delete m.powerUpStage;assert.equal(powerUpStage(m),1);});

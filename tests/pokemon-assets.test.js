import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {SPECIES,monsterArt} from '../src/monsters.js';
import {RUN_KEY} from '../src/run-store.js';
import {LEARNING_KEY} from '../src/learning-record.js';
const manifest=JSON.parse(readFileSync(new URL('../assets/pokemon/asset-manifest.json',import.meta.url)));
test('every mapped Pokémon has verified local front/back and shiny files',()=>{
 assert.equal(new Set(SPECIES.map(s=>s.pokemonId)).size,64);
 assert.equal(manifest.length,256);
 for(const s of SPECIES)for(const view of ['front','back'])for(const shiny of [false,true]){
  const file=`${s.pokemonId}-${view}${shiny?'-shiny':''}.png`;
  const entry=manifest.find(a=>a.file===file);assert.ok(entry,file);
  const data=readFileSync(new URL('../assets/pokemon/'+file,import.meta.url));
  assert.equal(createHash('sha256').update(data).digest('hex'),entry.sha256);
  assert.equal(data.readUInt32BE(16),96);assert.equal(data.readUInt32BE(20),96);
  assert.ok(monsterArt({speciesId:s.id,rareForm:shiny?'gold':null},160,view).includes(file));
 }
});
test('save namespaces and missing species fallback are isolated',()=>{
 assert.ok(RUN_KEY.startsWith('wordwild-pokemon-'));
 assert.ok(LEARNING_KEY.startsWith('wordwild-pokemon-'));
 assert.ok(monsterArt('unknown').includes('1-front.png'));
 assert.ok(monsterArt('sprout').includes('onerror="this.hidden=true"'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {SPECIES,monsterArt} from '../src/monsters.js';
import {RUN_KEY} from '../src/run-store.js';
import {LEARNING_KEY} from '../src/learning-record.js';
const manifest=JSON.parse(readFileSync(new URL('../assets/pokemon/asset-manifest.json',import.meta.url)));
test('all 251 species have verified local normal/shiny front/back static and animated files',()=>{
 assert.equal(new Set(SPECIES.map(s=>s.pokemonId)).size,251);
 assert.equal(manifest.length,2008);assert.equal(new Set(manifest.map(e=>e.file)).size,2008);
 const byFile=new Map(manifest.map(e=>[e.file,e]));
 for(const s of SPECIES){assert.equal(s.animated,true);for(const view of ['front','back'])for(const shiny of [false,true])for(const ext of ['png','gif']){
  const file=`${s.pokemonId}-${view}${shiny?'-shiny':''}.${ext}`;
  const entry=byFile.get(file);assert.ok(entry?.available,file);
  const data=readFileSync(new URL('../assets/pokemon/'+file,import.meta.url));
  assert.equal(createHash('sha256').update(data).digest('hex'),entry.sha256,file);
  assert.equal(ext==='png'?data.readUInt32BE(16):data.readUInt16LE(6),96);assert.equal(ext==='png'?data.readUInt32BE(20):data.readUInt16LE(8),96);
  if(ext==='gif'){assert.ok(entry.frameCount>1);assert.ok(entry.durationMs>0);assert.equal(entry.durationMs,entry.sourceDurationsMs.reduce((a,b)=>a+b,0),file);}
  assert.match(entry.url,/githubusercontent\.com\/PokeAPI\/sprites\/[0-9a-f]{40}\//);
  assert.ok(monsterArt({speciesId:s.id,rareForm:shiny?'shiny':null},160,view,true).includes(file));
 }}
});
test('v2 save namespaces and missing species fallback remain isolated',()=>{
 assert.ok(RUN_KEY.startsWith('wordwild-pokemon-v2-'));
 assert.ok(LEARNING_KEY.startsWith('wordwild-pokemon-v2-'));
 assert.ok(monsterArt('unknown').includes('1-front.png'));
 assert.ok(monsterArt('p001').includes('data-static="/assets/pokemon/1-front.png"'));
 assert.ok(monsterArt('p001').includes('pokemon-fallback'));
});

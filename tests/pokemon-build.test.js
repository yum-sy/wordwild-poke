import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir,mkdtemp,copyFile,readFile,access,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
test('subpath builds preserve local static/animated URLs, notices and exclude QA files',async()=>{
 await mkdir(path.join(root,'work'),{recursive:true});const temp=await mkdtemp(path.join(root,'work/build-test-'));
 try{
  const files=['index.html','manifest.webmanifest','LICENSE','THIRD_PARTY_NOTICES.md','package.json','src/monsters.js','src/pokemon-data.js','src/animated-art.js','assets/pokemon/1-front.png','assets/pokemon/1-front.gif','assets/pokemon/1-back-shiny.png','assets/pokemon/1-back-shiny.gif','assets/pokemon/UPSTREAM-LICENCE.txt'];
  for(const file of files){await mkdir(path.dirname(path.join(temp,file)),{recursive:true});await copyFile(path.join(root,file),path.join(temp,file));}
  await copyFile(path.join(root,'src/monsters.js'),path.join(temp,'src/qa-excluded.js'));
  execFileSync(process.execPath,[path.join(root,'scripts/build-pages.js')],{cwd:temp,env:{...process.env,BASE_PATH:'/wordwild-pokemon-fangame/',GITHUB_SHA:'testbuild123'},stdio:'pipe'});
  const {monsterArt}=await import(pathToFileURL(path.join(temp,'dist/src/monsters.js')).href);
  const art=monsterArt({speciesId:'p001',rareForm:'shiny'},160,'back',true);
  for(const attr of ['src','data-static','data-animated'])assert.ok(art.includes(`${attr}="/wordwild-pokemon-fangame/assets/pokemon/1-back-shiny.`),attr);
  await access(path.join(temp,'dist/assets/pokemon/1-front.gif'));await access(path.join(temp,'dist/assets/pokemon/UPSTREAM-LICENCE.txt'));await access(path.join(temp,'dist/THIRD_PARTY_NOTICES.md'));
  await assert.rejects(access(path.join(temp,'dist/src/qa-excluded.js')));
  assert.match(await readFile(path.join(temp,'dist/index.html'),'utf8'),/\/wordwild-pokemon-fangame\/src\/app\.js\?v=testbuild123/);
 }finally{await rm(temp,{recursive:true,force:true});}
});

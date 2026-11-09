import test from 'node:test';
import assert from 'node:assert/strict';
import {installAnimatedArt} from '../src/animated-art.js';
test('animated sources stop for reduced motion/background and fall back without a request loop',()=>{
 const oldDocument=globalThis.document,oldMatchMedia=globalThis.matchMedia;
 let visibility,motion,error,source='/assets/pokemon/1-front.png';
 const img={dataset:{static:source,animated:'/assets/pokemon/1-front.gif'},hidden:false,matches:s=>s==='.pokemon-image',getAttribute:()=>source,get src(){return source;},set src(s){source=s;}};
 const reduced={matches:false,addEventListener:(event,fn)=>{assert.equal(event,'change');motion=fn;}};
 const root={querySelectorAll:()=>img.dataset.animated?[img]:[],addEventListener:(event,fn,capture)=>{assert.equal(event,'error');assert.equal(capture,true);error=fn;}};
 try{
  globalThis.document={hidden:false,addEventListener:(event,fn)=>{assert.equal(event,'visibilitychange');visibility=fn;}};
  globalThis.matchMedia=q=>{assert.equal(q,'(prefers-reduced-motion: reduce)');return reduced;};
  const update=installAnimatedArt(root);update();assert.ok(source.endsWith('.gif'));
  document.hidden=true;visibility();assert.ok(source.endsWith('.png'));document.hidden=false;visibility();assert.ok(source.endsWith('.gif'));
  reduced.matches=true;motion();assert.ok(source.endsWith('.png'));reduced.matches=false;motion();assert.ok(source.endsWith('.gif'));
  error({target:img});assert.ok(source.endsWith('.png'));assert.equal(img.dataset.animated,undefined);update();assert.ok(source.endsWith('.png'));error({target:img});assert.equal(img.hidden,true);
 }finally{globalThis.document=oldDocument;globalThis.matchMedia=oldMatchMedia;}
});

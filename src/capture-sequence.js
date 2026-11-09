import {ballId,ballInfo,captureBallFor} from './capture-balls.js';
import {capture} from './game.js';
export const CAPTURE_TIMING=Object.freeze({throw:650,absorb:450,drop:400,shake1:500,shake2:500,shake3:500,result:1100});
// Commit the entire attempt BEFORE presentation. Reload cannot refund or reroll it.
export function startCaptureAttempt(game,rng=Math.random){
 if(game.phase!=='capture'||game.attempts>=3||game.captureResult==='success')return null;
 const ball=captureBallFor(game);
 const success=capture(game,rng);
 game.captureBall=ball;
 return {ball,success};
}
export function captureBallArt(ball='poke-ball'){
 const name=ballId(ball);
 return `<span class="capture-ball" aria-hidden="true"><img src="${'/assets/capture/'}${name}.png" alt="" width="32" height="32"><i class="ball-button"></i></span><span class="capture-flash" aria-hidden="true"></span><span class="capture-stars" aria-hidden="true">✦ ✧ ✦</span>`;
}
export function captureFrameLabel(frame,ball='poke-ball'){return ({throw:`Throw the ${ballInfo(ball).name}!`,absorb:'Into the ball!',drop:'Wait for it…',shake1:'One…',shake2:'Two…',shake3:'Three…'})[frame]||'Catching…';}

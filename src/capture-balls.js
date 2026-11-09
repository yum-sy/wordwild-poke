import {BALANCE} from './balance.js';
// Ball identity is shared by buttons, item icons and the thrown sprite.
export const CAPTURE_BALLS=Object.freeze({
 'poke-ball':{name:'Poké Ball'},
 'great-ball':{name:'Great Ball'},
 'ultra-ball':{name:'Ultra Ball'},
 'master-ball':{name:'Master Ball'},
});
export function ballInfo(id){return CAPTURE_BALLS[id]||CAPTURE_BALLS['poke-ball'];}
export function ballId(id){return Object.hasOwn(CAPTURE_BALLS,id)?id:'poke-ball';}

export function captureChance(game){
 if((game.goldenNets||0)>0)return 1;
 return Math.min(.95,(game.enemy.isBoss?BALANCE.captureBoss:BALANCE.captureNormal)+(game.captureBoost||0));
}
export function captureBallFor(game){
 const chance=captureChance(game);
 return chance===1?'master-ball':chance>=.8?'ultra-ball':chance>=.65?'great-ball':'poke-ball';
}
export function captureBallLabel(game){return `${ballInfo(captureBallFor(game)).name} · ${(captureChance(game)*100).toFixed(1).replace(/\.0$/,'')}%`;}

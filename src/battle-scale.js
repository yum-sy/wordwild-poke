import {speciesOf} from './monsters.js';
// Height is in metres. Compress enormous canon differences (e.g. snakes vs babies)
// into readable silhouettes, then fit BOTH combatants to the same safe arena box.
export function battleScales(player,enemy){
 const size=m=>Math.pow(speciesOf(m).heightM,0.45)*(m.isBoss?1.12:1);
 const p=size(player),e=size(enemy),fit=Math.max(1,p,e);
 return {player:Math.max(player.isBoss ? .7 : .42,p/fit),enemy:Math.max(enemy.isBoss ? .7 : .42,e/fit)};
}

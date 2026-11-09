// These thresholds are shared by the simulation and the visible goal meters.
export const shieldStat = m => m.maxShield*4+m.shieldFragments;
export function growthGoals(m){
 const b=m.evolutionBaseline;
 if(!b||m.isBoss||m.evolutionStage>=2)return [];
 return [
  {route:'hp',label:'Max HP',value:m.maxHp,target:b.hp*2},
  {route:'attack',label:'Attack',value:m.attack,target:b.attack*2},
  {route:'shield',label:'Shield pieces',value:shieldStat(m),target:Math.max(12,b.shieldStat*3)},
 ].map(g=>({...g,remaining:Math.max(0,g.target-g.value),ready:g.value>=g.target}));
}
export function addShield(m,fragments=0,whole=0){const total=m.shieldFragments+fragments,gain=Math.floor(total/4)+whole;m.shieldFragments=total%4;m.maxShield+=gain;m.currentShield+=gain;}
export function applyGrowthStat(m,effect,n){
 if(effect==='hp'){m.maxHp+=n;m.currentHp+=n;}
 if(effect==='attack')m.attack+=n;
 if(effect==='shards')addShield(m,n);
 if(effect==='shield')addShield(m,0,n);
}

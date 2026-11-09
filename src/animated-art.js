// GIF sources must be replaced, not merely CSS-paused, for reduced motion.
export function installAnimatedArt(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>{for(const img of root.querySelectorAll('img[data-animated]')){
  const target=document.hidden||reduced.matches?img.dataset.static:img.dataset.animated;
  if(img.getAttribute('src')!==target)img.src=target;
 }};
 root.addEventListener('error',e=>{const img=e.target;if(!img.matches?.('.pokemon-image'))return;
  if(img.getAttribute('src')!==img.dataset.static){delete img.dataset.animated;img.src=img.dataset.static;}
  else img.hidden=true;
 },true);
 document.addEventListener('visibilitychange',update);reduced.addEventListener('change',update);
 return update;
}

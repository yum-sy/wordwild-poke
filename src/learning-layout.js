// Let learning content keep its font size; give the arena the remaining height.
export function fitLearningLayout(root=document){
 const column=root.querySelector('.playing .play-column:not(.phase-layout)')||root.querySelector('.play-column:not(.phase-layout)');
 if(!column)return;
 if(!matchMedia('(orientation:portrait) and (max-width:760px)').matches){column.style.removeProperty('--learning-arena-height');return;}
 const panel=column.querySelector('.question-panel'),content=panel?.querySelector('.question-content');
 if(!content)return;
 const css=getComputedStyle(content),children=[...content.children];
 const needed=children.reduce((sum,e)=>{const s=getComputedStyle(e);return sum+e.getBoundingClientRect().height+parseFloat(s.marginTop||0)+parseFloat(s.marginBottom||0);},0)+Math.max(0,children.length-1)*parseFloat(css.rowGap||0)+parseFloat(css.paddingTop)+parseFloat(css.paddingBottom);
 const chrome=panel.getBoundingClientRect().height-content.getBoundingClientRect().height;
 const gap=parseFloat(getComputedStyle(column).rowGap)||0;
 const height=Math.floor(Math.max(65,Math.min(column.clientHeight*.55,column.clientHeight-needed-chrome-gap-4)));
 column.style.setProperty('--learning-arena-height',height+'px');
}

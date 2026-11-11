/* ---------- cover: agenda + hand ---------- */
const ag=$('#agenda');
PAGES.slice(1).forEach((p,k)=>{const i=k+1;const a=document.createElement('a');a.href=p.file;if(i===7)a.className='ai';a.innerHTML='<b>0'+i+'</b><span>'+p.name+(i===7?' · focus':'')+'</span>';ag.appendChild(a);});
drawHand($('#hand1'),$('#lmLabel1'));

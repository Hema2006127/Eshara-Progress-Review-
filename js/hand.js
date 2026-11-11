/* Shared MediaPipe hand drawing (cover and AI pages) */
/* ---------- hand ---------- */
const P=[[300,640],[220,580],[165,510],[130,450],[100,395],[240,400],[225,300],[215,235],[207,175],[300,385],[300,270],[300,195],[300,130],[358,400],[370,295],[378,228],[385,170],[410,430],[435,350],[450,298],[463,250]];
const NAMES=['WRIST','THUMB_CMC','THUMB_MCP','THUMB_IP','THUMB_TIP','INDEX_MCP','INDEX_PIP','INDEX_DIP','INDEX_TIP','MIDDLE_MCP','MIDDLE_PIP','MIDDLE_DIP','MIDDLE_TIP','RING_MCP','RING_PIP','RING_DIP','RING_TIP','PINKY_MCP','PINKY_PIP','PINKY_DIP','PINKY_TIP'];
const E=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
function drawHand(svg,label,onPick){
  el('circle',{cx:290,cy:400,r:285,fill:'var(--panel-2)'},svg);
  el('polygon',{points:[0,1,5,9,13,17].map(i=>P[i].join(',')).join(' '),fill:'var(--teal)','fill-opacity':.12},svg);
  E.forEach(([a,b])=>el('line',{x1:P[a][0],y1:P[a][1],x2:P[b][0],y2:P[b][1],stroke:'var(--teal)','stroke-width':5,'stroke-linecap':'round','stroke-opacity':.8},svg));
  const ds=P.map((p,i)=>{const tip=[4,8,12,16,20].includes(i);
    const c=el('circle',{cx:p[0],cy:p[1],r:tip?14:11,fill:tip?'var(--amber)':'var(--fg)',class:'lm',tabindex:0,role:'button','aria-label':'Landmark '+i+' '+NAMES[i]},svg);
    const pick=()=>{ds.forEach(d=>d.style.stroke='none');c.style.stroke='var(--teal)';c.setAttribute('stroke-width',6);label.textContent='#'+i+' · '+NAMES[i];if(onPick)onPick(i);};
    c.addEventListener('click',pick);c.addEventListener('mouseenter',pick);c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){pick();e.preventDefault();}});return c;});
}

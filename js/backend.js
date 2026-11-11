/* ---------- backend ---------- */
const ERD=[['schema-logical','Logical design','Main tables and how they relate; the user ↔ role link is shown as many-to-many'],['schema-physical','Physical design','Full implementation, including the Identity tables (AspNetUserRoles, claims, logins, tokens) and RefreshTokens']];
ERD.forEach((d,i)=>{const b=document.createElement('button');b.className='chip';b.textContent=d[1];b.onclick=()=>pickErd(i);$('#erdTabs').appendChild(b);});
function pickErd(i){const d=ERD[i];$('#erdShot').src='img/backend/'+d[0]+'.png';$('#erdShot').alt='Database schema · '+d[1].toLowerCase();$('#erdCap').textContent=d[1]+' · '+d[2];$$('#erdTabs .chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===i));}
pickErd(0);
$('#erdShot').onclick=()=>openImg($('#erdShot').src,$('#erdShot').alt);
const BEGAL=[['email-confirm','Email · confirm address after sign-up'],['email-reset','Email · password reset link']];
BEGAL.forEach(g=>{const f=document.createElement('figure');f.style.margin='0';f.innerHTML='<img class="shot" src="img/backend/'+g[0]+'.jpg" alt="'+g[1]+'" loading="lazy"><figcaption class="cap">'+g[1]+'</figcaption>';const im=f.querySelector('img');im.onclick=()=>openImg(im.src,im.alt);$('#beGal').appendChild(f);});

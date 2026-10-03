/* Mobile menu + data-driven Archive, Performances, and Piece pages. */
const btn=document.querySelector(".menu-btn"),nav=document.querySelector(".nav");
if(btn){btn.addEventListener("click",()=>{const o=nav.classList.toggle("open");btn.setAttribute("aria-expanded",o)})}

const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const missing=`this.outerHTML='<div class=&quot;missing&quot;>Placeholder: add this file to the media folder</div>'`;
const page=document.body.dataset.page;

if(page==="archive"){
  const el=document.getElementById("archive-grid");
  el.innerHTML=ARCHIVE.length?ARCHIVE.map(p=>{const cat=p.category||(p.type==="pdf"?"Writing":"Photography");
    return `<a class="tile" href="piece.html?id=${encodeURIComponent(p.id)}"><div class="tile-media">`+
    (p.type==="image"?`<img src="${esc(p.file)}" alt="${esc(p.title)} by ${esc(p.author)}" loading="lazy" onerror="${missing}">`
    :`<div class="text-tile"><h3>${esc(p.title)}</h3></div>`)+
    `<span class="chip">${esc(cat)}</span></div><div class="cap"><strong>${esc(p.title)}</strong><span>${esc(p.author)}</span></div></a>`}).join(""):
    `<p class="empty">Nothing here yet.</p>`;
}
if(page==="performances"){
  const el=document.getElementById("perf-grid");
  el.innerHTML=PERFORMANCES.length?PERFORMANCES.map(p=>`<figure class="tile">`+
    (p.type==="video"?`<video controls preload="metadata" src="${esc(p.file)}"></video>`
    :`<img src="${esc(p.file)}" alt="${esc(p.title)}" loading="lazy" onerror="${missing}">`)+
    `<figcaption class="cap"><strong>${esc(p.title)}</strong><span>${esc(p.caption)}</span></figcaption></figure>`).join(""):
    `<p class="empty">Nothing here yet.</p>`;
}
if(page==="piece"){
  const p=ARCHIVE.find(x=>x.id===new URLSearchParams(location.search).get("id")),el=document.getElementById("piece");
  if(!p){el.innerHTML=`<p class="empty">That piece could not be found. <a class="inline" href="archive.html">Return to the archive.</a></p>`}
  else{
    document.title=`${p.title} - Jericho Open Mic`;
    el.innerHTML=`<div class="piece-media">`+(p.type==="image"
      ?`<img src="${esc(p.file)}" alt="${esc(p.title)} by ${esc(p.author)}" onerror="${missing}">`
      :`<iframe src="${esc(p.file)}#view=FitH" title="${esc(p.title)} (PDF)"></iframe>`)+`</div>
      <div class="piece-text"><h1>${esc(p.title)}</h1><span class="label">${esc(p.author)}</span><p>${esc(p.caption)}</p>`+
      (p.type==="pdf"?`<p><a class="inline" href="${esc(p.file)}" target="_blank" rel="noopener">Open the PDF in a new tab</a></p>`:"")+`</div>`;
  }
}

/* Cursor-following light: eases --mx/--my (0-1) on the page and on each gallery panel. */
function glide(el,source,local){
  const t={x:.5,y:.5},c={x:+getComputedStyle(el).getPropertyValue("--mx")||.5,y:+getComputedStyle(el).getPropertyValue("--my")||.5};
  if(local){t.x=c.x;t.y=c.y}
  let raf=0;
  const step=()=>{raf=0;c.x+=(t.x-c.x)*.08;c.y+=(t.y-c.y)*.08;
    el.style.setProperty("--mx",c.x.toFixed(4));el.style.setProperty("--my",c.y.toFixed(4));
    if(Math.abs(t.x-c.x)+Math.abs(t.y-c.y)>.001)raf=requestAnimationFrame(step)};
  source.addEventListener("pointermove",e=>{
    const r=local?el.getBoundingClientRect():{left:0,top:0,width:innerWidth,height:innerHeight};
    t.x=(e.clientX-r.left)/r.width;t.y=(e.clientY-r.top)/r.height;if(!raf)raf=requestAnimationFrame(step)});
}
if(matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches){
  glide(document.documentElement,window,false);
  document.querySelectorAll(".panel").forEach(p=>glide(p,p,true));
}

/* Upcoming feed (home) and Calendar page */
const pad=n=>String(n).padStart(2,"0");
const fmt=ds=>{const[a,b,c]=ds.split("-");return new Date(a,b-1,c).toLocaleDateString("en-US",{month:"short",day:"numeric"})};
const evLine=e=>[e.time,e.place].filter(Boolean).join(" · ");
const now=new Date(),todayStr=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;

if(page==="home"){
  const up=EVENTS.filter(e=>e.date>=todayStr).sort((a,b)=>a.date.localeCompare(b.date));
  document.getElementById("feed-list").innerHTML=up.length?up.map(e=>`<li><a href="calendar.html"><span class="when">${fmt(e.date)}</span><span>${esc(e.title)}<small>${esc(evLine(e))}</small></span></a></li>`).join(""):
    `<li class="feed-empty">Nothing scheduled yet. Check back soon.</li>`;
}
if(page==="calendar"){
  const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
  let [y,m]=CAL.start;m--;
  const idx=(a,b)=>a*12+b,lo=idx(CAL.min[0],CAL.min[1]-1),hi=idx(CAL.max[0],CAL.max[1]-1);
  const $=id=>document.getElementById(id),body=$("cal-body"),list=$("cal-list"),prev=$("cal-prev"),next=$("cal-next");
  const draw=()=>{
    $("cal-label").textContent=`${MN[m]} ${y}`;
    const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),rows=Math.ceil((first+days)/7);let h="";
    for(let r=0;r<rows;r++){h+="<tr>";for(let c=0;c<7;c++){
      const d=r*7+c-first+1;if(d<1||d>days){h+='<td class="pad"></td>';continue}
      const ds=`${y}-${pad(m+1)}-${pad(d)}`;
      h+=`<td${ds===todayStr?' class="today"':""}><span class="day">${d}</span>`+EVENTS.filter(e=>e.date===ds).map(e=>`<span class="ev">${esc(e.title)}</span>`).join("")+"</td>"}h+="</tr>"}
    body.innerHTML=h;
    list.innerHTML=EVENTS.filter(e=>e.date.startsWith(`${y}-${pad(m+1)}-`)).sort((a,b)=>a.date.localeCompare(b.date))
      .map(e=>`<li><span class="when">${fmt(e.date)}</span><span>${esc(e.title)}<small>${esc(evLine(e))}</small></span></li>`).join("");
    prev.disabled=idx(y,m)<=lo;next.disabled=idx(y,m)>=hi;
  };
  prev.onclick=()=>{if(--m<0){m=11;y--}draw()};
  next.onclick=()=>{if(++m>11){m=0;y++}draw()};
  draw();
}

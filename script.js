/* Mobile menu + data-driven Archive, Performances, and Piece pages. */
const btn=document.querySelector(".menu-btn"),nav=document.querySelector(".nav");
if(btn){btn.addEventListener("click",()=>{const o=nav.classList.toggle("open");btn.setAttribute("aria-expanded",o)})}

const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const missing=`this.outerHTML='<div class=&quot;missing&quot;>Placeholder: add this file to the media folder</div>'`;
const page=document.body.dataset.page;

if(page==="archive"){
  const el=document.getElementById("archive-grid");
  el.innerHTML=ARCHIVE.length?ARCHIVE.map(p=>{const cat=p.category||(p.type==="pdf"?"Writing":"Photography");
    return `<a class="tile" href="piece.html?id=${encodeURIComponent(p.id)}"><div class="tile-media${p.type==="image"?"":" is-text"}">`+
    (p.type==="image"?`<img src="${esc(p.file)}" alt="${esc(p.title)} by ${esc(p.author)}" loading="lazy" onerror="${missing}">`
    :`<div class="text-tile"><h3>${esc(p.title)}</h3></div>`)+
    `<span class="chip">${esc(cat)}</span></div><div class="cap"><strong>${esc(p.title)}</strong><span>${esc(p.author)}</span>${p.school?`<span class="school">${esc(p.school)}</span>`:""}</div></a>`}).join(""):
    `<p class="empty">${esc(TEXT.archiveEmpty)}</p>`;
}
if(page==="performances"){
  const el=document.getElementById("perf-grid");
  el.innerHTML=PERFORMANCES.length?PERFORMANCES.map(p=>`<figure class="tile">`+
    (p.type==="video"?`<video controls preload="metadata" src="${esc(p.file)}"></video>`
    :`<img src="${esc(p.file)}" alt="${esc(p.title)}" loading="lazy" onerror="${missing}">`)+
    `<figcaption class="cap"><strong>${esc(p.title)}</strong><span>${esc(p.caption)}</span></figcaption></figure>`).join(""):
    `<p class="empty">${esc(TEXT.performancesEmpty)}</p>`;
}
if(page==="piece"){
  const p=ARCHIVE.find(x=>x.id===new URLSearchParams(location.search).get("id")),el=document.getElementById("piece");
  if(!p){el.innerHTML=`<p class="empty">That piece could not be found. <a class="inline" href="archive.html">Return to the archive.</a></p>`}
  else{
    document.title=`${p.title} - Jericho Open Mic`;
    el.innerHTML=`<div class="piece-media">`+(p.type==="image"
      ?`<img src="${esc(p.file)}" alt="${esc(p.title)} by ${esc(p.author)}" onerror="${missing}">`
      :`<iframe src="${esc(p.file)}#view=FitH" title="${esc(p.title)} (PDF)"></iframe>`)+`</div>
      <div class="piece-text"><h1>${esc(p.title)}</h1><span class="label">${esc(p.author)}</span>${p.school?`<span class="piece-school">${esc(p.school)}</span>`:""}<p>${esc(p.caption)}</p>`+
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
    `<li class="feed-empty">${esc(TEXT.feedEmpty)}</li>`;
}
if(page==="calendar"){
  const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
  let pop=null,lastBtn=null;
  const closePop=()=>{if(pop){pop.remove();pop=null;if(lastBtn)lastBtn.focus({preventScroll:true})}};
  const openPop=(ev,btn,e)=>{
    closePop();lastBtn=btn;
    const [a,b,c]=e.date.split("-"),meta=[e.time,e.place].filter(Boolean).join(" · ");
    pop=document.createElement("div");pop.className="pop";pop.setAttribute("role","dialog");pop.setAttribute("aria-label",e.title);
    pop.innerHTML=`<button class="pop-x" aria-label="Close">&times;</button><span class="label">${new Date(a,b-1,c).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span><h3>${esc(e.title)}</h3>`+
      (meta?`<p class="pop-meta">${esc(meta)}</p>`:"")+(e.notes?`<p>${esc(e.notes)}</p>`:"");
    document.body.appendChild(pop);
    let x=ev.clientX,y=ev.clientY;if(!x&&!y){const r=btn.getBoundingClientRect();x=r.left;y=r.bottom}
    pop.style.left=Math.max(8,Math.min(x,innerWidth-pop.offsetWidth-8))+"px";
    pop.style.top=Math.max(8,Math.min(y+10,innerHeight-pop.offsetHeight-8))+"px";
    pop.querySelector(".pop-x").focus({preventScroll:true});
    pop.querySelector(".pop-x").onclick=closePop;
  };
  document.addEventListener("click",ev=>{const b=ev.target.closest(".ev");
    if(b)openPop(ev,b,EVENTS[+b.dataset.i]);else if(pop&&!pop.contains(ev.target))closePop()});
  document.addEventListener("keydown",ev=>{if(ev.key==="Escape")closePop()});
  addEventListener("scroll",closePop,{passive:true});
  let [y,m]=CAL.start;m--;
  const idx=(a,b)=>a*12+b,lo=idx(CAL.min[0],CAL.min[1]-1),hi=idx(CAL.max[0],CAL.max[1]-1);
  const $=id=>document.getElementById(id),body=$("cal-body"),list=$("cal-list"),prev=$("cal-prev"),next=$("cal-next");
  const draw=()=>{
    closePop();
    $("cal-label").textContent=`${MN[m]} ${y}`;
    const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),rows=Math.ceil((first+days)/7);let h="";
    for(let r=0;r<rows;r++){h+="<tr>";for(let c=0;c<7;c++){
      const d=r*7+c-first+1;if(d<1||d>days){h+='<td class="pad"></td>';continue}
      const ds=`${y}-${pad(m+1)}-${pad(d)}`;
      h+=`<td${ds===todayStr?' class="today"':""}><span class="day">${d}</span>`+EVENTS.map((e,i)=>e.date===ds?`<button class="ev" data-i="${i}" aria-label="${esc(e.title+(e.time?", "+e.time:""))}"><span class="t">${esc(e.title+(e.time?" / "+e.time:""))}</span></button>`:"").join("")+"</td>"}h+="</tr>"}
    body.innerHTML=h;
    list.innerHTML=EVENTS.filter(e=>e.date.startsWith(`${y}-${pad(m+1)}-`)).sort((a,b)=>a.date.localeCompare(b.date))
      .map(e=>`<li><span class="when">${fmt(e.date)}</span><span>${esc(e.title)}<small>${esc(evLine(e))}</small></span></li>`).join("");
    prev.disabled=idx(y,m)<=lo;next.disabled=idx(y,m)>=hi;
  };
  prev.onclick=()=>{if(--m<0){m=11;y--}draw()};
  next.onclick=()=>{if(++m>11){m=0;y++}draw()};
  draw();
}

/* Home microphone: pause its morphing when motion is reduced or the art is hidden (mobile). */
if(matchMedia("(prefers-reduced-motion:reduce)").matches||matchMedia("(max-width:760px)").matches){
  const s=document.querySelector(".hero-art svg");if(s&&s.pauseAnimations)s.pauseAnimations();
}
/* Discord widget (home): rendered from Discord's public widget JSON */
if(page==="home"){
  const box=document.getElementById("discord-body");
  fetch("https://discord.com/api/guilds/1556804864024252466/widget.json?t="+Date.now(),{cache:"no-store"})
    .then(r=>{if(!r.ok)throw 0;return r.json()})
    .then(d=>{
      const all=d.members||[],people=all.filter(m=>!/carl/i.test(m.username)),ms=people.slice(0,25),online=Math.max(0,(+d.presence_count||0)-(all.length-people.length));
      box.innerHTML=`<p class="discord-count">${online} online now</p>`+
        (ms.length?`<ul class="discord-members">`+ms.map(m=>`<li><img src="${esc(m.avatar_url)}" alt="" loading="lazy"><span>${esc(m.username)}</span><span class="dot ${esc(m.status)}" title="${esc(m.status)}"></span></li>`).join("")+`</ul>`:"")+
        (d.instant_invite?`<a class="btn" href="${esc(d.instant_invite)}" target="_blank" rel="noopener">Join the server</a>`:"");
    })
    .catch(()=>{box.innerHTML=`<p class="discord-note">The community feed is unavailable right now.</p>`});
}

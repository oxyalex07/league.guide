'use strict';
// Home page and the filterable champion browser. Both render full-width (no sidebar).
const ROLES=['Mage','Fighter','Assassin','Tank','Support','Marksman'];
let champFilter={q:'',role:'All',kind:'All'};

function homeMode(){const h=location.hash;return h===''||h==='#/'||h==='#/home'?'home':h==='#/champions'?'grid':h==='#/matchups'?'mlist':h==='#/glossary'?'glossary':h==='#/dashboard'?'dashboard':null;}

function avatar(c){return `<span class="avatar" data-role="${esc(c.tags[0]||'Mage')}" aria-hidden="true">${esc(c.title[0])}</span>`;}

function championCard(c){
 return `<a class="champ-card" href="#/champion/${c.slug}">${avatar(c)}<span class="cc-body"><strong>${esc(c.title)}</strong><small>${esc(c.kind)}</small><span class="cc-tags">${c.tags.map(t=>`<em data-role="${esc(t)}">${esc(t)}</em>`).join('')}</span></span></a>`;
}

function stageStats(){
 return LEARNING_PATH.map((s,i)=>{
  const done=s.ids.filter(id=>progress[id]).length;
  const next=LESSONS.find(l=>l.id===(s.ids.find(id=>!progress[id])||s.ids[0]));
  return {s,i,done,total:s.ids.length,next};
 });
}

function homeHtml(){
 const done=pathIds.filter(id=>progress[id]).length;
 const next=LESSONS.find(a=>a.id===pathIds.find(id=>!progress[id]));
 const started=done>0;
 const cta=next?`<a class="btn primary" href="#/lesson/${next.slug}">${started?'Continue':'Start'}: ${esc(next.title)} →</a>`:`<a class="btn primary" href="#/path">Review the path →</a>`;
 const pct=Math.round(done/pathIds.length*100);
 const starters=['ahri','garen','lux','ashe','leona','jinx','darius','thresh'].map(s=>CHAMPIONS.find(c=>c.slug===s)).filter(Boolean);
 const roleChips=ROLES.map(r=>`<button type="button" class="chip" data-role="${r}" data-pick-role="${r}">${r} <span>${CHAMPIONS.filter(c=>c.tags.includes(r)).length}</span></button>`).join('');
 return `<div class="home">
 <section class="hero">
  <div class="hero-copy">
   <p class="eyebrow">Free · works offline · no account</p>
   <h1 tabindex="-1">Get better at League by practising decisions, not memorising builds.</h1>
   <p class="hero-lead">${LESSONS.length} short lessons in ${LEARNING_PATH.length} stages, ${CHAMPIONS.length} champion guides and replay exercises. Each one gives you one thing to try in your next game.</p>
   <div class="hero-actions">${cta}<a class="btn" href="#/champions">Browse champions</a></div>
   ${started?`<p class="hero-progress" role="status"><progress max="${pathIds.length}" value="${done}" aria-label="Lessons practised"></progress> ${done} of ${pathIds.length} lessons practised (${pct}%)</p>`:''}
  </div>
  <svg class="hero-art" viewBox="0 0 320 320" role="img" aria-label="Simplified map with three lanes and a rotation arrow"><rect x="4" y="4" width="312" height="312" rx="24" fill="var(--tint)" stroke="var(--line)"/><path d="M40 280 L40 40 L280 40 M40 280 L280 280 L280 40 M40 280 L280 40" fill="none" stroke="var(--line)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 280 L40 40 L280 40 M40 280 L280 280 L280 40 M40 280 L280 40" fill="none" stroke="var(--surface)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="262" r="14" fill="var(--blue)"/><circle cx="260" cy="58" r="14" fill="var(--foe)"/><rect class="hero-pulse" x="146" y="146" width="28" height="28" rx="6" fill="var(--foe)"/><circle class="hero-walk" cx="116" cy="204" r="11" fill="var(--blue)"/><path class="hero-dash" d="M60 100 C60 150 100 150 140 168" fill="none" stroke="var(--ink)" stroke-width="4" stroke-dasharray="8 7"/><path d="M130 158 L142 169 L127 173" fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="160" y="308" text-anchor="middle" font-size="13" fill="var(--muted)" font-family="system-ui,sans-serif">Where should you be, and why?</text></svg>
 </section>

 <section class="how" aria-labelledby="how-h">
  <h2 id="how-h">How it works</h2>
  <ol class="steps">
   <li><b>1</b><div><h3>Read one lesson</h3><p>Two to five minutes. A short answer first, then the reasoning.</p></div></li>
   <li><b>2</b><div><h3>Try one thing</h3><p>Each lesson ends with an observable action for your next game.</p></div></li>
   <li><b>3</b><div><h3>Review your replay</h3><p>Judge decisions using what you could see at the time, not the final score.</p></div></li>
  </ol>
 </section>

 <section aria-labelledby="path-h">
  <div class="sec-head"><div><p class="eyebrow">Learning path</p><h2 id="path-h">${LEARNING_PATH.length} stages, in order</h2></div><a href="#/path">Path overview &amp; checkpoints →</a></div>
  <div class="stage-grid">${stageStats().map(({s,i,done:d,total,next:n})=>`<a class="stage-card" href="#/lesson/${n.slug}"><span class="sc-num">${i+1}</span><strong>${esc(s.title)}</strong><span class="sc-goal">${esc(s.goal)}</span><span class="sc-meta">${d} of ${total} practised</span><span class="sc-bar" style="--p:${Math.round(d/total*100)}%"></span></a>`).join('')}</div>
 </section>

 <section aria-labelledby="role-h">
  <div class="sec-head"><div><p class="eyebrow">Roles</p><h2 id="role-h">A cheat sheet for every role</h2></div><a href="#/roles">Compare all roles →</a></div>
  <p class="sec-lead">Everything one position asks of you, on one page: your jobs, each phase of the game, what to track and how to practise.</p>
  <div class="role-grid">${ROLE_GUIDES.map(roleCard).join('')}</div>
 </section>

 <section aria-labelledby="champ-h">
  <div class="sec-head"><div><p class="eyebrow">Champions</p><h2 id="champ-h">Learn through a champion you play</h2></div><a href="#/champions">All ${CHAMPIONS.length} champions →</a></div>
  <p class="sec-lead">Every guide covers playstyle, strengths, weaknesses, a teamfight plan and a replay exercise. Pick a role to filter the list.</p>
  <div class="chips" role="group" aria-label="Browse by role">${roleChips}</div>
  <div class="champ-grid compact home-champs">${starters.map(championCard).join('')}</div>
 </section>

 <section class="dash-teaser" aria-labelledby="dt-h"><div><p class="eyebrow">Your dashboard</p><h2 id="dt-h">Track your games and see what to practise</h2><p class="sec-lead">Log CS at 10, deaths and vision after each game, rate your skills, and get lesson suggestions based on your own goals. Stored only in this browser.</p></div><a class="btn primary" href="#/dashboard">Open my dashboard →</a></section>

 <section aria-labelledby="mu-h">
  <div class="sec-head"><div><p class="eyebrow">Matchups</p><h2 id="mu-h">Study both sides of a lane</h2></div><a href="#/matchups">All matchups →</a></div>
  <div class="mu-grid">${MATCHUPS.map(m=>`<a class="mu-card" href="#/matchup/${m.slug}"><strong>${esc(m.title)}</strong><small>${esc(m.kind)}</small><span>${esc(m.summary)}</span></a>`).join('')}</div>
 </section>

 <footer class="site-foot"><p>Guidance is editorial interpretation of champion kits, not Riot recommendations or win-rate predictions. Ability names come from Riot Data Dragon ${esc(CHAMPIONS[0].version)}. League of Legends is a trademark of Riot Games; this site is not affiliated with Riot Games.</p></footer>
</div>`;
}

function gridItems(){
 return CHAMPIONS.filter(c=>(champFilter.role==='All'||c.tags.includes(champFilter.role))&&(champFilter.kind==='All'||c.kind===champFilter.kind)&&matchesGuide(c,champFilter.q));
}

function gridHtml(){
 const kinds=[...new Set(CHAMPIONS.map(c=>c.kind))].sort();
 return `<div class="home grid-page">
 <div class="page-head"><p class="eyebrow">Champions / ${CHAMPIONS.length} guides</p><h1 tabindex="-1">Champion guides</h1><p class="hero-lead">Find a champion by name, role or teamfight style, then work through a plan you can rehearse in practice mode.</p></div>
 <div class="filter-bar">
  <div class="field"><label for="cg-q">Search</label><input id="cg-q" type="search" placeholder="Find a champion" autocomplete="off" value="${esc(champFilter.q)}"></div>
  <div class="field"><label for="cg-kind">Teamfight style</label><select id="cg-kind"><option value="All">All styles</option>${kinds.map(k=>`<option ${k===champFilter.kind?'selected':''}>${esc(k)}</option>`).join('')}</select></div>
 </div>
 <div class="chips" role="group" aria-label="Filter by role">${['All',...ROLES].map(r=>`<button type="button" class="chip" data-role="${r}" data-filter-role="${r}" aria-pressed="${r===champFilter.role}">${r}</button>`).join('')}</div>
 <p id="cg-count" class="grid-count" role="status" aria-live="polite"></p>
 <div id="cg-grid" class="champ-grid"></div>
 <div id="cg-empty" class="grid-empty" hidden><p>No champions match. Try fewer filters.</p><button type="button" class="btn" id="cg-clear">Clear filters</button></div>
</div>`;
}

function paintGrid(){
 const items=gridItems();
 $('#cg-grid').innerHTML=items.map(championCard).join('');
 $('#cg-count').textContent=items.length+' of '+CHAMPIONS.length+' champions';
 $('#cg-empty').hidden=items.length>0;
 document.querySelectorAll('[data-filter-role]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filterRole===champFilter.role));
}

function renderHome(state,initial){
 const mode=homeMode();if(!mode)return false;
 if(mode==='dashboard'){renderDash();}else $('#content').innerHTML=mode==='home'?homeHtml():mode==='grid'?gridHtml():mode==='glossary'?glossaryHtml():matchupsHtml();
 document.body.dataset.view=mode==='home'?'home':'grid';
 document.title=mode==='home'?'League.guide — Learn League of Legends by practising decisions':mode==='grid'?'Champion guides — League.guide':mode==='glossary'?'Glossary — League.guide':mode==='dashboard'?'My dashboard — League.guide':'Matchup studies — League.guide';
 const navKey={grid:'champions',mlist:'matchups',glossary:'glossary',dashboard:'dashboard'}[mode];document.querySelectorAll('[data-index]').forEach(a=>{if(a.dataset.index===navKey)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(mode==='grid'){
  paintGrid();
  $('#cg-q').oninput=e=>{champFilter.q=e.target.value;paintGrid();};
  $('#cg-kind').onchange=e=>{champFilter.kind=e.target.value;paintGrid();};
  $('#cg-clear').onclick=()=>{champFilter={q:'',role:'All',kind:'All'};$('#cg-q').value='';$('#cg-kind').value='All';paintGrid();$('#cg-q').focus();};
 }
 window.scrollTo(0,0);
 if(!initial)$('#content h1').focus({preventScroll:true});
 const cur=document.querySelector('.topnav [aria-current]');if(cur)cur.scrollIntoView({block:'nearest',inline:'nearest'});
 return true;
}

document.addEventListener('click',e=>{
 const pick=e.target.closest('[data-pick-role]');
 if(pick){champFilter={q:'',role:pick.dataset.pickRole,kind:'All'};go('#/champions');return;}
 const f=e.target.closest('[data-filter-role]');
 if(f){champFilter.role=f.dataset.filterRole;paintGrid();}
});

function matchupCard(m){const cs=m.champions.map(s=>CHAMPIONS.find(c=>c.slug===s));return `<a class="mu-card" href="#/matchup/${m.slug}"><span class="mu-avatars">${cs.map(avatar).join('<b aria-hidden="true">vs</b>')}</span><strong>${esc(m.title)}</strong><small>${esc(m.kind)}</small><span>${esc(m.summary)}</span></a>`;}
function matchupsHtml(){return `<div class="home grid-page"><div class="page-head"><p class="eyebrow">Matchups / starter collection</p><h1 tabindex="-1">Matchup studies</h1><p class="hero-lead">Each study covers both sides of a lane: what to watch, how each player should think, and a paused scenario to decide on.</p></div><div class="mu-grid">${MATCHUPS.map(matchupCard).join('')}</div><p class="sec-lead" style="margin-top:32px">More matchups are planned. For any champion not listed, use its champion guide's "Build a personal matchup plan" section.</p></div>`;}

/* ---------- Global search (⌘K, Ctrl+K or "/") ---------- */
let searchIndex=null;
function buildIndex(){return [
 ...LESSONS.map(a=>({type:'Lesson',title:a.title,sub:a.summary,href:'#/lesson/'+a.slug,key:searchKey(a.title+' '+a.aliases.join(' ')),body:searchKey(a.summary+' '+a.category)})),
 ...CHAMPIONS.map(c=>({type:'Champion',title:c.title,sub:c.kind+' · '+c.tags.join(', '),href:'#/champion/'+c.slug,key:searchKey(c.title),body:searchKey(c.kind+' '+c.tags.join(' ')+' '+c.abilities.map(a=>a.name).join(' ')),c})),
 ...GLOSSARY.map(([t,d,l])=>({type:'Term',title:t,sub:d,href:'#/lesson/'+l,key:searchKey(t),body:searchKey(d)})),
 ...ROLE_GUIDES.map(r=>({type:'Role',title:r.title,sub:r.summary,href:'#/role/'+r.slug,key:searchKey(r.role+' '+r.title+(r.slug==='bot'?' adc marksman':'')),body:searchKey(r.summary+' '+r.where+' '+r.winBy)})),
 {type:'Page',title:'My dashboard',sub:'Log games, set goals, rate skills',href:'#/dashboard',key:searchKey('dashboard stats profile'),body:searchKey('cs deaths vision goals log games')},
 ...MATCHUPS.map(m=>({type:'Matchup',title:m.title,sub:m.summary,href:'#/matchup/'+m.slug,key:searchKey(m.title),body:searchKey(m.summary)}))];}
function searchAll(q){
 searchIndex=searchIndex||buildIndex();
 const words=q.trim().split(/\s+/).map(searchKey).filter(Boolean);
 if(!words.length)return [];
 return searchIndex.map(r=>{let score=0;for(const w of words){if(r.key.startsWith(w))score+=10;else if(r.key.includes(w))score+=6;else if(r.body.includes(w))score+=2;else return null;}return {r,score};})
  .filter(Boolean).sort((a,b)=>b.score-a.score||a.r.title.localeCompare(b.r.title)).slice(0,12).map(x=>x.r);
}
function openSearch(){
 const dlg=$('#gsearch');if(dlg.open)return;
 dlg.showModal();const inp=$('#gs-input');inp.value='';paintSearch();inp.focus();
}
let gsActive=0;
function paintSearch(){
 const q=$('#gs-input').value,res=searchAll(q);gsActive=0;
 $('#gs-results').innerHTML=res.length?res.map((r,i)=>`<li role="option" id="gs-${i}" aria-selected="${i===0}"><a href="${r.href}">${r.c?avatar(r.c):`<span class="gs-type" aria-hidden="true">${r.type[0]}</span>`}<span><strong>${esc(r.title)}</strong><small>${r.type} · ${esc(r.sub)}</small></span></a></li>`).join(''):`<li class="gs-empty">${q.trim()?'No matches. Try a champion, an ability name or a skill like “wave”.':'Search lessons, champions, abilities and matchups.'}</li>`;
 $('#gs-input').setAttribute('aria-activedescendant',res.length?'gs-0':'');
}
function moveSearch(d){
 const items=[...document.querySelectorAll('#gs-results [role=option]')];if(!items.length)return;
 gsActive=(gsActive+d+items.length)%items.length;
 items.forEach((li,i)=>li.setAttribute('aria-selected',i===gsActive));
 items[gsActive].scrollIntoView({block:'nearest'});$('#gs-input').setAttribute('aria-activedescendant','gs-'+gsActive);
}
document.addEventListener('DOMContentLoaded',()=>{
 document.body.insertAdjacentHTML('beforeend',`<dialog id="gsearch" aria-label="Search the guide"><div class="gs-box"><div class="gs-head"><input id="gs-input" type="search" role="combobox" aria-expanded="true" aria-controls="gs-results" aria-autocomplete="list" placeholder="Search lessons, champions, abilities…" autocomplete="off"><button type="button" class="gs-close" aria-label="Close search">Esc</button></div><ul id="gs-results" role="listbox" aria-label="Results"></ul></div></dialog>`);
 $('#theme-toggle').insertAdjacentHTML('beforebegin',`<button type="button" class="search-trigger" id="search-trigger" aria-label="Search (press / or Ctrl+K)"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 11l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Search</span><kbd>/</kbd></button>`);
 $('#search-trigger').onclick=openSearch;
 $('#gs-input').oninput=paintSearch;
 $('.gs-close').onclick=()=>$('#gsearch').close();
 $('#gsearch').addEventListener('click',e=>{if(e.target.id==='gsearch')e.target.close();if(e.target.closest('#gs-results a'))$('#gsearch').close();});
 $('#gs-input').addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();moveSearch(1);}
  else if(e.key==='ArrowUp'){e.preventDefault();moveSearch(-1);}
  else if(e.key==='Enter'){const a=document.querySelector(`#gs-${gsActive} a`);if(a){e.preventDefault();$('#gsearch').close();go(a.getAttribute('href'));}}
 });
});
document.addEventListener('keydown',e=>{
 const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
 if((e.key==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!typing)){e.preventDefault();openSearch();}
});

/* Reading progress for long pages that scroll inside the reader pane. */
document.addEventListener('DOMContentLoaded',()=>{
 const bar=document.createElement('div');bar.className='read-progress';bar.setAttribute('aria-hidden','true');$('.reader').prepend(bar);
 const r=$('.reader');const upd=()=>{const max=r.scrollHeight-r.clientHeight;bar.style.setProperty('--p',max>0?(r.scrollTop/max*100)+'%':'0%');};
 r.addEventListener('scroll',upd,{passive:true});new MutationObserver(upd).observe($('#content'),{childList:true});
});

/* ---------- Glossary ---------- */
const GLOSSARY=[
['Aggro','Being targeted by minions or a turret, usually because you damaged an enemy champion near them.','minion-aggro'],
['All-in','A fight where you commit everything to try for a kill.','all-ins'],
['Bounce','A wave that crashes into a turret, then pushes back the other way.','wave-bouncing'],
['Cannon wave','A wave that includes a cannon (siege) minion; worth more gold and harder to clear.','wave-management'],
['Collapse','Several players converging on one enemy or area at once.','collapsing'],
['Cooldown','The wait before an ability or summoner spell can be used again.','cooldown-tracking'],
['Counter-gank','Arriving to punish an enemy gank as it happens.','counterganking'],
['Counter-jungling','Taking the enemy jungler\'s camps to slow them down.','counterjungling'],
['Crash','Pushing your wave into the enemy turret.','wave-crashing'],
['CS (creep score)','The number of minions and monsters you have killed; a main source of gold.','last-hitting'],
['Death timer','How long a dead champion waits to respawn; grows longer later in the game.','timers'],
['Dive','Attacking an enemy under their own turret.','diving'],
['Draft','The pick and ban phase before a game, and the team compositions it creates.','drafting'],
['Engage','Starting a fight, usually with crowd control or a gap closer.','engaging'],
['Face-check','Walking into an unwarded area without knowing what is there.','warding'],
['Flank','Approaching a fight from the side or behind rather than the front.','flanking'],
['Freeze','Holding the wave in one spot, usually near your turret, by only last-hitting.','freezing'],
['Gank','A surprise attack on a lane, usually by the jungler.','ganking'],
['Invade','Entering the enemy jungle to take camps or fight.','invading'],
['Kiting','Attacking while moving to keep distance from an enemy.','kiting'],
['Last-hit','Dealing the killing blow to a minion to earn its gold.','last-hitting'],
['Leash','Helping your jungler with their first camp at the start of the game.','jungle-pathing'],
['Macro','Map-wide decisions: waves, objectives, rotations and timing.','win-conditions'],
['Micro','Mechanical, moment-to-moment play: trading, dodging, combos.','trading'],
['Peel','Protecting a teammate from enemies who are attacking them.','peeling'],
['Pick','Catching and killing an enemy who is alone or out of position.','picks'],
['Poke','Dealing damage from range without fully committing.','poking'],
['Power spike','A moment, such as a level or item, when a champion becomes much stronger.','power-spikes'],
['Priority (prio)','Having your wave pushed so you can move first to help elsewhere.','lane-priority'],
['Proxy farming','Farming minions behind the enemy\'s turret line; an advanced split-push tactic.','split-pushing'],
['Reset','Recalling to heal and buy items, ideally at a good moment.','resets'],
['Roam','Leaving your lane to help another lane or area.','roaming'],
['Rotation','Moving players between lanes or areas to apply pressure.','rotations'],
['Siege','Pressuring a turret over time with waves and range.','sieging'],
['Slow push','Building a larger wave by killing only part of the enemy wave.','slow-pushing'],
['Snowball','Turning an early lead into a bigger one.','tempo'],
['Split push','Pushing a side lane alone to draw enemies away from your team.','split-pushing'],
['Stack','A large group of minions that has built up from several waves.','slow-pushing'],
['Tempo','Doing useful things faster than the enemy, so they are always reacting.','tempo'],
['Tilt','Frustration that worsens your decisions.','mental-game'],
['Trade','A limited exchange of damage between champions.','trading'],
['Vision control','Placing wards and removing enemy wards to control information.','vision-denial'],
['Wave management','Deciding where and how fast minion waves move.','wave-management'],
['Weak side','The side of the map your team is investing less in.','weak-side'],
['Win condition','The realistic way your team wins this game.','win-conditions'],
['Zoning','Using threat to keep an enemy away from an area or minions.','zoning']];
function glossaryHtml(){
 const letters=[...new Set(GLOSSARY.map(g=>g[0][0].toUpperCase()))];
 return `<div class="home grid-page"><div class="page-head"><p class="eyebrow">Reference / ${GLOSSARY.length} terms</p><h1 tabindex="-1">Glossary</h1><p class="hero-lead">The words players use in lobbies, guides and videos, each linked to the lesson that explains it.</p></div><nav class="az" aria-label="Jump to letter">${letters.map(l=>`<button type="button" data-az="${l}">${l}</button>`).join('')}</nav><dl class="glossary">${GLOSSARY.map(([t,d,l])=>{const les=LESSONS.find(x=>x.slug===l);return `<div class="g-item" data-letter="${t[0].toUpperCase()}"><dt>${esc(t)}</dt><dd>${esc(d)}${les?` <a href="#/lesson/${l}">${esc(les.title)} →</a>`:''}</dd></div>`;}).join('')}</dl></div>`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-az]');if(!b)return;const t=document.querySelector(`.g-item[data-letter="${b.dataset.az}"]`);if(t)t.scrollIntoView({behavior:REDUCED()?'auto':'smooth',block:'start'});});

/* ---------- "On this page" rail for lessons, with scroll tracking ---------- */
let tocObserver=null;
function buildToc(){
 const toc=document.querySelector('.toc');if(!toc||toc.dataset.ready)return;toc.dataset.ready='1';
 const heads=[...document.querySelectorAll('.lesson > section > h2')].filter(h=>!/^(Related lessons|Sources and limits)$/.test(h.textContent));
 heads.forEach((h,i)=>{h.id=h.id||'s-'+i;});
 toc.innerHTML=`<p class="toc-title">On this page</p><ol>${heads.map(h=>`<li><button type="button" data-toc="${h.id}">${esc(h.textContent)}</button></li>`).join('')}</ol>`;
 if(tocObserver)tocObserver.disconnect();
 tocObserver=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){toc.querySelectorAll('button').forEach(b=>b.toggleAttribute('aria-current',b.dataset.toc===e.target.id));}});},{root:document.querySelector('.reader'),rootMargin:'0px 0px -70% 0px'});
 heads.forEach(h=>tocObserver.observe(h));
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-toc]');if(!b)return;const t=document.getElementById(b.dataset.toc);if(t)t.scrollIntoView({behavior:REDUCED()?'auto':'smooth',block:'start'});});
document.addEventListener('DOMContentLoaded',()=>{buildToc();new MutationObserver(buildToc).observe(document.querySelector('#content'),{childList:true});});

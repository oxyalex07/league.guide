'use strict';
// Role cheat sheets. ROLE_GUIDES comes from roles.js built out of content/roles/*.md.
// Overview (#/roles) renders full width; each guide (#/role/<slug>) uses the reading pane like a lesson.

function roleMode(){const h=location.hash;if(h==='#/roles')return 'list';return h.startsWith('#/role/')?'guide':null;}

/* Small map with the role's area highlighted. Blue base bottom left, red base top right. */
function roleMap(slug,cls=''){
 const lanes='M14 86 L14 14 L86 14 M14 86 L86 86 L86 14 M14 86 L86 14';
 const hi={
  top:'<path class="rm-hi" d="M14 70 L14 14 L70 14"/><circle class="rm-obj" cx="34" cy="34" r="4.5"/>',
  jungle:'<path class="rm-zone" d="M22 30 L22 72 L48 50 Z M30 78 L72 78 L50 52 Z M78 70 L78 28 L52 50 Z M70 22 L28 22 L50 48 Z"/><path class="rm-hi rm-dash" d="M30 64 C30 44 40 40 52 30 S 70 40 70 56"/>',
  mid:'<path class="rm-hi" d="M28 72 L72 28"/><path class="rm-hi rm-dash thin" d="M50 50 L32 32 M50 50 L68 68"/>',
  bot:'<path class="rm-hi" d="M30 86 L86 86 L86 30"/><circle class="rm-obj" cx="66" cy="66" r="4.5"/>',
  support:'<path class="rm-hi" d="M34 86 L86 86 L86 50"/><path class="rm-hi rm-dash thin" d="M62 80 C58 66 56 58 50 50"/><circle class="rm-ward" cx="66" cy="66" r="3"/><circle class="rm-ward" cx="44" cy="58" r="3"/>'
 }[slug]||'';
 return `<svg class="role-map ${cls}" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="14" class="rm-bg"/><path d="M14 14 L86 86" class="rm-river"/><path d="${lanes}" class="rm-lane"/>${hi}<circle cx="18" cy="82" r="6" class="rm-ally"/><circle cx="82" cy="18" r="6" class="rm-foe"/></svg>`;
}

function myRole(){try{const d=JSON.parse(localStorage.getItem('league-guide-dashboard-v1')||'{}');return (d.profile&&d.profile.role||'').toLowerCase();}catch(_){return '';}}

function roleLessonStats(r){const done=r.lessons.filter(id=>progress[id]).length;return {done,total:r.lessons.length};}

function roleCard(r){
 const {done,total}=roleLessonStats(r),mine=myRole()===r.slug;
 return `<a class="role-card ${mine?'mine':''}" href="#/role/${r.slug}">${roleMap(r.slug)}<span class="rc-body"><span class="rc-top"><strong>${esc(r.role)}</strong>${mine?'<em class="rc-mine">Your role</em>':''}</span><span class="rc-sum">${esc(r.summary)}</span><span class="rc-meta">${r.minutes} min read · ${done} of ${total} key lessons practised</span></span></a>`;
}

function rolesHtml(){
 return `<div class="home grid-page roles-page">
 <div class="page-head"><p class="eyebrow">Roles / ${ROLE_GUIDES.length} cheat sheets</p><h1 tabindex="-1">Role cheat sheets</h1><p class="hero-lead">One article per position with everything that role asks of you: your jobs, each phase of the game, teamfights, what to track, common mistakes and a practice plan.</p></div>
 <div class="role-grid">${ROLE_GUIDES.map(roleCard).join('')}</div>
 <section class="card role-compare" aria-labelledby="rcmp-h"><div class="card-head"><h2 id="rcmp-h">Roles at a glance</h2><span class="card-sub">Not sure which to play? Compare what each one asks of you.</span></div>
  <div class="table-scroll"><table class="games"><thead><tr><th scope="col">Role</th><th scope="col">Where you play</th><th scope="col">You win by</th></tr></thead><tbody>${ROLE_GUIDES.map(r=>`<tr><th scope="row"><a href="#/role/${r.slug}">${esc(r.role)}</a></th><td>${esc(r.where)}</td><td>${esc(r.winBy)}</td></tr>`).join('')}</tbody></table></div>
 </section>
 <p class="sec-lead" style="margin-top:24px">Every cheat sheet links to the lessons behind it. Set your main role on the <a href="#/dashboard">dashboard</a> and it will be marked here.</p>
</div>`;
}

function roleGuideHtml(r){
 const i=ROLE_GUIDES.indexOf(r),prev=ROLE_GUIDES[i-1],next=ROLE_GUIDES[i+1];
 const {done,total}=roleLessonStats(r);
 const champs=r.champions.map(s=>CHAMPIONS.find(c=>c.slug===s)).filter(Boolean);
 const lessons=r.lessons.map(id=>LESSONS.find(l=>l.id===id)).filter(Boolean);
 return `<div class="lesson-layout"><article class="article lesson role-guide">
 <div class="lesson-context"><a href="#/roles" class="stage-pill">Role cheat sheets</a><span>Role ${i+1} of ${ROLE_GUIDES.length}</span><span>${r.minutes} min read</span>${myRole()===r.slug?'<span class="done-pill">Your role</span>':''}</div>
 <nav class="role-tabs" aria-label="Choose a role">${ROLE_GUIDES.map(x=>`<a href="#/role/${x.slug}" ${x===r?'aria-current="page"':''}>${esc(x.role)}</a>`).join('')}</nav>
 <h1 tabindex="-1">${esc(r.title)}</h1>
 <p class="lead">${esc(r.summary)}</p>
 <div class="role-glance">${roleMap(r.slug,'big')}<dl class="lm-facts"><div><dt>Where you play</dt><dd>${esc(r.where)}</dd></div><div><dt>You win by</dt><dd>${esc(r.winBy)}</dd></div><div><dt>Key lessons practised</dt><dd>${done} of ${total}</dd></div></dl></div>
 ${r.html}
 <section class="role-keys"><h2>Key lessons for ${esc(r.role.toLowerCase())}</h2><p>The lessons this role relies on most. Practise them in roughly this order.</p><ol class="role-lessons">${lessons.map((l,k)=>`<li class="${progress[l.id]?'done':''}"><a href="#/lesson/${l.slug}"><span class="rl-n" aria-hidden="true">${progress[l.id]?'✓':k+1}</span><span><strong>${esc(l.title)}</strong><small>${l.minutes} min${progress[l.id]?' · practised':''}</small></span></a></li>`).join('')}</ol></section>
 ${champs.length?`<section class="role-champs"><h2>Champions to start with</h2><p>Forgiving picks that let you focus on the role's decisions rather than difficult mechanics.</p><div class="champ-grid compact">${champs.map(championCard).join('')}</div></section>`:''}
 <nav class="pager next" aria-label="Role navigation">${prev?`<a href="#/role/${prev.slug}"><small>← Previous role</small><strong>${esc(prev.title)}</strong></a>`:'<a href="#/roles"><small>← Overview</small><strong>All roles</strong></a>'}${next?`<a href="#/role/${next.slug}"><small>Next role →</small><strong>${esc(next.title)}</strong></a>`:'<a href="#/roles"><small>Overview →</small><strong>All roles</strong></a>'}</nav>
 </article><aside class="toc" aria-label="On this page"></aside></div>`;
}

function renderRoles(state,initial){
 const mode=roleMode();if(!mode)return false;
 if(mode==='list'){
  $('#content').innerHTML=rolesHtml();document.body.dataset.view='grid';document.title='Role cheat sheets — League.guide';window.scrollTo(0,0);
 }else{
  const r=ROLE_GUIDES.find(x=>'#/role/'+x.slug===location.hash);
  $('#content').innerHTML=r?roleGuideHtml(r):'<article class="article"><h1 tabindex="-1">Role not found.</h1><p>This link does not match a role cheat sheet.</p><a href="#/roles">See all roles →</a></article>';
  document.body.dataset.view='article';document.title=(r?r.title:'Role not found')+' — League.guide';
  list();$('#return').textContent='← All roles';$('.status').textContent='Role cheat sheet';
  $('.reader').scrollTop=state?.rs||0;
 }
 document.querySelectorAll('[data-index]').forEach(a=>{if(a.dataset.index==='roles')a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(!initial)$('#content h1').focus({preventScroll:true});
 const cur=document.querySelector('.topnav [aria-current]');if(cur)cur.scrollIntoView({block:'nearest',inline:'nearest'});
 return true;
}

"""Build a source-checked champion library from explicit editorial records. No network."""
from pathlib import Path
import json, re, html
from champion_diagrams import special_diagram
from champion_depth import extended_sections, DEPTH, COMMON
ROOT=Path(__file__).resolve().parent
DATA=ROOT/'content/champions'
# These teaching patterns supplement each champion's individually written decisions.
PATTERNS={
'engage':dict(label='Initiation and disruption',before='Choose the target and the ally who will follow. Check that this ally is in range, has relevant abilities and is not occupied by a different threat.',during='After the first control effect, look back at your damage dealers. Chain control on the original target only while the team can use it; otherwise turn toward the enemy reaching your carry.',behind='Use control to punish an enemy crossing into your team. A defensive catch can be more useful than a long engage that your weaker team cannot finish.',after='Once the target falls or escapes, stop moving forward until you know where the surviving enemies are. Help the team take safe space rather than beginning a second unsupported dive.',diagram='Start beside allied follow-up. The arrow shows a possible entry toward a reachable enemy, not an instruction to dive every time.',lessons=['engaging','peeling','positioning']),
'protect':dict(label='Protection and counter-engage',before='Identify which ally is most able to keep dealing damage and which enemy can reach them. Position within support range without standing in the same exposed line.',during='Use your response when the threatening action begins, then move with the protected ally. Watch for a second attacker instead of spending every tool on the first one.',behind='Protect the ally with a real escape route. Use control and shields to leave bad ground together; saving one teammate does not require walking into an unwinnable follow-up.',after='Stay with the allies who remain vulnerable. Check health and available defensive spells before escorting them through an unwarded route.',diagram='Stay near the allied damage source. The arrow points toward the enemy approach you may need to interrupt; it is not a chase route.',lessons=['peeling','positioning','cooldown-tracking']),
'bruiser':dict(label='Sustained melee pressure',before='Name a reachable first target and the enemy spell that could stop your contact. Approach beside allied pressure or through cover rather than absorbing the entire enemy opening alone.',during='Keep contact only while your damage, defensive window and allied support overlap. Between spell cycles, move toward your team if the target leaves useful range.',behind='Take shorter contact windows and help stop a diver. Your control and body position can still help even when you cannot survive an extended duel.',after='Recheck health, resources and the next defensive cooldown. Winning the first exchange does not mean you can safely chase across the next screen.',diagram='Work beside the frontline and keep a route back to allies. The arrow shows contact with a reachable opponent, not a mandatory backline dive.',lessons=['trading','target-selection','cooldown-tracking']),
'duelist':dict(label='Dueling and selective entry',before='Compare side-lane pressure with joining the team. If grouping, identify which enemy control must be used before you can safely maintain close contact.',during='Fight a reachable target and preserve the movement or defense needed for the response. Shift deeper only after your team creates a clear advantage.',behind='Avoid an isolated duel that the enemy can easily win. Catch safe resources and group for defensive control or a coordinated finish when side pressure is no longer safe.',after='Choose between regrouping and a safe side-lane objective. Account for missing enemies before converting a skirmish win into a solo chase.',diagram='Use an edge of the fight while allies occupy the front. The arrow is a conditional entry after enemy control is spent, not permission to split from the team.',lessons=['split-pushing','flanking','target-selection']),
'assassin':dict(label='Picks and flank timing',before='Find the enemy protection spell that prevents your kill and a route back after the attempt. Approach through checked cover; being unseen is useful only if the landing is safe.',during='Enter when allied pressure divides attention or a key response is unavailable. After the first damage sequence, leave or change angle rather than remaining exposed while waiting for cooldowns.',behind='Help finish targets already damaged by allies and threaten an edge without forcing entry. Avoid spending the whole fight waiting for a solo kill that your damage cannot secure.',after='Use the numbers advantage to return to your team and a nearby objective. A second distant target is lower priority if the enemy can collapse on your exit.',diagram='Threaten the side while allies occupy attention. The arrow is a conditional flank; confirm the target, enemy defenses and exit before following it.',lessons=['flanking','cooldown-tracking','target-selection']),
'marksman':dict(label='Protected sustained damage',before='Identify the nearest safe attack position and the enemy who can reach it. Keep an ally or controlled route between you and that threat.',during='Attack the nearest target you can damage without entering lethal range. Move between attacks or casts, and shift forward only after the relevant enemy access is spent.',behind='Stay in the protected formation and accept a lower damage window. Clearing a safe wave or damaging a controlled frontline target is better than walking past allies to reach a carry.',after='Keep distance from surviving threats before helping with an objective. Recheck enemy positions instead of allowing a takedown to turn into an uncontrolled chase.',diagram='Damage from behind allied protection. The arrow is a firing line to a reachable enemy, not a movement route through your frontline.',lessons=['kiting','positioning','target-selection']),
'control':dict(label='Area control and spell cycles',before='Choose the entrance or area your team wants to hold. Place yourself where you can affect that space without being the first target of an enemy engage.',during='Cast where movement is constrained or an ally has created setup. Keep a defensive response for the enemy who can bypass the zone, then reposition during cooldowns.',behind='Use spells to limit the enemy approach and clear safely. Do not walk into unknown ground to force a full damage sequence when a defensive zone can buy time.',after='Move the zone forward with your allies only after checking vision. Conserve enough resources for the next contest rather than spending every spell on a retreating target.',diagram='Hold protected ground and influence the contested area. The dashed zone is a teaching area, not an exact ability size or range.',lessons=['positioning','skillshots','zoning']),
'poke':dict(label='Ranged pressure before commitment',before='Find a clear firing line and a safe location to move to after casting. Check flank routes before focusing on distant targets.',during='Use range to lower enemy health before a hard commitment. If a diver reaches you, switch to survival and repositioning instead of finishing a low-value long-range cast.',behind='Defend a clear line with allies and use safe wave pressure. Do not trade your life for one more spell on a distant opponent who can still return to safety.',after='Turn the health advantage into controlled space with the team. If enemies leave your range, advance only after allies secure the next approach.',diagram='Fire from protected distance while allies screen the approach. The arrow shows a spell line; keep a retreat route if the enemy closes.',lessons=['poking','skillshots','positioning'])
}

def DEPTH_COUNT(c):return DEPTH[c['pattern']]+[None]  # phase sections incl. the inserted worked decision

def diagram(c):
 p=c['pattern']; flank=p in ('assassin','duelist'); front=p in ('engage','bruiser'); protect=p=='protect'
 x,y=(295,55) if flank else (205,230) if front else (65,65)
 ex,ey=(365,130)
 # Shape, labels and arrows carry meaning independently of color.
 if protect: ex,ey=220,135
 elif p in ('marksman','poke','control'): ex,ey=330,160
 desc=PATTERNS[p]['diagram']
 return f'''<svg class="champion-diagram" viewBox="0 0 460 290" role="img" aria-labelledby="diagram-title-{c['slug']} diagram-desc-{c['slug']}" xmlns="http://www.w3.org/2000/svg">
<title id="diagram-title-{c['slug']}">{html.escape(c['title'])}: a possible teamfight formation</title><desc id="diagram-desc-{c['slug']}">{html.escape(desc)} Circles are allies, squares are enemies, and the outlined circle marked You is your position. The arrow is explained in the caption.</desc>
<defs><marker id="arrow-{c['slug']}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="currentColor"/></marker></defs>
<rect x="1" y="1" width="458" height="288" rx="12" fill="var(--tint)" stroke="var(--line)"/>
<rect x="260" y="100" width="165" height="120" rx="16" fill="none" stroke="var(--muted)" stroke-dasharray="5 6"/>
<circle cx="65" cy="170" r="21" fill="var(--blue)"/><text x="65" y="217" text-anchor="middle">Ally</text>
<circle cx="185" cy="140" r="21" fill="var(--blue)"/><text x="185" y="105" text-anchor="middle">Front</text>
<rect x="340" y="140" width="38" height="38" fill="var(--foe)"/><text x="359" y="210" text-anchor="middle">Enemy</text>
<path d="M{x},{y} L{ex},{ey}" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="8 5" marker-end="url(#arrow-{c['slug']})"/>
<circle cx="{x}" cy="{y}" r="25" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/><text x="{x}" y="{y+8}" text-anchor="middle">You</text>
</svg>'''

def build_champions(out):
 roster=json.loads((DATA/'sources/roster.json').read_text())
 official=set(re.findall(r'/en-us/champions/([a-z0-9-]+)/',(DATA/'sources/riot-directory.html').read_text()))
 notes=[line.split('|') for line in (DATA/'notes.tsv').read_text().splitlines() if line and not line.startswith('#')]
 assert all(len(row)==6 for row in notes)
 assert len(notes)==len({row[0] for row in notes})
 assert {row[0] for row in notes}==set(roster['data']), 'Every roster champion must have explicit editorial notes'
 concepts=json.loads((ROOT/'content/concepts.json').read_text());valid={c['slug'] for c in concepts}
 decision_rows=[line.split('|') for line in (DATA/'decisions.tsv').read_text().splitlines() if line and not line.startswith('#')]
 assert all(len(row)==2 for row in decision_rows)
 assert len(decision_rows)==len({row[0] for row in decision_rows}), 'Duplicate worked decision'
 decisions=dict(decision_rows)
 assert set(decisions)==set(roster['data']), 'Each champion needs a worked decision'
 champions=[]; mdroot=DATA/'pages';mdroot.mkdir(exist_ok=True)
 for key,pattern,play,fight,strong,weak in notes:
  raw=json.loads((DATA/'sources'/f'{key}.json').read_text())['data'][key]
  slug=key.lower();assert slug in official
  p=PATTERNS[pattern]; lessons=p['lessons']
  assert set(lessons)<=valid, (key,set(lessons)-valid)
  # Keep an existing starter lesson cross-link that the original matchup guide uses.
  if key in ('Darius','Garen') and 'trading' not in lessons:lessons=lessons+['trading']
  c=dict(id=key,slug=slug,title=raw['name'],kind=p['label'],tags=raw['tags'],pattern=pattern,summary=play,plan=play,fact=fight,mistake=weak,lessons=lessons)
  c['abilities']=[{'slot':slot,'name':a['name'].strip()} for slot,a in zip(['Passive','Q','W','E','R'],[raw['passive']]+raw['spells'])]
  c['source']=f'https://ddragon.leagueoflegends.com/cdn/{roster["version"]}/data/en_US/champion/{key}.json'
  c['version']=roster['version'];c['riotUrl']=f'https://www.leagueoflegends.com/en-us/champions/{slug}/'
  sections=[('Playstyle',play),('Strengths',strong),('Weaknesses and how to respond',weak),('Before the teamfight',p['before']),('Your champion-specific teamfight plan',fight),('During the fight',p['during']),('When behind or unable to reach your target',p['behind']),('After the fight',p['after'])]
  core_sections=sections
  depth_sections=extended_sections(c,decisions[key])
  c['sections']=core_sections+depth_sections
  c['drill']=f'Review three teamfights as {raw["name"]}. Pause before your first committed move. Name your intended target, the enemy response you needed to respect and your route back. Compare the replay with the champion-specific plan above. Record whether your first move used the strength described here, exposed the weakness, or did both. Choose one change to practise in the next game; judge the decision using the information visible at the time, not the final score.'
  c['scenario']=f'Hypothetical: both teams approach a river entrance. One enemy moves forward while another remains out of sight. As {raw["name"]}, apply this rule before acting: {fight} If the missing enemy could interrupt that plan, keep your current safe position and wait for information or allied setup.'
  def sec(h,t):return f'<section><h2>{html.escape(h)}</h2><p>{html.escape(t)}</p></section>'
  def band(id,label,blurb):return f'<div class="cg-band" id="cg-{id}" data-group="{id}"><span>{label}</span><p>{blurb}</p></div>'
  chart,caption=special_diagram(c) or (diagram(c),p['diagram'])
  c['diagramCaption']=caption
  (mdroot/'diagrams').mkdir(exist_ok=True)
  svg_style=':root{--ink:#182a40;--blue:#224fc5;--foe:#ad3932;--muted:#536477;--surface:#fff;--tint:#f0f4fc;--line:#d9e0e9;color:var(--ink)}text{fill:var(--ink);font:24px system-ui,sans-serif}@media(prefers-color-scheme:dark){:root{--ink:#ededed;--blue:#9abaff;--foe:#ed9b91;--muted:#b5b5b5;--surface:#191919;--tint:#222;--line:#424242}}'
  (mdroot/'diagrams'/(slug+'.svg')).write_text(chart.replace('>', '><style>'+svg_style+'</style>',1))
  fig='<section><h2>Teamfight positioning</h2><figure>'+chart+f'<figcaption>{html.escape(caption)} Schematic only: no exact ranges, map coordinates or guaranteed outcome.</figcaption></figure></section>'
  river='<section><h2>Apply it: a river contest</h2><p>'+html.escape(c['scenario'])+'</p></section>'
  nphase=len(DEPTH_COUNT(c))
  phase=depth_sections[:nphase]; common=depth_sections[nphase:]
  worked=[d for d in phase if d[0].startswith('Worked decision')]; phase=[d for d in phase if not d[0].startswith('Worked decision')]
  tags=''.join(f'<li>{html.escape(t)}</li>' for t in c['tags'])
  abil=''.join(f'<li><b>{"•" if a["slot"]=="Passive" else html.escape(a["slot"])}</b><span>{html.escape(a["name"])}</span><small>{"Passive" if a["slot"]=="Passive" else ""}</small></li>' for a in c['abilities'])
  hero=f'<div class="champ-hero"><p class="champ-kind">{html.escape(p["label"])}</p><ul class="champ-tags" aria-label="Roles">{tags}</ul><p class="lead">{html.escape(play)}</p><ol class="champ-kit" aria-label="Ability names">{abil}</ol><p class="note champ-kit-note">Names from the source snapshot. Read in-game tooltips for numbers and interactions.</p></div>'
  glance='<div class="champ-glance"><div><h3>Leans on</h3><p>'+html.escape(strong)+'</p></div><div><h3>Watch for</h3><p>'+html.escape(weak)+'</p></div><div><h3>Core plan</h3><p>'+html.escape(fight)+'</p></div></div>'
  jump='<nav class="champ-jump" aria-label="On this page"><button type="button" data-jump="overview">Overview</button><button type="button" data-jump="fight">Teamfight</button><button type="button" data-jump="game">Across the game</button><button type="button" data-jump="practice">Practice</button></nav>'
  c['html']=hero+glance+jump
  c['html']+=band('overview','Overview','Who this champion is and what to be careful of.')+''.join(sec(h,t) for h,t in sections[:3])
  c['html']+=band('fight','Teamfight','Before, during and after the fight, plus a positioning sketch.')+''.join(sec(h,t) for h,t in sections[3:])+fig
  c['html']+=band('game','Across the game','How the plan changes by phase and game state.')+''.join(sec(h,t) for h,t in phase)
  c['html']+=band('practice','Practice','Turn the plan into decisions you can rehearse and review.')+river+''.join(sec(h,t) for h,t in worked+common)
  # Standalone reading copies preserve the complete editorial guide.
  md=f'# {c["title"]}\n\n{c["kind"]}\n\n'+ '\n\n'.join('## '+h+'\n\n'+t for h,t in sections)
  md+='\n\n## Teamfight positioning\n\n'+caption+'\n\n![Teamfight positioning for '+c['title']+'](diagrams/'+slug+'.svg)\n\n## Apply it: a river contest\n\n'+c['scenario']
  md+='\n\n'+'\n\n'.join('## '+h+'\n\n'+t for h,t in depth_sections)
  md+='\n\n## Replay exercise\n\n'+c['drill']
  md+='\n\n## Related lessons\n\n'+', '.join(lessons)+'\n\n## Sources and scope\n\n'+f'[Riot champion page]({c["riotUrl"]}); [Riot Data Dragon {c["version"]}]({c["source"]}). Retrieved 5 November 2026 UTC (4 November Pacific). Tactical advice and scenarios are editorial interpretation of the kit; they are not Riot recommendations. Build choices, numerical matchups and win-rate rankings are outside these guides.\n'
  (mdroot/(slug+'.md')).write_text(md)
  champions.append(c)
 champions.sort(key=lambda c:c['title'].casefold())
 assert {c['slug'] for c in champions}==official
 assert len({c['html'] for c in champions})==len(champions)
 (out/'champions.js').write_text('const CHAMPIONS = '+json.dumps(champions,ensure_ascii=False).replace('</','<\\/')+';\n')
 report={'version':roster['version'],'count':len(champions),'officialDirectoryCount':len(official),'ids':[c['id'] for c in champions],'patterns':{k:sum(c['pattern']==k for c in champions) for k in PATTERNS},'minimumEditorialWords':min(len((mdroot/(c['slug']+'.md')).read_text().split()) for c in champions)}
 (DATA/'coverage.json').write_text(json.dumps(report,indent=2)+'\n')
 print(f'Built {len(champions)} champion guides; roster and official directory match exactly')

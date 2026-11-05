"""Build the revised concept library with Python 3.9+, standard library only."""
from pathlib import Path
import re,json,html,shutil,hashlib
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'dist'; OUT.mkdir(exist_ok=True)
files=sorted((ROOT/'content/articles').glob('*/*.md'))
concepts={a['id']:a for a in json.loads((ROOT/'content/concepts.json').read_text())}
lessons=[]
for f in files:
 s=f.read_text(); title=re.search(r'^# (.+)',s,re.M)[1]
 def field(micro,macro):
  m=re.search(r'^'+micro+r': (.+)$',s,re.M) or re.search(r'^- '+macro+r': (.+)$',s,re.M)
  return m[1] if m else ''
 lessons.append(dict(id=f.name[:4],slug=field('slug','Slug'),category=field('category','Category'),summary=field('summary','Summary'),title=title,source=s,file=f.name,meta={k:field(k,v) for k,v in [('roles','Roles and level'),('skill_level','Level'),('prerequisites','Prerequisites'),('action','Observable action')]}))
assert len(lessons)==len(concepts) and len({a['slug'] for a in lessons})==len(lessons)
assert {a['id'] for a in lessons}==set(concepts)
for a in lessons:
 assert a['title']==concepts[a['id']]['title'] and a['slug']==concepts[a['id']]['slug']
 a['aliases']=concepts[a['id']]['aliases']
routes={a['file']:a['slug'] for a in lessons}
def url(u):
 if '.md' in u:
  assert Path(u).name in routes,u
  return '#/lesson/'+routes[Path(u).name]
 if u.startswith('../visuals/'):
  return 'assets/'+Path(u).name
 assert u.startswith('https://'),u
 return u
def inline(s):
 s=html.escape(s)
 s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',lambda m:'<a href="'+html.escape(url(html.unescape(m[2])),quote=True)+'">'+m[1]+'</a>',s)
 s=re.sub(r'\*\*(.+?)\*\*',r'<strong>\1</strong>',s)
 s=re.sub(r'\*([^*]+)\*',r'<em>\1</em>',s)
 return s
for a in lessons:
 s=a['source'];body=s[s.index('## Short answer'):];blocks=re.split(r'\n\s*\n',body.strip());out=[];opened=False
 for block in blocks:
  if block.startswith('## '):
   if opened:out.append('</section>')
   name=block[3:];low=name.lower()
   cls='answer' if name=='Short answer' else 'practice' if name.startswith('Practice') else 'section '+('mistake' if low.startswith('common mistake') else 'deeper' if low.startswith('going deeper') else 'example' if 'example' in low else 'related' if low.startswith('related') else 'sources' if low.startswith('sources') else 'limits' if low.startswith('limits') else 'core')
   out.append('<section class="'+cls+'"><h2>'+inline(name)+'</h2>');opened=True
  elif block.startswith('<!-- Interactive:'):
   name=re.search(r'<!-- Interactive: ([a-z-]+) -->',block)[1]
   out.append('<div class="widget" data-widget="'+name+'"></div>')
  elif '<!-- Figure:' in block:
   m=re.search(r'!\[([^\]]+)\]\(([^)]+)\)',block);assert m
   stem=a['id'].lower();out.append('<figure><picture><source media="(max-width: 760px)" srcset="assets/'+stem+'-mobile.svg"><img src="assets/'+stem+'-desktop.svg" alt="'+html.escape(m[1],quote=True)+'" loading="lazy"></picture>')
  elif block.startswith('*') and out[-1].startswith('<figure>'):
   out.append('<figcaption>'+inline(block)+'</figcaption></figure>')
  elif re.match(r'^\d+\. ',block):
   out.append('<ol>'+''.join('<li>'+inline(re.sub(r'^\d+\. ','',line))+'</li>' for line in block.splitlines())+'</ol>')
  elif block.startswith('- '):
   out.append('<ul>'+''.join('<li>'+inline(line[2:])+'</li>' for line in block.splitlines())+'</ul>')
  else:out.append('<p>'+inline(block.replace('\n',' '))+'</p>')
 out.append('</section>');a['html']=''.join(out);a['search']=a['source'];a['minutes']=max(1,round(len(s.split())/220));a['sha256']=hashlib.sha256(s.encode()).hexdigest();del a['source']
shutil.copytree(ROOT/'content/articles/visuals/assets',OUT/'assets',dirs_exist_ok=True)
# Embedded SVG media queries inherit the host image's CSS color-scheme, so
# manual theme changes and the system default both update figures immediately.
dark_palette = {'#f5f7fb':'#191919', '#ffffff':'#222222', '#fff':'#222222', 'white':'#222222',
                '#dee5f3':'#2c2c2c', '#172b4d':'#ededed', '#405574':'#b5b5b5',
                '#1749bd':'#9abaff', '#dce2ed':'#424242', '#78869c':'#777777'}
svg_css = '@media(prefers-color-scheme:dark){text{fill:#ededed}.label{fill:#9abaff}' + ''.join(
 '[%s="%s"]{%s:%s}' % (attribute, light, attribute, dark)
 for light,dark in dark_palette.items() for attribute in ('fill','stroke')) + '}'
from figures import redraw
redrawn=0
for figure in (OUT/'assets').glob('*.svg'):
 svg = figure.read_text()
 fresh = redraw(svg, figure.stem.endswith('-mobile'))
 if fresh: figure.write_text(fresh); redrawn+=1; continue
 figure.write_text(svg.replace('</svg>', '<style>'+svg_css+'</style></svg>'))
print(f'Redrew {redrawn} three-step lesson figures')

# PNG download links from the reviewed package remain functional too.
# Standalone rebuilds use the copied previews.
if (ROOT/'content/png').exists():
 for f in (ROOT/'content/png').glob('*.png'):shutil.copy(f,OUT/'assets'/f.name)
for f in (ROOT/'src').iterdir():shutil.copy(f,OUT/f.name)
(OUT/'data.js').write_text('const LESSONS = '+json.dumps(lessons,ensure_ascii=False).replace('</','<\\/')+';\n')
print(f'Built {len(lessons)} lessons with responsive figures into dist/')

stages=json.loads((ROOT/'content/path.json').read_text())
ids=[id for stage in stages for id in stage['ids']]
assert len(ids)==len(set(ids)) and set(ids)==set(concepts)
prerequisites=json.loads((ROOT/'content/prerequisites.json').read_text())
assert set(prerequisites)==set(concepts), 'Every lesson needs an explicit prerequisite entry'
for lesson, required in prerequisites.items():
 assert len(required)==len(set(required))
 assert all(r in concepts and ids.index(r)<ids.index(lesson) for r in required), 'Prerequisite order: '+lesson
for stage in stages:
 assert set(stage['extension'])=={'title','scenario','walkthrough','drill'}
 assert all(stage['extension'].values()) and len(stage['quiz'])==3
 for q in stage['quiz']:
  assert len(q['options'])==3 and len(set(q['options']))==3
  assert type(q['answer']) is int and 0<=q['answer']<3
  assert q['prompt'] and q['explanation'] and q['review'] in stage['ids']
(OUT/'path.js').write_text('const LEARNING_PATH = '+json.dumps(stages,ensure_ascii=False)+';\nconst PREREQS = '+json.dumps(prerequisites)+';\n')

from champions import build_champions
build_champions(OUT)

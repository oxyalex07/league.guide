"""Check per-champion length growth and both published reading formats."""
from pathlib import Path
from html import unescape
import json,re
from champion_depth import DEPTH, COMMON
root=Path(__file__).resolve().parent
data=root/'content/champions'
champions=json.loads((root/'dist/champions.js').read_text().removeprefix('const CHAMPIONS = ').strip().removesuffix(';'))
baseline=json.loads((data/'length-baseline.json').read_text())
decisions=dict(line.split('|') for line in (data/'decisions.tsv').read_text().splitlines() if line and not line.startswith('#'))
assert set(baseline)==set(decisions)=={c['id'] for c in champions}
assert len(set(decisions.values()))==len(champions)
report=[]
for c in champions:
    text=unescape(re.sub('<[^>]+>',' ', c['html']+' '+c['drill']))
    # Preserve the initial measurement method, which counted escaped text tokens.
    current=len(re.sub('<[^>]+>',' ', c['html']+' '+c['drill']).split())
    md=(data/'pages'/(c['slug']+'.md')).read_text()
    old=baseline[c['id']]
    assert current>=old['words']*3, c['id']
    assert len(md.split())>=old['markdownWords']*3, c['id']
    assert len(c['sections'])==19, c['id']
    for heading,paragraph in c['sections']:
        assert paragraph in text and paragraph in md,(c['id'],heading)
    assert decisions[c['id']] in text and decisions[c['id']] in md
    assert len({p for h,p in c['sections']})==19
    assert len(decisions[c['id']].split())>=35,c['id']
    assert '{{' not in text and 'TODO' not in text,c['id']
    report.append({'id':c['id'],'beforeBodyWords':old['words'],'afterBodyWords':current,'bodyRatio':current/old['words'],'beforeMarkdownWords':old['markdownWords'],'afterMarkdownWords':len(md.split()),'readingFormatsMatch':True})
(root/'evidence/champion-depth-content.json').write_text(json.dumps({'count':len(report),'records':report},indent=2)+'\n')
print(f'{len(report)} champion growth, distinct decision and HTML/Markdown content checks passed')

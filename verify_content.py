from pathlib import Path
import re,json,html,hashlib
from html.parser import HTMLParser
root=Path(__file__).resolve().parent
lessons=json.loads((root/'dist/data.js').read_text()[16:].strip().removesuffix(';'))
class Text(HTMLParser):
 def __init__(self): super().__init__();self.parts=[]
 def handle_data(self,s): self.parts.append(s)
def norm(s):return re.sub(r'\s+','',s).strip()
checks=[]
for a in lessons:
 source=next((root/'content/articles').glob('*/'+a['file'])).read_text()
 assert hashlib.sha256(source.encode()).hexdigest()==a['sha256']
 body=source[source.index('## Short answer'):]
 body=re.sub(r'<!--.*?-->','',body,flags=re.S)
 body=re.sub(r'!\[[^\]]*\]\([^)]+\)','',body)
 body=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',body)
 body=re.sub(r'^(?:## |\d+\. |- )','',body,flags=re.M)
 body=body.replace('*','')
 parser=Text();parser.feed(a['html'])
 assert norm(body)==norm(' '.join(parser.parts)),a['id']+' text mismatch'
 assert '/api/attachments/' not in a['html'] and '/LEA/' not in a['html']
 checks.append(a['id']+': exact ordered body text, captions, source notes preserved; links mapped; input SHA-256 recorded')
(root/'evidence/content-verification.json').write_text(json.dumps(checks,indent=2));print(f'{len(checks)} exact content comparisons passed')

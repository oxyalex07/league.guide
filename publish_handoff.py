import os,json,subprocess,pathlib
p=pathlib.Path('website');helper='/private/var/folders/jf/jlrcg3yn0wd_8lwwyh9yc3300000gn/T/paperclip-ai-bd424d1c-0370-42bd-b498-b9f8c91063d3-d8452d36-a04f-4923-8edc-05179b8d03b6-EP0Irk/provider/skills/paperclip/scripts/paperclip-upload-artifact.sh'
receipts=[]
for f,title in [('deliverables/league-guide-website.zip','League.guide — complete runnable website'),('website/evidence/desktop-article.png','Website — desktop article'),('website/evidence/mobile-figure.png','Website — mobile figure')]:
 r=subprocess.run(['bash',helper,f,'--title',title,'--output','json']+(['--no-primary'] if receipts else []),capture_output=True,text=True,check=True)
 receipts.append(json.loads(r.stdout));(p/'upload-receipts.json').write_text(json.dumps(receipts,indent=2))
base=os.environ['PAPERCLIP_API_URL'].rstrip('/').removesuffix('/api');issue=os.environ['PAPERCLIP_TASK_ID']
def write(method,path,payload):
 r=subprocess.run(['curl','-sS','-f','-X',method,'-H','Authorization: Bearer '+os.environ['PAPERCLIP_API_KEY'],'-H','X-Paperclip-Run-Id: '+os.environ['PAPERCLIP_RUN_ID'],'-H','Content-Type: application/json','--data-binary',json.dumps(payload),base+path],capture_output=True,text=True,check=True)
 return json.loads(r.stdout)
links='\n'.join('- ['+r['attachment']['originalFilename']+']('+r['attachment']['contentPath']+')' for r in receipts)
doc=write('PUT',f'/api/issues/{issue}/documents/review-handoff',{'title':'Website — review handoff and runnable package','format':'markdown','body':(p/'HANDOFF.md').read_text()+'\n## Downloads\n\n'+links+'\n\n'+(p/'README.md').read_text(),'baseRevisionId':None});(p/'document-receipt.json').write_text(json.dumps(doc,indent=2))
package=receipts[0]['attachment']['contentPath']
r=write('PATCH',f'/api/issues/{issue}',{'status':'done','comment':'Built and packaged the approved library website: ten reviewed lessons, eight responsive figures, search and category browsing, related links, and browser history.\n\n523 browser checks passed at desktop, mobile and 320px widths. Ten content comparisons confirm reviewed lesson bodies, captions and source notes are preserved.\n\n[Download the runnable website]('+package+'). Extract it and open dist/index.html. Source, rebuild instructions, test scripts and twelve screenshots are included.\n\n[Review handoff](/LEA/issues/LEA-23#document-review-handoff). No managed runtime is configured for this task; the portable artifact is the review access path. No public deployment or domain changes.'});assert r['status']=='done';(p/'completion-receipt.json').write_text(json.dumps(r,indent=2));print(json.dumps({'status':r['status'],'package':package,'document':'/LEA/issues/LEA-23#document-review-handoff'}))

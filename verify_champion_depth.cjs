const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const base='file://'+path.join(__dirname,'dist/index.html');
 await page.goto(base+'#/champions');
 const records=await page.evaluate(()=>{
  const out=[];
  for(const c of CHAMPIONS){
   // Reconstruct the previous body exactly by removing only newly added sections.
   const expanded=c.html, holder=document.createElement('div');holder.innerHTML=expanded;
   const added=new Set(c.sections.slice(8).map(([h])=>h));
   holder.querySelectorAll('section').forEach(s=>{if(added.has(s.querySelector('h2')?.textContent))s.remove();});
   history.replaceState(null,'','#/champion/'+c.slug);
   c.html=holder.innerHTML;renderDirectory(null,true);
   const before=document.querySelector('.article').innerText.trim().split(/\s+/).length;
   c.html=expanded;renderDirectory(null,true);
   const after=document.querySelector('.article').innerText.trim().split(/\s+/).length;
   const headings=Array.from(document.querySelectorAll('.article h2')).map(e=>e.textContent);
   const paragraphs=Array.from(document.querySelectorAll('.article section>p')).map(e=>e.textContent);
   const decision=document.querySelector('.article').innerText.includes('Hypothetical practice situation.');
   const chartBeforeDepth=headings.indexOf('Teamfight positioning')<headings.indexOf(c.sections[8][0]);
   out.push({id:c.id,title:c.title,slug:c.slug,before,after,ratio:after/before,addedSections:added.size,decision,chartBeforeDepth,uniqueHeadings:new Set(headings).size===headings.length,uniqueParagraphs:new Set(paragraphs).size===paragraphs.length});
  }
  return out;
 });
 for(const r of records){
  if(r.ratio<3||r.addedSections!==11||!r.decision||!r.chartBeforeDepth||!r.uniqueHeadings||!r.uniqueParagraphs)throw Error(JSON.stringify(r));
 }
 for(const [width,slug,theme] of [[1440,'ahri','light'],[320,'thresh','dark']]){
  await page.setViewportSize({width,height:1000});await page.goto(base+'#/champion/'+slug);
  if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme-toggle').click();
  const h=page.getByRole('heading',{name:'Worked decision: when the first plan changes',exact:true});
  await h.scrollIntoViewIfNeeded();
  if(await page.locator('.reader').evaluate(e=>e.scrollWidth>e.clientWidth))throw Error('overflow '+slug);
  await page.screenshot({path:path.join(__dirname,'evidence','expanded-'+slug+'-'+width+'.png')});
 }
 if(errors.length)throw Error(errors.join('\n'));
 const report={count:records.length,method:'Visible article innerText with ability-name details closed; before reconstructed by removing only the 11 new sections, preserving original source/footer/matchup text.',minimumRatio:Math.min(...records.map(r=>r.ratio)),maximumRatio:Math.max(...records.map(r=>r.ratio)),minimumWords:Math.min(...records.map(r=>r.after)),maximumWords:Math.max(...records.map(r=>r.after)),records};
 fs.writeFileSync(path.join(__dirname,'evidence/champion-depth-checks.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({count:report.count,minRatio:report.minimumRatio,maxRatio:report.maximumRatio,minWords:report.minimumWords,maxWords:report.maximumWords}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

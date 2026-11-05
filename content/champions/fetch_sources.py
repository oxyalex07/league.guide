import concurrent.futures,json,pathlib,urllib.request
root=pathlib.Path(__file__).parent/'sources'
roster=json.loads((root/'roster.json').read_text())
def fetch(key):
 p=root/(key+'.json')
 if not p.exists():
  url=f'https://ddragon.leagueoflegends.com/cdn/{roster["version"]}/data/en_US/champion/{key}.json'
  p.write_bytes(urllib.request.urlopen(url,timeout=40).read())
 return key
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
 print('Verified source files:',len(list(pool.map(fetch,roster['data']))))

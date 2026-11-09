"""Pinned PokeAPI sprites. Requires Pillow; run from repository root. No runtime API."""
import concurrent.futures, hashlib, io, json, pathlib, urllib.request
from PIL import Image
ROOT=pathlib.Path('assets/pokemon')
# Resolve once, then retain the immutable revision in the lock file.
lock=ROOT/'source-lock.json'
if lock.exists(): revision=json.loads(lock.read_text())['revision']
else:
 req=urllib.request.Request('https://api.github.com/repos/PokeAPI/sprites/commits/master',headers={'User-Agent':'Wordwild-asset-cache'})
 revision=json.load(urllib.request.urlopen(req))['sha']
 lock.write_text(json.dumps({'repository':'https://github.com/PokeAPI/sprites','revision':revision},indent=2)+'\n')
base=f'https://raw.githubusercontent.com/PokeAPI/sprites/{revision}/'
def fetch(job):
 n,view,shiny=job
 upstream=f'sprites/pokemon/{"back/" if view=="back" else ""}{"shiny/" if shiny else ""}{n}.png'
 url=base+upstream
 data=urllib.request.urlopen(url,timeout=40).read()
 im=Image.open(io.BytesIO(data));im.load()
 assert im.format=='PNG' and im.size==(96,96), (url,im.size)
 im=im.convert('RGBA');box=im.getchannel('A').getbbox();assert box
 crop=im.crop(box);scale=min(76/crop.width,76/crop.height)
 crop=crop.resize((max(1,round(crop.width*scale)),max(1,round(crop.height*scale))),Image.Resampling.NEAREST)
 out=Image.new('RGBA',(96,96));out.alpha_composite(crop,((96-crop.width)//2,88-crop.height))
 file=f'{n}-{view}{"-shiny" if shiny else ""}.png';out.save(ROOT/file)
 return dict(file=file,url=url,sourceSha256=hashlib.sha256(data).hexdigest(),sha256=hashlib.sha256((ROOT/file).read_bytes()).hexdigest(),sourceSize=[96,96],sourceAlphaBounds=box,outputSize=[96,96],rights='Pokémon imagery © The Pokémon Company; not covered by project code license')
roster=json.loads((ROOT/'roster.json').read_text())
jobs=[(r['pokemonId'],v,s) for r in roster for v in ['front','back'] for s in [False,True]]
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool: records=list(pool.map(fetch,jobs))
(ROOT/'asset-manifest.json').write_text(json.dumps(records,indent=2)+'\n')
(ROOT/'UPSTREAM-LICENCE.txt').write_bytes(urllib.request.urlopen(base+'LICENCE.txt').read())
print(f'Validated and cached {len(records)} sprites at {revision}')

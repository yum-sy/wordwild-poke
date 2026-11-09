from pathlib import Path
import json,urllib.request,hashlib,io
from PIL import Image
root=Path('assets/capture');root.mkdir(exist_ok=True)
revision=json.loads(Path('assets/pokemon/source-lock.json').read_text())['revision']
records=[]
for name in ['poke-ball','great-ball','ultra-ball','master-ball']:
 url=f'https://raw.githubusercontent.com/PokeAPI/sprites/{revision}/sprites/items/{name}.png'
 raw=urllib.request.urlopen(url).read();im=Image.open(io.BytesIO(raw)).convert('RGBA');box=im.getchannel('A').getbbox();assert box
 crop=im.crop(box);crop.thumbnail((28,28),Image.Resampling.NEAREST)
 # Enlarge using whole pixels, centered on a common canvas.
 scale=max(1,min(28//crop.width,28//crop.height));crop=crop.resize((crop.width*scale,crop.height*scale),Image.Resampling.NEAREST)
 out=Image.new('RGBA',(32,32));out.alpha_composite(crop,((32-crop.width)//2,(32-crop.height)//2));out.save(root/f'{name}.png')
 records.append({'file':f'{name}.png','url':url,'sourceSha256':hashlib.sha256(raw).hexdigest(),'sha256':hashlib.sha256((root/f'{name}.png').read_bytes()).hexdigest(),'rights':'Pokémon imagery © The Pokémon Company; excluded from code license','processing':'alpha crop, integer nearest-neighbor scale, centered 32px canvas'})
(root/'sources.json').write_text(json.dumps(records,indent=2)+'\n')

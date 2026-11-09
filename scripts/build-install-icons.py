"""Package the cached Pichu back sprite as maskable install icons."""
from pathlib import Path
from PIL import Image
source=Path('assets/pokemon/172-back.png')
im=Image.open(source).convert('RGBA')
sprite=im.crop(im.getchannel('A').getbbox())
for size in (180,192,512):
    # Keep all character pixels inside the central maskable safe circle.
    scale=max(1,int(size*.65/max(sprite.size)))
    scaled=sprite.resize((sprite.width*scale,sprite.height*scale),Image.Resampling.NEAREST)
    icon=Image.new('RGBA',(size,size),'#e6efcc')
    icon.alpha_composite(scaled,((size-scaled.width)//2,(size-scaled.height)//2))
    icon.convert('RGB').save(f'assets/icons/pichu-back-{size}.png')

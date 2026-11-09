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

# Approved head-and-ears crop. Any-purpose icons retain the close-up composition.
head=im.crop((18,10,78,70))
for size in (16,32,180,192,512):
    icon=Image.new('RGBA',(size,size),'#fff4c9')
    inset=max(1,round(size*.06))
    face=head.resize((size-2*inset,size-2*inset),Image.Resampling.NEAREST)
    icon.alpha_composite(face,(inset,inset))
    icon.convert('RGB').save(f'assets/icons/pichu-close-{size}.png')

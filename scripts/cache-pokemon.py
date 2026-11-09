"""Build pinned, local Gen I–II data and sprites; Python 3 + Pillow required.

Static PNGs always exist. A species uses animation only when all four GIF variants
validate. No game-time API calls. Original downloads cache in ignored work/.
"""
import concurrent.futures, csv, hashlib, io, json, pathlib, time, urllib.error, urllib.request
from PIL import Image, ImageSequence
ROOT = pathlib.Path('assets/pokemon')
CACHE = pathlib.Path('work/pokemon-source-cache')
ROOT.mkdir(parents=True, exist_ok=True)
CACHE.mkdir(parents=True, exist_ok=True)
RIGHTS = 'Pokémon imagery © The Pokémon Company; excluded from project code license'

def download(url, optional=False):
    cached = CACHE / hashlib.sha256(url.encode()).hexdigest()
    if cached.exists():
        return cached.read_bytes()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Wordwild-local-assets'})
            data = urllib.request.urlopen(req, timeout=45).read()
            cached.write_bytes(data)
            return data
        except urllib.error.HTTPError as exc:
            if optional and exc.code == 404:
                return None
            if attempt == 3:
                raise
        except (TimeoutError, OSError):
            if attempt == 3:
                raise
        time.sleep(.3 * (attempt + 1))

lock_path = ROOT / 'source-lock.json'
lock = json.loads(lock_path.read_text())
revision = lock['revision']
base = f'https://raw.githubusercontent.com/PokeAPI/sprites/{revision}/'
if 'dataRevision' not in lock:
    lock['dataRevision'] = json.loads(download('https://api.github.com/repos/PokeAPI/pokeapi/commits/master'))['sha']
    lock['dataRepository'] = 'https://github.com/PokeAPI/pokeapi'
lock_path.write_text(json.dumps(lock, indent=2) + '\n')
data_base = f'https://raw.githubusercontent.com/PokeAPI/pokeapi/{lock["dataRevision"]}/data/v2/csv/'
data_records = []
def csv_rows(name):
    url = data_base + name + '.csv'
    raw = download(url)
    data_records.append({'file': name + '.csv', 'url': url, 'sha256': hashlib.sha256(raw).hexdigest()})
    return list(csv.DictReader(io.StringIO(raw.decode())))

species = {int(r['id']): r for r in csv_rows('pokemon_species') if int(r['id']) <= 251}
names = {int(r['pokemon_species_id']): r['name'] for r in csv_rows('pokemon_species_names') if r['local_language_id'] == '9'}
types = {r['id']: r['identifier'].upper() for r in csv_rows('types')}
primary_types = {int(r['pokemon_id']): types[r['type_id']] for r in csv_rows('pokemon_types') if r['slot'] == '1' and int(r['pokemon_id']) <= 251}
heights = {int(r['id']): int(r['height']) / 10 for r in csv_rows('pokemon') if int(r['id']) <= 251}
def key(n): return f'p{n:03d}'
def ancestry(n):
    lineage = [n]
    while species[lineage[-1]]['evolves_from_species_id']:
        parent = int(species[lineage[-1]]['evolves_from_species_id'])
        if parent not in species:
            break
        assert parent not in lineage, 'Cyclic evolution'
        lineage.append(parent)
    return key(lineage[-1]), len(lineage) - 1
rows = []
for n, row in species.items():
    family, depth = ancestry(n)
    rows.append({'id': key(n), 'pokemonId': n, 'heightM': heights[n], 'name': names[n], 'type': primary_types[n],
                 'evolvesTo': [key(i) for i, r in species.items() if r['evolves_from_species_id'] == str(n)],
                 'family': family, 'depth': depth,
                 'isBoss': row['is_legendary'] == '1' or row['is_mythical'] == '1',
                 'legendary': row['is_legendary'] == '1', 'mythical': row['is_mythical'] == '1'})
assert len(rows) == 251 and sum(r['isBoss'] for r in rows) == 11

# Reuse a single crop/scale across an entire animation, never one per frame.
def normalize(frames):
    boxes = [im.getchannel('A').getbbox() for im in frames]
    assert all(boxes), 'Blank frame'
    box = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))
    width, height = box[2] - box[0], box[3] - box[1]
    scale = min(76 / width, 76 / height)
    target = (max(1, round(width * scale)), max(1, round(height * scale)))
    outputs = []
    for im in frames:
        crop = im.crop(box).resize(target, Image.Resampling.NEAREST)
        canvas = Image.new('RGBA', (96, 96))
        canvas.alpha_composite(crop, ((96 - target[0]) // 2, 88 - target[1]))
        outputs.append(canvas)
    return outputs, box

def gif_frame(im):
    # Reserve palette slot 255 for transparency. Every frame is complete, so
    # disposal=2 clears its canvas before the next frame and prevents trails.
    palette = im.convert('RGB').quantize(colors=255)
    palette.putpalette((palette.getpalette() + [0] * 768)[:768])
    alpha = im.getchannel('A')
    palette.paste(255, mask=alpha.point(lambda a: 255 if a < 128 else 0))
    palette.info['transparency'] = 255
    return palette

def fetch(job):
    n, view, shiny, animated = job
    ext = 'gif' if animated else 'png'
    family = 'sprites/pokemon/versions/generation-v/black-white/animated/' if animated else 'sprites/pokemon/'
    upstream = f'{family}{"back/" if view == "back" else ""}{"shiny/" if shiny else ""}{n}.{ext}'
    url = base + upstream
    raw = download(url, optional=animated)
    file = f'{n}-{view}{"-shiny" if shiny else ""}.{ext}'
    if raw is None:
        return {'file': file, 'url': url, 'available': False, 'reason': 'upstream 404'}
    with Image.open(io.BytesIO(raw)) as im:
        assert im.format == ('GIF' if animated else 'PNG'), (url, im.format)
        if not animated:
            assert im.size == (96, 96), (url, im.size)
        original_size = list(im.size)
        durations = []
        frames = []
        for frame in ImageSequence.Iterator(im):
            frames.append(frame.convert('RGBA'))
            durations.append(frame.info.get('duration', 100))
    normalized, box = normalize(frames)
    if animated:
        assert len(frames) > 1 and all(d > 0 for d in durations), url
        paletted = [gif_frame(frame) for frame in normalized]
        paletted[0].save(ROOT / file, save_all=True, append_images=paletted[1:], duration=durations,
                         loop=0, disposal=2, transparency=255, optimize=False)
    else:
        normalized[0].save(ROOT / file)
    out = (ROOT / file).read_bytes()
    with Image.open(io.BytesIO(out)) as verify:
        assert verify.size == (96, 96)
        output_durations = [f.info.get('duration', 100) for f in ImageSequence.Iterator(verify)]
        output_duration = sum(output_durations)
        if animated:
            assert output_duration == sum(durations), (url, output_duration, sum(durations))
    return {'file': file, 'url': url, 'available': True, 'sourceSha256': hashlib.sha256(raw).hexdigest(),
            'sha256': hashlib.sha256(out).hexdigest(), 'sourceSize': original_size, 'sourceAlphaBounds': box,
            'outputSize': [96, 96], 'sourceFrameCount': len(frames), 'frameCount': len(output_durations),
            'sourceDurationsMs': durations if animated else [], 'durationMs': sum(durations) if animated else 0,
            'normalization': 'union alpha bounds; nearest-neighbor fit 76px; bottom baseline 88px; GIF disposal=2',
            'rights': RIGHTS}

jobs = [(r['pokemonId'], v, s, a) for r in rows for a in [False, True] for v in ['front', 'back'] for s in [False, True]]
records = []
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    for record in pool.map(fetch, jobs):
        records.append(record)
        if len(records) % 200 == 0:
            print(f'Cached {len(records)}/{len(jobs)}', flush=True)
for row in rows:
    row['animated'] = all(r['available'] for r in records if r['file'].startswith(str(row['pokemonId']) + '-') and r['file'].endswith('.gif'))
(ROOT / 'roster.json').write_text(json.dumps(rows, indent=2, ensure_ascii=False) + '\n')
(ROOT / 'asset-manifest.json').write_text(json.dumps(records, indent=2, ensure_ascii=False) + '\n')
data_license_url = f'https://raw.githubusercontent.com/PokeAPI/pokeapi/{lock["dataRevision"]}/LICENSE.md'
data_license = download(data_license_url)
(ROOT / 'UPSTREAM-DATA-LICENSE.txt').write_bytes(data_license)
license_record = {'name': 'BSD-3-Clause', 'file': 'UPSTREAM-DATA-LICENSE.txt', 'url': data_license_url,
                  'sha256': hashlib.sha256(data_license).hexdigest(), 'copyright': data_license.decode().splitlines()[0],
                  'scope': 'PokeAPI/pokeapi repository notice retained for imported CSV data; does not grant Pokémon IP rights'}
(ROOT / 'data-manifest.json').write_text(json.dumps({'sources': data_records, 'scope': 'National Dex 1–251; original species and forms only', 'license': license_record}, indent=2, ensure_ascii=False) + '\n')
(ROOT / 'UPSTREAM-LICENCE.txt').write_bytes(download(base + 'LICENCE.txt'))
pathlib.Path('src/pokemon-data.js').write_text('// Generated by scripts/cache-pokemon.py from pinned PokeAPI CSVs.\nexport const POKEMON_DATA = ' + json.dumps(rows, indent=2, ensure_ascii=False) + ';\n')
print(f'Completed {len(rows)} species, {sum(r["animated"] for r in rows)} full animation sets, {sum(r["available"] for r in records)} files', flush=True)

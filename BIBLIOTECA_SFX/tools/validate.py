import collections
import hashlib
import json
import pathlib
import wave
import zipfile

root=pathlib.Path(__file__).resolve().parents[1]
catalog=json.loads((root/'catalogo.json').read_text(encoding='utf8'))
packs=json.loads((root/'fuentes.json').read_text(encoding='utf8'))
assert len({x['file'] for x in catalog})==len(catalog)
for item in catalog:
    path=root/item['file']
    assert path.is_file() and (root/item['original']).is_file()
    assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
    with wave.open(str(path),'rb') as wav:
        assert wav.getframerate()==48000 and wav.getnchannels()==2 and wav.getsampwidth()==2
        assert abs(wav.getnframes()/48000-item['duration'])<.00001
    assert item['peakDbFS']<0
    assert item['license']=='CC0 1.0'
for pack in packs:
    path=root/pack['archive']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==pack['archiveSha256']
    with zipfile.ZipFile(path) as bundle: assert bundle.testzip() is None
originals={x for pack in packs for x in pack['audioFiles']}
report={'selectedWav':len(catalog),'categories':dict(collections.Counter(x['category'] for x in catalog)),
        'sourcePacks':len(packs),'uniqueOriginalPaths':len(originals),
        'demoOriginals':sum('preview' in pathlib.PurePosixPath(x).name.lower() for x in originals),
        'selectedHashesAndFormatsVerified':True,'sourceArchiveCrcVerified':True,
        'libraryBytes':sum(x.stat().st_size for x in root.rglob('*') if x.is_file()),
        'auditoryReview':False}
(root/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2))

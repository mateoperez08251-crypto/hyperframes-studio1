import concurrent.futures
import hashlib
import json
import pathlib
import urllib.request
import zipfile
from discover import discover,pages

root=pathlib.Path(__file__).resolve().parents[1]
def download(url):
    found=discover(url)
    direct=next(item for item in found['downloads'] if item.lower().endswith('.zip'))
    pack=url.rstrip('/').split('/')[-1]
    author='Kenney' if 'kenney.nl' in url else 'rubberduck'
    archive=root/'fuentes'/f'{pack}.zip'
    archive.parent.mkdir(parents=True,exist_ok=True)
    if not archive.exists():
        request=urllib.request.Request(direct,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(request,timeout=60) as response:
            archive.write_bytes(response.read())
    extracted=[]
    with zipfile.ZipFile(archive) as bundle:
        bad=bundle.testzip()
        assert bad is None, bad
        for item in bundle.infolist():
            path=pathlib.PurePosixPath(item.filename)
            if path.is_absolute() or '..' in path.parts or ':' in item.filename:
                raise ValueError('Unsafe archive path')
            if path.suffix.lower() in ['.wav','.ogg','.mp3','.flac']:
                target=root/'originales'/pack/path
                target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(bundle.read(item))
                extracted.append(target.relative_to(root).as_posix())
            elif 'license' in path.name.lower() and not item.is_dir():
                target=root/'licencias'/f'{pack}-{path.name}'
                target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(bundle.read(item))
    return {'pack':pack,'author':author,'source':url,'download':direct,
            'license':'CC0 1.0','licenseUrl':'https://creativecommons.org/publicdomain/zero/1.0/',
            'checked':'2026-10-27','archive':archive.relative_to(root).as_posix(),
            'archiveSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),
            'audioFiles':extracted}

if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        packs=list(pool.map(download,pages))
    (root/'fuentes.json').write_text(json.dumps(packs,indent=2,ensure_ascii=False),encoding='utf8')
    for pack in packs:
        print(pack['pack'],len(pack['audioFiles']),'files')
        print('\n'.join(pack['audioFiles'][:55]))

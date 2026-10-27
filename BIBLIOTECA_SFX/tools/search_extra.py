import json
import urllib.request
import urllib.parse
import pathlib
queries=['pencil writing','rain ambience','heartbeat','wind blowing']
results=[]
for query in queries:
    url='https://api.openverse.org/v1/audio/?'+urllib.parse.urlencode({'q':query,'license':'cc0','page_size':4})
    try:
        request=urllib.request.Request(url,headers={'User-Agent':'HyperFramesAudioLibrary/1.0'})
        with urllib.request.urlopen(request,timeout=25) as response: data=json.load(response)
        values=[{key:item.get(key) for key in ['id','title','creator','license','license_url','foreign_landing_url','url','duration','filetype']}
                for item in data.get('results',[]) if item.get('license')=='cc0']
        results.append({'query':query,'results':values})
    except Exception as error:
        results.append({'query':query,'error':str(error)})
path=pathlib.Path(__file__).resolve().parents[1]/'busqueda_extra.json'
path.write_text(json.dumps(results,indent=2),encoding='utf8')
print(json.dumps(results,indent=2))

import concurrent.futures
from html.parser import HTMLParser
import urllib.request
from urllib.parse import urljoin

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.items=[]
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            item=dict(attrs)
            if 'href' in item: self.items.append(item['href'])

pages=['https://kenney.nl/assets/'+slug for slug in
       ['rpg-audio','impact-sounds','interface-sounds','digital-audio']]
pages.append('https://opengameart.org/content/100-cc0-sfx-2')
def discover(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    html=urllib.request.urlopen(req,timeout=40).read().decode()
    assert 'cc0' in html.lower()
    parser=Links(); parser.feed(html)
    links=[urljoin(url,item) for item in parser.items if '.zip' in item.lower() or 'download' in item.lower()]
    return {'source':url,'downloads':list(dict.fromkeys(links))}
if __name__=='__main__':
    import json
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for item in pool.map(discover,pages): print(json.dumps(item))

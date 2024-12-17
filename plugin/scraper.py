import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.pornpics.com"
session = requests.Session()

def get_galleries(query, aspect='both', limit=50, offset=0):
    url = f"{BASE_URL}/search/srch.php"
    resp = session.get(url, params={'q': query, 'limit': limit, 'offset': offset, 'lang': 'en'}).json()
    imgs = list(map(lambda i: {
        'name': i['desc'],
        'url': i['t_url_460'],
        'url_hd':  i['t_url_460'].replace("cdni.pornpics.com/460", "cdni.pornpics.com/1280"),
        'set_url': i['g_url'],
        'aspect_ratio': 300 / int(i['h'])
    }, resp))
    if aspect != 'both':
        imgs = [img for img in imgs if filter_aspect_ratio(img, aspect)]
    return imgs

def get_set(set_url, aspect='both'):
    res = session.get(set_url)
    soup = BeautifulSoup(res.text, 'html.parser')
    img_eles = soup.select('.thumbwook img')
    imgs = [{
        'name': img_ele['alt'],
            'url': img_ele.parent['href'],
            'url_hd': img_ele.parent['href'].replace("cdni.pornpics.com/460", "cdni.pornpics.com/1280"),
            'set_url': set_url,
            'aspect_ratio': 300 / int(img_ele['height'])
            } for img_ele in img_eles]
    if aspect != 'both':
        imgs = [img for img in imgs if filter_aspect_ratio(img, aspect)]
    return {
        'description': soup.select_one('.title-section h1').text,
        'images': imgs
    }
    

def filter_aspect_ratio(img, aspect='landscape'):
    if aspect == 'vertical':
        return img['aspect_ratio'] < 1
    else:
        return img['aspect_ratio'] > 1
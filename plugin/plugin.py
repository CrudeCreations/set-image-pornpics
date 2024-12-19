import json
import sys
import random

import log
from stash import StashInterface
import scraper

def main():
    input = None
    if len(sys.argv) < 2:
        input = readJSONInput()
        match input['args']['mode']:
            case "getGalleries":
                log.LogDebug("Getting galleries: {log_message}".format(log_message=json.dumps(input['args'])))
                writeJSONOutput({
                    "images":scraper.get_galleries(input['args']['query'], offset=input['args']['offset'])
                })
            case "getSet":
                log.LogDebug("Getting set: {log_message}".format(log_message=json.dumps(input['args'])))
                writeJSONOutput(scraper.get_set(input['args']['set_url']))
            case "saveImage":
                id = input['args']['id']
                item_type = input['args']['item_type']
                img_src = input['args']['img_src']
                is_front_img = input['args']['is_front_img']
                
                log.LogDebug("Saving image: {log_message}".format(log_message=json.dumps(input['args'])))
                writeJSONOutput(saveCover(id, item_type, img_src, is_front_img, input['server_connection']))
            case "setTags":
                log.LogInfo("Setting random image for blank tags")
                log.LogDebug(json.dumps(input['args']))
                setTags(input['server_connection'])
                
                
def setTags(server_connection):
    client = StashInterface(server_connection)
    tags = client.getDefaultImageTags()
    log.LogInfo("Updating {count} tags".format(count = len(tags)))
    progress = 0
    tags = [tags[0]] # Only test one tag at a time for now
    for tag in tags:
        log.LogDebug("Searching for: {tag}".format(tag = json.dumps(tag)))
        queries = [tag['name']] + tag['aliases']
        for query in queries:
            images = scraper.get_galleries(query, offset=0, limit=200)
            if len(images): continue
        if len(images) > 0:
            client.saveTagCover(tag['id'], random.choice(images)['url_hd'])
        else:    
            log.LogDebug("Found no galleries for: {name} (and aliases)".format(name=tag['name']))
        progress += 1
        log.LogProgress(float(progress) / len(tags))
        
            
                

def saveCover(id, item_type, img_src, is_front_img, server_connection):
    client = StashInterface(server_connection)
    match item_type:
        case "scene":
            return client.saveSceneCover(id, img_src)
        case "tag":
            return client.saveTagCover(id, img_src)
        case "performer":
            return client.savePerformerCover(id, img_src)
        case "group":
            return client.saveGroupCover(id, img_src, is_front_img)
                
                
def writeJSONOutput(d):
    print(json.dumps({
        "Output": d
    }) + "\n")

def readJSONInput():
    input = sys.stdin.read()
    return json.loads(input)

main()
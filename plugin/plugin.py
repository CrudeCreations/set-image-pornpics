import json
import sys

import log
from stash import StashInterface
import scraper

def main():
    input = None
    if len(sys.argv) < 2:
        input = readJSONInput()
        # log.LogDebug("Raw input: %s" % json.dumps(input))
        match input['args']['mode']:
            case "getGalleries":
                writeJSONOutput({
                    "images":scraper.get_galleries(input['args']['query'], offset=input['args']['offset'])
                })
            case "getSet":
                writeJSONOutput(scraper.get_set(input['args']['set_url']))
            case "saveImage":
                writeJSONOutput(saveCover(input['args']['id'], input['args']['item_type'], input['args']['img_src'], input['server_connection']))

def saveCover(id, item_type, img_src, server_connection):
    client = StashInterface(server_connection)
    match item_type:
        case "scene":
            return client.saveSceneCover(id, img_src)
        case "tag":
            return client.saveTagCover(id, img_src)
                
                
def writeJSONOutput(d):
    print(json.dumps({
        "Output": d
    }) + "\n")

def readJSONInput():
    input = sys.stdin.read()
    return json.loads(input)

main()
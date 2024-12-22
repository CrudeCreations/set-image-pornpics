import requests
import log


class StashInterface:
    port = ""
    url = ""
    headers = {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Connection": "keep-alive",
        "DNT": "1"
    }
    
    def __init__(self, conn):
        self.port = conn['Port']
        scheme = conn['Scheme']
        host = conn['Host']
        self.url = scheme + "://" + host + ":" + str(self.port) + "/graphql"
        self.cookies = {
            'session': conn.get('SessionCookie').get('Value')
        }
    
    def __callGraphQL(self, query, variables = None):
        json = {}
        json['query'] = query
        if variables != None:
            json['variables'] = variables
        
        response = requests.post(self.url, json=json, headers=self.headers, cookies=self.cookies)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("error", None):
                for error in result["error"]["errors"]:
                    raise Exception("GraphQL error: {}".format(error))
            if result.get("data", None):
                return result.get("data")
        else:
            raise Exception("GraphQL query failed:{} - {}. Query: {}. Variables: {}".format(response.status_code, response.content, query, variables))
    
    def saveSceneCover(self, id, img_src):
        query = """
mutation setSceneCover($id:ID!,$imgSrc:String!) {
  sceneUpdate(
    input: {
      id:$id,
      cover_image:$imgSrc
    }
  ){
    id,
    paths {
      screenshot
    }
  }
}
        """
        variables = {
          'id': id,
          'imgSrc': img_src
        }
        result = self.__callGraphQL(query, variables)
        return result['sceneUpdate']
      
    def saveTagCover(self, id, img_src):
        query = """
mutation setTagCover($id:ID!,$imgSrc:String!) {
  tagUpdate(
    input: {
      id:$id,
      image:$imgSrc
    }
  ){
    id,
    image_path
  }
}
        """
        variables = {
			    'id': id,
          'imgSrc': img_src
		    }
        result = self.__callGraphQL(query, variables)
        return result['tagUpdate']
      
    def savePerformerCover(self, id, img_src):
        query = """
mutation setPerformerCover($id:ID!,$imgSrc:String!) {
  performerUpdate(
    input: {
      id:$id,
      image:$imgSrc
    }
  ){
    id,
    image_path
  }
}
        """
        variables = {
			    'id': id,
          'imgSrc': img_src
		    }
        result = self.__callGraphQL(query, variables)
        return result['performerUpdate']
        
    def saveGroupCover(self, id, img_src, is_front_img):
        query = """
mutation setGroupCover($id:ID!,$imgSrc:String!) {
  groupUpdate(
    input: {
      id:$id,
      {image_path}:$imgSrc
    }
  ){
    id,
    front_image_path,
    back_image_path
  }
}
        """.replace("{image_path}", "front_image" if is_front_img else "back_image")
        variables = {
			    'id': id,
          'imgSrc': img_src
		    }
        result = self.__callGraphQL(query, variables)
        return result['groupUpdate']
      
    def getDefaultImageTags(self):
        query = """
{
	allTags {
    id,
    name,
    aliases,
    image_path
  }
}
        """
        result = self.__callGraphQL(query)
        return [tag for tag in result['allTags'] if "&default=true" in tag['image_path']]
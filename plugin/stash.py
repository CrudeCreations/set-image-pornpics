import requests


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
        self.url = scheme + "://localhost:" + str(self.port) + "/graphql"
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
    
    def saveSceneCover(self, id, imgSrc):
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
          'imgSrc': imgSrc
        }
        result = self.__callGraphQL(query, variables)
        return result['sceneUpdate']
      
    def saveTagCover(self, id, imgSrc):
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
          'imgSrc': imgSrc
		    }
        result = self.__callGraphQL(query, variables)
        return result['tagUpdate']
        
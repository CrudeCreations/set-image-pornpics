import { ApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { IPluginApi, PornPicsImage, SAVE_MODE } from "../types";

export class StashClient {
  client: ApolloClient<object>;
  constructor(stashService: IPluginApi["utils"]["StashService"]) {
    this.client = stashService.getClient() as ApolloClient<object>;
  }

  public async getSceneData(
    id: string
  ): Promise<{ title: string; id: string; paths: { screenshot: string } }> {
    const resp = await this.client.query({
      variables: { id },
      query: gql`
        query getSceneById($id: ID!) {
          findScene(id: $id) {
            title
            id
            paths {
              screenshot
            }
          }
        }
      `,
    });
    return resp.data.findScene;
  }

  public async getGalleries(
    query: string,
    offset: number
  ): Promise<{ images: PornPicsImage[] }> {
    const resp = await this.client.mutate({
      variables: { query, offset },
      mutation: gql`
        mutation GetGalleries($query: String!, $offset: Int!) {
          runPluginOperation(
            plugin_id: "set-image-pornpics"
            args: { mode: "getGalleries", query: $query, offset: $offset }
          )
        }
      `,
    });
    return resp.data.runPluginOperation;
  }

  public async saveImage(
    id: string,
    imageSrc: string,
    saveMode: SAVE_MODE
  ): Promise<any> {
    const resp = await this.client.mutate({
      variables: { id, imageSrc, saveMode },
      mutation: gql`
        mutation SaveImage($id: Int!, $imageSrc: String!, $saveMode: Int!) {
          runPluginOperation(
            plugin_id: "set-image-pornpics"
            args: {
              mode: "saveImage"
              img_src: $imageSrc
              save_mode: $saveMode
              scene_id: $id
            }
          )
        }
      `,
    });
    return resp.data.runPluginOperation.paths.screenshot;
  }

  public async getSet(
    setUrl: string
  ): Promise<{ description: string; images: PornPicsImage[] }> {
    const resp = await this.client.mutate({
      variables: { setUrl },
      mutation: gql`
        mutation GetSet($setUrl: String!) {
          runPluginOperation(
            plugin_id: "set-image-pornpics"
            args: { mode: "getSet", set_url: $setUrl }
          )
        }
      `,
    });
    return resp.data.runPluginOperation;
  }
}

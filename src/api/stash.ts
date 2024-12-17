import { ApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { IPluginApi, ITEM_TYPE, PornPicsImage } from "../types";

export class StashClient {
  client: ApolloClient<object>;
  constructor(stashService: IPluginApi["utils"]["StashService"]) {
    this.client = stashService.getClient() as ApolloClient<object>;
  }

  public async getGroupData(
    id: string
  ): Promise<{
    id: string;
    name: string;
    front_image_path: string;
    back_image_path: string;
  }> {
    const resp = await this.client.query({
      variables: { id },
      query: gql`
        query getGroupById($id: ID!) {
          findGroup(id: $id) {
            id
            name
            front_image_path
            back_image_path
          }
        }
      `,
    });
    return resp.data.findGroup;
  }

  public async getPerformerData(
    id: string
  ): Promise<{ id: string; name: string; image_path: string }> {
    const resp = await this.client.query({
      variables: { id },
      query: gql`
        query getPerformerById($id: ID!) {
          findPerformer(id: $id) {
            id
            name
            image_path
          }
        }
      `,
    });
    return resp.data.findPerformer;
  }

  public async getTagData(
    id: string
  ): Promise<{ id: string; name: string; image_path: string }> {
    const resp = await this.client.query({
      variables: { id },
      query: gql`
        query getTagById($id: ID!) {
          findTag(id: $id) {
            id
            name
            image_path
          }
        }
      `,
    });
    return resp.data.findTag;
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
    itemType: ITEM_TYPE
  ): Promise<any> {
    const resp = await this.client.mutate({
      variables: { id, imageSrc, itemType },
      mutation: gql`
        mutation SaveImage($id: Int!, $imageSrc: String!, $itemType: String!) {
          runPluginOperation(
            plugin_id: "set-image-pornpics"
            args: {
              mode: "saveImage"
              img_src: $imageSrc
              item_type: $itemType
              id: $id
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

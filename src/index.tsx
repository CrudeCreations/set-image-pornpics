import gql from "graphql-tag";

import { asyncTimeout, matchLocation, getSetImageComponents } from "./utils";

interface IPluginApi {
  //@ts-expect-error
  React: typeof React;
  //@ts-expect-error
  ReactDOM: typeof ReactDOM;
  GQL: any;
  Event: {
    addEventListener: (
      event: string,
      callback: (e: CustomEvent) => void
    ) => void;
  };
  libraries: {
    ReactRouterDOM: {
      Link: React.FC<any>;
      Route: React.FC<any>;
      NavLink: React.FC<any>;
    };
    Bootstrap: Record<string, React.FC<any>>;
    FontAwesomeSolid: {
      faEthernet: any;
    };
    Intl: {
      FormattedMessage: React.FC<any>;
    };
  };
  loadableComponents: any;
  components: Record<string, React.FC<any>>;
  utils: {
    NavUtils: any;
    loadComponents: any;
    StashService: any;
  };
  hooks: any;
  patch: {
    before: (target: string, fn: Function) => void;
    instead: (target: string, fn: Function) => void;
    after: (target: string, fn: Function) => void;
  };
  register: {
    route: (path: string, component: React.FC<any>) => void;
  };
}

interface PornPicsImage {
  aspect_ratio: number;
  name: string;
  set_url: string;
  url: string;
  url_hd: string;
}

(function () {
  enum DIALOG_MODE {
    GALLERY,
    SET,
  }
  enum SAVE_MODE {
    URL,
    FILE,
  }
  const {
    React,
    ReactDOM,
    libraries,
    Event,
    utils: { StashService },
  } = (window as any).PluginApi as IPluginApi;
  const {
    Button,
    Modal,
    ModalTitle,
    ModalBody,
    Container,
    Row,
    Col,
    Card,
    CardImg,
  } = libraries.Bootstrap;
  const { useState, useEffect, useRef } = React;
  const client = StashService.getClient();
  const PornpicsButton = ({
    itemData,
  }: {
    itemData: { id: string; title: string; cover: string };
  }) => {
    const saveMode = SAVE_MODE.URL;
    const dialogScrollContainer = useRef();
    const [mode, setMode] = useState(DIALOG_MODE.GALLERY);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [queryState, setQueryState] = useState({
      query: itemData.title,
      offset: 0,
    });
    const [lastScroll, setLastScroll] = useState(0);
    const openDialog = () => setShowDialog(true);
    const closeDialog = () => setShowDialog(false);
    const [galleryData, setGalleryData] = useState<PornPicsImage[]>([]);
    const [imageData, setImageData] = useState<PornPicsImage[]>([]);

    useEffect(() => {
      setLoading(true);
      queryState.offset == 0 && setGalleryData([]);
      getGalleries(queryState.query, queryState.offset)
        .then((data) =>
          setGalleryData(
            queryState.offset > 0
              ? [...galleryData, ...data.images]
              : data.images
          )
        )
        .finally(() => setLoading(false));
    }, [queryState]);

    useEffect(() => {
      mode == DIALOG_MODE.GALLERY &&
        setTimeout(
          () =>
            //@ts-expect-error
            dialogScrollContainer.current?.scrollTo({
              top: lastScroll,
            }),
          10
        );
    }, [mode]);

    const handleScroll = (e: any) => {
      if (
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <
          10 &&
        mode == DIALOG_MODE.GALLERY
      )
        setQueryState({ ...queryState, offset: galleryData.length });
    };

    const handleGallerySelect = async (img: PornPicsImage) => {
      setMode(DIALOG_MODE.SET);
      //@ts-expect-error
      setLastScroll(dialogScrollContainer.current?.scrollTop);
      //@ts-expect-error
      dialogScrollContainer.current?.scrollTo({
        top: 0,
      });
      setLoading(true);
      setImageData([]);
      const data = await getSet(img.set_url);
      setLoading(false);
      setImageData(data.images);
    };

    const handleImageSelect = async (img: PornPicsImage) => {
      await saveImage(itemData.id, img.url_hd, saveMode);
      closeDialog();
    };

    const getActiveImages = () =>
      mode == DIALOG_MODE.GALLERY ? galleryData : imageData;

    return (
      <>
        <Button
          variant="secondary"
          class="pornpics-button"
          onClick={openDialog}
        >
          <span>Search PornPics...</span>
        </Button>
        <Modal show={showDialog} onHide={closeDialog}>
          <ModalTitle closeButton>
            {mode == DIALOG_MODE.GALLERY
              ? "Select a gallery"
              : "Select an image"}
          </ModalTitle>
          <ModalBody onScroll={handleScroll} ref={dialogScrollContainer}>
            <Container>
              <Row className="p-2 d-flex justify-content-center">
                <input
                  id="pornpics-button-input"
                  placeholder="Search..."
                  value={queryState.query}
                  onChange={(e: any) =>
                    setQueryState({ query: e.target.value, offset: 0 })
                  }
                />
              </Row>
              {mode == DIALOG_MODE.SET && (
                <Row className="p-2 d-flex justify-content-start">
                  <Button
                    variant="secondary"
                    onClick={() => setMode(DIALOG_MODE.GALLERY)}
                  >
                    Back
                  </Button>
                </Row>
              )}
              <Row className="p-2 d-flex justify-content-center">
                {getActiveImages().length > 0 && (
                  <Row xs="2">
                    {getActiveImages().map((img) => (
                      <Col>
                        <Card
                          className="hover-grow p-0"
                          onClick={() =>
                            mode == DIALOG_MODE.GALLERY
                              ? handleGallerySelect(img)
                              : handleImageSelect(img)
                          }
                        >
                          <CardImg
                            src={img.url}
                            alt={img.name}
                            style={{ width: "100%" }}
                          />
                          {mode == DIALOG_MODE.GALLERY && (
                            <h6>
                              {img.name.split(" ").slice(0, -1).join(" ")}
                            </h6>
                          )}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
                {loading && (
                  <div className="my-2 spinner-grow">
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </Row>
            </Container>
          </ModalBody>
        </Modal>
      </>
    );
  };

  const startAddon = async (path: string) => {
    if (!matchLocation(path)) return;
    await asyncTimeout(100); //Yes super hacky, will replace with wait for selector
    const id = window.location.href.split("/").pop()?.split("?")[0];
    if (!id) return;
    const itemData = await getSceneData(id);
    const injectButtons = () => {
      const setImageButtons = getSetImageComponents();
      setImageButtons.forEach((button) => injectButton(button, itemData));
    };

    const editButton = document.querySelector("edit-btn.btn-primary");
    const editTab = document.querySelector('a[data-rb-event-key*="edit-panel"');
    editButton?.addEventListener("click", () =>
      asyncTimeout(100).then(injectButtons)
    );
    editTab?.addEventListener("click", () =>
      asyncTimeout(100).then(injectButtons)
    );
  };

  const injectButton = (button: HTMLElement, itemData: any) => {
    if (button.parentElement?.querySelector(".pornpics-button")) return;
    const renderButton = document.createElement("div");
    button.parentElement?.appendChild(renderButton);
    // Have to use render because createRoot is not exposed...
    ReactDOM.render(<PornpicsButton itemData={itemData} />, renderButton);
  };

  const getSceneData = async (id: string) => {
    const resp = await client.query({
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
  };

  const getGalleries = async (
    query: string,
    offset: number
  ): Promise<{ images: PornPicsImage[] }> => {
    const resp = await client.mutate({
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
  };

  const getSet = async (
    setUrl: string
  ): Promise<{ description: string; images: PornPicsImage[] }> => {
    const resp = await client.mutate({
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
  };

  const saveImage = async (
    id: string,
    imageSrc: string,
    saveMode: SAVE_MODE
  ): Promise<any> => {
    const resp = await client.mutate({
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
    document
      .querySelector(".scene-cover")
      ?.setAttribute("src", resp.data.runPluginOperation.paths.screenshot);
    (document.querySelector(".vjs-poster") as HTMLElement).style.backgroundImage = `url("${resp.data.runPluginOperation.paths.screenshot}")`;
  };

  Event.addEventListener("stash:location", (e) =>
    startAddon(e.detail.data.location.pathname)
  );
  asyncTimeout(100).then(() => startAddon(window.location.pathname));
})();

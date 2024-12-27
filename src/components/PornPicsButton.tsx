import { StashClient } from "../api/stash";
import { PornPicsImage, DIALOG_MODE, ItemData, ITEM_TYPE } from "../types";
import { useDebounce } from "../utils";
const React = window.PluginApi.React;
const { useState, useEffect, useRef } = React;
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
} = window.PluginApi.libraries.Bootstrap;

export interface PornPicsButtonProps {
  itemData: ItemData;
  client: StashClient;
}

export const PornPicsButton = ({
  itemData,
  client,
}: PornPicsButtonProps) => {
  const dialogScrollContainer = useRef();
  const [mode, setMode] = useState(DIALOG_MODE.GALLERY);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [query, setQuery] = useState(itemData.title);
  const [offset, setOffset] = useState(0);
  const debouncedQuery = useDebounce(query, 500);
  const [lastScroll, setLastScroll] = useState(0);
  const [isFrontImage, setIsFrontImage] = useState(itemData.type == ITEM_TYPE.GROUP);
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);
  const [galleryData, setGalleryData] = useState<PornPicsImage[]>([]);
  const [imageData, setImageData] = useState<PornPicsImage[]>([]);

  useEffect(() => {
    setLoading(true);
    if (debouncedQuery != query) {
      setOffset(0);
      return setGalleryData([]);
    }

    client
      .getGalleries(query, offset)
      .then((data) => setGalleryData([...galleryData, ...data.images]))
      .finally(() => setLoading(false));
  }, [query, offset]);

  useEffect(() => {
    client
      .getGalleries(debouncedQuery, offset)
      .then((data) => setGalleryData(data.images))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

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
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10 &&
      mode == DIALOG_MODE.GALLERY
    )
      setOffset(galleryData.length);
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
    const data = await client.getSet(img.set_url);
    setLoading(false);
    setImageData(data.images);
  };

  const handleImageSelect = async (img: PornPicsImage) => {
    await client.saveImage(
      itemData.id,
      img.url_hd,
      itemData.type,
      isFrontImage
    );
    // This is a super lazy method of forcing a state refresh on everything
    window.PluginApi.utils.StashService.evictQueries(
      window.PluginApi.utils.StashService.getClient().cache,
      [...Object.keys(window.PluginApi.GQL)]
        .filter((k) => k.indexOf("Find") == 0)
        .map((k) => window.PluginApi.GQL[k])
    );
    closeDialog();
  };
  const getActiveImages = () =>
    mode == DIALOG_MODE.GALLERY ? galleryData : imageData;

  return (
    <>
      <Button
        variant="secondary"
        className="pornpics-button"
        onClick={openDialog}
      >
        <span>Set Cover</span>
      </Button>
      <Modal show={showDialog} onHide={closeDialog}>
        <ModalTitle closeButton>
          {mode == DIALOG_MODE.GALLERY ? "Select a gallery" : "Select an image"}
        </ModalTitle>
        <ModalBody onScroll={handleScroll} ref={dialogScrollContainer}>
          <Container>
            <Row className="p-2 d-flex justify-content-center">
              <input
                id="pornpics-button-input"
                placeholder="Search..."
                value={query}
                onChange={(e: any) => setQuery(e.target.value)}
              />
            </Row>
            {itemData.type == ITEM_TYPE.GROUP && <Row className="p-2 d-flex justify-content-center">
                <Button variant="secondary" onClick={() => setIsFrontImage(!isFrontImage)}>
                  {isFrontImage ? "Front Cover" : "Back Cover"}
                </Button>
              </Row>}
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
              {getActiveImages()?.length > 0 && (
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
                          <h6>{img.name.split(" ").slice(0, -1).join(" ")}</h6>
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

export default PornPicsButton;

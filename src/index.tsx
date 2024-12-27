import { StashClient } from "./api/stash";
import { PornPicsButton } from "./components/PornPicsButton";
import { ITEM_TYPE, ItemData } from "./types";
import { asyncTimeout, matchLocation, getItemId, getItemType } from "./utils";

const INJECTED_ROUTES = ["groups", "performers", "tags"];

(function () {
  const {
    React,
    ReactDOM,
    Event,
    utils: { StashService },
  } = window.PluginApi;

  const client = new StashClient(StashService);
  const startAddon = async (path: string) => {
    const loc = matchLocation(path, INJECTED_ROUTES);
    if (!loc) return;

    await asyncTimeout(100); //Yes super hacky, will replace with wait for selector
    const config = await client.getPluginConfig("set-image-pornpics");
    if (config.show_edit_group != true && loc == "groups") {
      return;
    }
    const id = getItemId();
    const itemType = getItemType();
    const itemData = await getItemData(id, itemType);
    const editButtons = [
      document.querySelector(".edit.btn.btn-primary"),
      document.querySelector('a[data-rb-event-key*="edit-panel"'),
    ];
    editButtons.forEach((button) => {
      button && injectButton(button as HTMLElement, itemData);
    });
  };

  const injectButton = (button: HTMLElement, itemData: ItemData) => {
    const renderClass = "pornpics-btn-wrapper";
    let renderButton = button.parentNode?.querySelector(`.${renderClass}`);
    if (!renderButton) {
      renderButton = document.createElement("div");
      renderButton.className = renderClass;
    }
    button.parentNode?.insertBefore(renderButton, button.nextSibling);
    // Have to use render because createRoot is not exposed...
    ReactDOM.render(
      <PornPicsButton itemData={itemData} client={client} />,
      renderButton
    );
  };

  const getItemData = async (
    itemId: string,
    itemType: ITEM_TYPE
  ): Promise<ItemData> => {
    switch (itemType) {
      case ITEM_TYPE.TAG:
      case ITEM_TYPE.PERFORMER: {
        const { id, name, image_path } =
          itemType == ITEM_TYPE.TAG
            ? await client.getTagData(itemId)
            : await client.getPerformerData(itemId);
        return { id, title: name, cover: image_path, type: itemType };
      }
      case ITEM_TYPE.GROUP: {
        const { id, name, front_image_path } = await client.getGroupData(
          itemId
        );
        return { id, title: name, cover: front_image_path, type: itemType };
      }
      default:
        throw new Error(`Invalid item type: ${itemType}`);
    }
  };

  Event.addEventListener("stash:location", (e) => {
    startAddon(e.detail.data.location.pathname);
  });
  asyncTimeout(100).then(() => startAddon(window.location.pathname));
})();

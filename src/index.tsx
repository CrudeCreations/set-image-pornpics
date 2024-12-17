import { StashClient } from "./api/stash";
import { PicsButton } from "./components/PicsButton";
import { asyncTimeout, matchLocation, getSetImageComponents } from "./utils";

const INJECTED_ROUTES = ["groups", "scenes", "performers", "tags"];

const TARGET_SELECTORS = [
  ".details-edit > button.btn-secondary",
  "#scene-edit-details .scene-cover + button.btn-secondary",
];

const TARGET_TEXT = ["front image", "back image", "set image"];

(function () {
  const {
    React,
    ReactDOM,
    Event,
    utils: { StashService },
  } = window.PluginApi;
  const client = new StashClient(StashService);
  const startAddon = async (path: string) => {
    if (!matchLocation(path, INJECTED_ROUTES)) return;
    await asyncTimeout(100); //Yes super hacky, will replace with wait for selector
    const id = window.location.href.split("/").pop()?.split("?")[0];
    if (!id) return;
    const itemData = await client.getSceneData(id);
    const injectButtons = () => {
      const setImageButtons = getSetImageComponents(
        TARGET_SELECTORS,
        TARGET_TEXT
      );
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
    ReactDOM.render(
      <PicsButton itemData={itemData} client={client} />,
      renderButton
    );
  };

  Event.addEventListener("stash:location", (e) =>
    startAddon(e.detail.data.location.pathname)
  );
  asyncTimeout(100).then(() => startAddon(window.location.pathname));
})();

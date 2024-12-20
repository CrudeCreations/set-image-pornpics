import { ITEM_TYPE, ItemData } from "../types";

export const asyncTimeout = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const matchLocation = (
  route: string,
  patterns: string[]
): string | undefined => {
  const paths = route.split("/").slice(1);
  if (paths.length < 2) return;
  return patterns.find(
    (pattern) => paths[0] === pattern && Number.isInteger(parseInt(paths[1]))
  );
};

export const getSetImageComponents = (
  targetSelectors: string[],
  targetText: string[]
): HTMLElement[] => {
  let matchedElements: HTMLElement[] = [];

  targetSelectors.forEach((selector) => {
    const targetElements = document.querySelectorAll(selector);
    targetElements.forEach((element) => {
      if (
        targetText.some(
          (t) =>
            element.textContent &&
            element.textContent?.toLowerCase().indexOf(t) > -1
        )
      ) {
        matchedElements.push(element as HTMLElement);
      }
    });
  });

  return matchedElements;
};

export const getItemId = (): string => {
  const id = window.location.href.split("/").at(4)?.split("?")[0];
  if (!id)
    throw new Error(
      `Item id cannot be determined from "${window.location.href}"`
    );
  return id;
};

export const getItemType = (): ITEM_TYPE => {
  const itemString = window.location.href.split("/").at(3)?.split("?")[0];
  switch (itemString) {
    case "scenes":
      return ITEM_TYPE.SCENE;
    case "tags":
      return ITEM_TYPE.TAG;
    case "groups":
      return ITEM_TYPE.GROUP;
    case "performers":
      return ITEM_TYPE.PERFORMER;
    default:
      throw new Error(
        `Item Type cannot be determined from "${window.location.href}"`
      );
  }
};

export const getImageSelectors = (
  itemData: ItemData,
  isFrontImage: boolean
): string[] => {
  switch (itemData.type) {
    case ITEM_TYPE.SCENE:
      return [".scene-cover"];
    case ITEM_TYPE.TAG:
      return [".logo", `.tag-card-image[src*="tag/${itemData.id}/image"]`];
    case ITEM_TYPE.PERFORMER:
      return [".performer"];
    case ITEM_TYPE.GROUP:
      return [`img[alt="${isFrontImage ? "Front Cover" : "Back Cover"}"]`];
    default:
      return [];
  }
};

export const useDebounce = (value: any, delay: number) => {
  const { React } = window.PluginApi;
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

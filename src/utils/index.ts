import { ITEM_TYPE } from "../types";

export const asyncTimeout = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const matchLocation = (route: string, patterns: string[]): boolean => {
  const paths = route.split("/").slice(1);
  return (
    paths.length > 1 &&
    patterns.some(
      (pattern) => paths[0] === pattern && Number.isInteger(parseInt(paths[1]))
    )
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
  const id = window.location.href.split("/").at(-1)?.split("?")[0];
  if (!id) throw new Error(`Item id cannot be determined from "${window.location.href}"`);
  return id;
}

export const getItemType = (): ITEM_TYPE => {
  const itemString = window.location.href.split("/").at(-2);
  switch (itemString) {
    case "scenes":
      return ITEM_TYPE.SCENE;
    case "tags":
      return ITEM_TYPE.SCENE;
    case "groups":
      return ITEM_TYPE.GROUP;
    case "performers":
      return ITEM_TYPE.PERFORMER;
    default:
      throw new Error(`Item Type cannot be determined from "${window.location.href}"`)
  }
}
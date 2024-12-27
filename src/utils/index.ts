import type { DocumentNode } from "@apollo/client";
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

export const waitForElement = async (selector: string, maxAttempts = 10):Promise<Element | undefined> => {
  for(let i = 0; i < maxAttempts; i++) {
    var el = document.querySelector(selector);
    if(el) return el;
    await asyncTimeout(100);
  }
  return;
}

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

// TODO: Figure out exact queries to evict
// export const getTargetQueries = (itemData: ItemData): DocumentNode[] => {
//   switch (itemData.type) {
//     case ITEM_TYPE.TAG:
//       return [window.PluginApi.GQL.FindTagsDocument, window.PluginApi.GQL.FindTagDocument];
//     case ITEM_TYPE.PERFORMER:
//       return [window.PluginApi.GQL.FindPerformersDocument, window.PluginApi.GQL.FindPerformerDocument];
//     case ITEM_TYPE.GROUP:
//       return [window.PluginApi.GQL.FindGroupsDocument, window.PluginApi.GQL.FindGroupDocument];
//     default:
//       return [];
//   }
// }

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

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

const INJECTED_ROUTES = [
    "groups",
    "scenes",
    "performers",
    "tags"
]

const TARGET_SELECTORS = [
    ".details-edit > button.btn-secondary",
    "#scene-edit-details .scene-cover + button.btn-secondary"
]

const TARGET_TEXT = [
    "front image...",
    "back image...",
    "set image..."
]

export const matchLocation = (route: string) => {
    const paths = route.split("/").slice(1);
    return paths.length > 1 && INJECTED_ROUTES.some(pattern => paths[0] == pattern && Number.isInteger(parseInt(paths[1])));
};

export const getSetImageComponents = () => {
    let matchedElements:HTMLElement[] = [];

    TARGET_SELECTORS.forEach((selector) => {
        const targetElements = document.querySelectorAll(selector);
        targetElements.forEach((element) => {
            TARGET_TEXT.some(t => element.textContent?.indexOf(t) || -1 > -1) &&
                matchedElements.push(element as HTMLElement);
        });
    });

    return matchedElements;
}

export const asyncTimeout = async(ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
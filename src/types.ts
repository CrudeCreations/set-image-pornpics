declare global {
  interface Window {
    PluginApi: IPluginApi;
  }
}

export interface IPluginApi {
  React: typeof React;
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

export interface PornPicsImage {
  aspect_ratio: number;
  name: string;
  set_url: string;
  url: string;
  url_hd: string;
}

export interface ItemData {
  id: string;
  title: string;
  cover: string;
  type: ITEM_TYPE;
}

export enum DIALOG_MODE {
  GALLERY,
  SET,
}

export enum ITEM_TYPE {
  SCENE="scene",
  GROUP="group",
  PERFORMER="performer",
  TAG="tag",
}

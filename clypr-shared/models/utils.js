// @flow

/** A simple observable object to unsubscribe for it. */
export interface Observable {
  unsubscribe(): void;
}

/** Common interface for a navigation service, implemented differently by each platform. */
export interface NavigatorServiceInterface {
  static initializeBrowserHistory(): void;
  static initializeNativeHistory(navigation: any, router: any): void;
  static goTo(path: string, params?: ?Object, replace?: boolean): void;
  static goBack(): void;
}

/** Common interface for a shop's media service, implemented differently by each platform. */
export interface MediaServiceInterface {
  static pickDeviceMedia(): Promise<{
    success: boolean;
    urlHeader?: string;
    base64?: string;
  }>;

  static getUploadedMediaUrl(usage: 'avatar' | 'media', base64: string, fileName?: string): Promise<string>;
}

/** Common interface for a local storage service, implemented differently by each platform. */
export interface StorageServiceInterface {
  static read(key: string): Promise<any>;
  static save(key: string, data: any): Promise<boolean>;
  static reset(): Promise<boolean>;
}
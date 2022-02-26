export const ECSNEXT_SERVER_DEFAULT_URL = 'http://localhost:{}/tsp/api';
export const ECSNEXT_VIEWER_DEFAULT_PORT = 8080;

export const ECSNextServerUrlProvider = Symbol('ECSNextServerUrlProvider');
export interface EcsNextServerUrlProvider {
  /**
   * Get a promise that resolves once the Server URL is initialized.
   * @returns a new promise each time `.onDidChangeServerUrl` fires.
   */
  getServerUrlPromise(): Promise<string>;

  /**
   * Get the default Server URL from the server.
   * Will throw if called before initialization. See `getServerUrlPromise`
   * to get a promise to the value.
   */
  getServerUrl(): string;

  /**
   * Get notified when the Server URL changes.
   * @param listener function to be called when the url is changed.
   */
  onDidChangeServerUrl(listener: (url: string) => void): void;
}

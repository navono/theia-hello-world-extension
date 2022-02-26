import { ApplicationError } from '@theia/core';

export const ecsnextServerPath = '/services/theia-trace-extension/trace-server-config';
export const PortBusy = ApplicationError.declare(-32650, (code) => ({
  message: 'Port busy',
  data: { code },
}));

export interface StartServerOptions {
  path?: string;
  args?: string;
}

export const ECSNextServerConfigService = Symbol('ECSNextServerConfigService');
export interface ECSNextServerConfigService {
  /**
   * Spawn the server from a given path
   */
  startServer(options?: StartServerOptions): Promise<string>;

  /**
   * Stop the server
   */
  stopServer(): Promise<string>;
}

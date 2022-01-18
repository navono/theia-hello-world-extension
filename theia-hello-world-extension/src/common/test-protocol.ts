/* eslint-disable @typescript-eslint/no-redeclare */
export const testPath = '/services/Test123Event';

export const TestServer = Symbol('TestServer');

// import { Event } from '@theia/core/lib/common/event';
import { JsonRpcServer, JsonRpcProxy } from '@theia/core';
import { injectable, inject } from 'inversify';

export interface TestClient {
  uname: string;
  onChange(): void;
}
export interface TestServer extends JsonRpcServer<TestClient> {
  performAction(): Promise<number>;
}

export const TestServerProxy = Symbol('TestServerProxy');
export type TestServerProxy = JsonRpcProxy<TestServer>;

@injectable()
export class ReconnectingFileSystemWatcherServer implements TestServer {
  protected watcherSequence = 0;

  protected readonly watchParams = new Map<
    number,
    {
      uri: string;
    }
  >();

  protected readonly localToRemoteWatcher = new Map<number, number>();

  constructor(@inject(TestServerProxy) protected readonly proxy: TestServerProxy) {
    const onInitialized = this.proxy.onDidOpenConnection(() => {
      // skip reconnection on the first connection
      onInitialized.dispose();
      this.proxy.onDidOpenConnection(() => this.reconnect());
    });
  }

  protected reconnect(): void {
    for (const [watcher] of this.watchParams.entries()) {
      this.doWatchFileChanges(watcher);
    }
  }

  dispose(): void {
    this.proxy.dispose();
  }

  performAction(): Promise<number> {
    const watcher = this.watcherSequence++;
    this.watchParams.set(watcher, { uri: 'manju' });
    return this.doWatchFileChanges(watcher);
  }

  protected doWatchFileChanges(watcher: number): Promise<number> {
    return this.proxy.performAction().then((remote) => {
      this.localToRemoteWatcher.set(watcher, remote);
      return watcher;
    });
  }

  setClient(client: TestClient | any): void {
    console.log('----------ReconnectingFileSystemWatcherServer setclient-' + client.uname);
    this.proxy.setClient(client);
  }
}

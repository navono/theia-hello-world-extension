import { injectable } from '@theia/core/shared/inversify';
import { TestServer, TestClient, ReconnectingFileSystemWatcherServer } from '../../common/test-protocol';
import { JsonRpcProxyFactory } from '@theia/core';

/**
 * This class provides information on the device families and devices supported.
 */
@injectable()
export class TestServerImpl implements TestServer {
  onChange(): void {
    console.log('----------server side onchange----');
  }

  protected readonly proxyFactory = new JsonRpcProxyFactory<TestServer>();

  protected readonly remote = new ReconnectingFileSystemWatcherServer(this.proxyFactory.createProxy());

  client: TestClient | any;

  dispose(): void {
    console.log('dispse');
  }

  setClient(client: TestClient): Promise<void> {
    console.log('----------setclient----server---------'); //function not getting called
    this.client = client;
    return Promise.resolve();
  }

  performAction(): Promise<number> {
    console.log('performAction: in server');
    this.client.onChange(); //error:undefined client

    return Promise.resolve(1);
  }
}

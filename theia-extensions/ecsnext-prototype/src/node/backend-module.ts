(global as any).WebSocket = require('ws');
import { Application } from 'express';
import { createProxyServer } from 'http-proxy';
import { injectable, ContainerModule } from '@theia/core/shared/inversify';
import { BackendApplicationContribution } from '@theia/core/lib/node';

export default new ContainerModule((bind) => {
  bind<BackendApplicationContribution>(BackendApplicationContribution).to(ProxyServer);
});

const DEFAULT_LSP_PORT = 4000;
const DEFAULT_LSP_SERVER = '127.0.0.1';

function getPort(): number {
  const arg = process.argv.filter((argv) => argv.startsWith('--LSP_PORT='))[0];
  if (!arg) {
    return DEFAULT_LSP_PORT;
  } else {
    return Number.parseInt(arg.substring('--LSP_PORT='.length));
  }
}

function getServer(): string {
  const arg = process.argv.filter((argv) => argv.startsWith('--LSP_SERVER='))[0];
  if (!arg) {
    return DEFAULT_LSP_SERVER;
  } else {
    return arg.substring('--LSP_SERVER='.length);
  }
}

/**
 * Used to delegate all 'URDF' related requests to java backend
 */
@injectable()
class ProxyServer implements BackendApplicationContribution {
  configure?(app: Application) {
    const apiProxy = createProxyServer();
    app.all('/api/*', function (req, res) {
      apiProxy.web(req, res, { target: 'http://' + getServer() + ':' + getPort() });
    });
  }
}

/* eslint-disable @typescript-eslint/no-var-requires */
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';
import { ContainerModule, injectable } from '@theia/core/shared/inversify';
// import { BackendApplicationContribution } from '@theia/core/lib/node';
import { LocalizationRegistry, LocalizationContribution } from '@theia/core/lib/node/i18n/localization-contribution';
import { interfaces } from '@theia/core/shared/inversify';

import {
  BackendClient,
  HelloBackendWithClientService,
  HelloBackendService,
  HELLO_BACKEND_PATH,
  HELLO_BACKEND_WITH_CLIENT_PATH,
} from '../common/protocol';
import { HelloBackendWithClientServiceImpl } from './hello-backend-with-client-service';
import { HelloBackendServiceImpl } from './hello-backend-service';
// import { Theia3dViewFileServer } from './theia-3d-view-file-server';

@injectable()
export class CustomLocalizationContribution implements LocalizationContribution {
  async registerLocalizations(registry: LocalizationRegistry): Promise<void> {
    console.error('registerLocalizations');

    // Theia uses language codes, e.g. "de" for German
    registry.registerLocalizationFromRequire('en', require('../../../src/backend/data/i18n/nls.en.json'));
    registry.registerLocalizationFromRequire('zh-cn', require('../../../src/backend/data/i18n/nls.zh-cn.json'));
  }
}

export default new ContainerModule((bind: interfaces.Bind) => {
  console.error('backend ContainerModule');
  bind(CustomLocalizationContribution).toSelf().inSingletonScope();
  bind(LocalizationContribution).toService(CustomLocalizationContribution);

  bind(HelloBackendService).to(HelloBackendServiceImpl).inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(HELLO_BACKEND_PATH, () =>
          ctx.container.get<HelloBackendService>(HelloBackendService)
        )
    )
    .inSingletonScope();

  bind(HelloBackendWithClientService).to(HelloBackendWithClientServiceImpl).inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler<BackendClient>(HELLO_BACKEND_WITH_CLIENT_PATH, (client) => {
          const server = ctx.container.get<HelloBackendWithClientServiceImpl>(HelloBackendWithClientService);
          server.setClient(client);
          client.onDidCloseConnection(() => server.dispose());
          return server;
        })
    )
    .inSingletonScope();

  // bind(BackendApplicationContribution).to(Theia3dViewFileServer).inSingletonScope();
});

import { interfaces } from '@theia/core/shared/inversify';
import { ServereventWidget } from './serverevent-widget';
import { ServereventContribution } from './serverevent-contribution';
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
  WebSocketConnectionProvider,
} from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';
import { TestServer, testPath, ReconnectingFileSystemWatcherServer, TestServerProxy } from '../../common/test-protocol';
import { ViewCommandContribution } from './command-contribution';
import { CommandContribution } from '@theia/core/lib/common/command';

export const bindTestServerWidget = (bind: interfaces.Bind) => {
  bind(TestServerProxy).toDynamicValue((ctx) => WebSocketConnectionProvider.createProxy(ctx.container, testPath));
  bind(TestServer).to(ReconnectingFileSystemWatcherServer);
  bindViewContribution(bind, ServereventContribution);

  bind(FrontendApplicationContribution).toService(ServereventContribution);
  bind(ServereventWidget).toSelf().inSingletonScope();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: ServereventWidget.ID,
      createWidget: () => ctx.container.get<ServereventWidget>(ServereventWidget),
    }))
    .inSingletonScope();

  bind(CommandContribution).to(ViewCommandContribution).inSingletonScope();
};

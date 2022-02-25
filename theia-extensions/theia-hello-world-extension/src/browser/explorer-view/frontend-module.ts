import { interfaces, Container } from '@theia/core/shared/inversify';
import {
  WidgetFactory,
  OpenHandler,
  FrontendApplicationContribution,
  bindViewContribution,
} from '@theia/core/lib/browser';
import { CommandContribution } from '@theia/core/lib/common';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

import { ViewerToolbarContribution } from './viewer/viewer-toolbar-contribution';
import { ViewerWidget, ViewerWidgetOptions } from './viewer/viewer-widget';
import { ViewerContribution } from './viewer/viewer-contribution';

import { ExplorerContribution } from './explorer/explorer-contribution';
import { ExplorerWidget } from './explorer/explorer-widget';

export const bindExplorerAndView = (bind: interfaces.Bind) => {
  bind(ViewerToolbarContribution).toSelf().inSingletonScope();
  bind(FrontendApplicationContribution).toService(ViewerToolbarContribution);
  bind(TabBarToolbarContribution).toService(ViewerToolbarContribution);
  bind(CommandContribution).toService(ViewerToolbarContribution);

  bind(ViewerWidget).toSelf();
  bind<WidgetFactory>(WidgetFactory)
    .toDynamicValue((context) => ({
      id: ViewerWidget.ID,
      async createWidget(options: ViewerWidgetOptions): Promise<ViewerWidget> {
        const child = new Container({ defaultScope: 'Singleton' });
        child.parent = context.container;
        child.bind(ViewerWidgetOptions).toConstantValue(options);
        return child.get(ViewerWidget);
      },
    }))
    .inSingletonScope();

  bind(ViewerContribution).toSelf().inSingletonScope();
  [CommandContribution, OpenHandler, FrontendApplicationContribution].forEach((serviceIdentifier) =>
    bind(serviceIdentifier).toService(ViewerContribution)
  );

  bindViewContribution(bind, ExplorerContribution);
  bind(FrontendApplicationContribution).toService(ExplorerContribution);
  bind(WidgetFactory)
    .toDynamicValue((context) => ({
      id: ExplorerWidget.ID,
      createWidget: () => ExplorerWidget.createWidget(context.container),
    }))
    .inSingletonScope();
};

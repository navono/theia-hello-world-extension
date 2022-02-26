import { CommandContribution } from '@theia/core';
import { ContainerModule, Container } from '@theia/core/shared/inversify';
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
  WebSocketConnectionProvider,
  OpenHandler,
  KeybindingContribution,
} from '@theia/core/lib/browser';
import { FileNavigatorContribution as TheiaFileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { ScmContribution as TheiaScmContribution } from '@theia/scm/lib/browser/scm-contribution';
import { DebugFrontendApplicationContribution as TheiaDebugFrontendApplicationContribution } from '@theia/debug/lib/browser/debug-frontend-application-contribution';

import { FileNavigatorContribution } from './theia/navigator/navigator-contribution';
import { ScmContribution } from './theia/scm/scm-contribution';
import { DebugFrontendApplicationContribution } from './theia/debug/debug-frontend-application-contribution';

import { ECSNextServerConfigService, ecsnextServerPath } from '../common/ecsnext-server-config';
import { bindECSNextServerPreferences } from './server/ecsnext-server-bindings';
import { ECSNextExplorerWidget } from './ecsnext-explorer/ecsnext-explorer-widget';
import { ECSNextExplorerContribution } from './ecsnext-explorer/ecsnext-explorer-contribution';
import { ECSNextProjectViewerContribution } from './ecsnext-viewer/ecsnext-viewer-contribution';
import { ECSNextViewerWidget, ECSNextViewerWidgetOptions } from './ecsnext-viewer/ecsnext-viewer-widget';

import '../../src/browser/style/index.css';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  console.log('ECS Next');

  // 重定义 theia 系统相关的扩展
  rebind(TheiaFileNavigatorContribution).to(FileNavigatorContribution).inSingletonScope();
  rebind(TheiaScmContribution).to(ScmContribution).inSingletonScope();
  rebind(TheiaDebugFrontendApplicationContribution).to(DebugFrontendApplicationContribution).inSingletonScope();

  // 视图
  bind(ECSNextViewerWidget).toSelf();
  bind<WidgetFactory>(WidgetFactory)
    .toDynamicValue((context) => ({
      id: ECSNextViewerWidget.ID,
      async createWidget(options: ECSNextViewerWidgetOptions): Promise<ECSNextViewerWidget> {
        const child = new Container({ defaultScope: 'Singleton' });
        child.parent = context.container;
        child.bind(ECSNextViewerWidgetOptions).toConstantValue(options);
        return child.get(ECSNextViewerWidget);
      },
    }))
    .inSingletonScope();

  bind(ECSNextProjectViewerContribution).toSelf().inSingletonScope();
  [CommandContribution, OpenHandler, FrontendApplicationContribution, KeybindingContribution].forEach(
    (serviceIdentifier) => bind(serviceIdentifier).toService(ECSNextProjectViewerContribution)
  );

  // 左侧面板
  bindViewContribution(bind, ECSNextExplorerContribution);
  bind(FrontendApplicationContribution).toService(ECSNextExplorerContribution);
  bind(WidgetFactory)
    .toDynamicValue((context) => ({
      id: ECSNextExplorerWidget.ID,
      createWidget: () => ECSNextExplorerWidget.createWidget(context.container),
    }))
    .inSingletonScope();

  // 后端服务配置
  bind(ECSNextServerConfigService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<ECSNextServerConfigService>(ecsnextServerPath);
    })
    .inSingletonScope();
  bindECSNextServerPreferences(bind);
});

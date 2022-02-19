import { interfaces } from '@theia/core/shared/inversify';
import { WidgetFactory, OpenHandler } from '@theia/core/lib/browser';
import { Theia3dViewOpenHandler } from './theia-3d-view-open-handler';
import { Theia3dViewWidget, Theia3dViewWidgetOptions, defaultTheia3dViewOptions } from './theia-3d-view-widget';

import '../../../src/browser/3d-viewer/style/index.css';

export const bind3dViewerContainer = (bind: interfaces.Bind) => {
  bind(Theia3dViewWidget).toSelf();
  bind(OpenHandler).to(Theia3dViewOpenHandler).inSingletonScope();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: Theia3dViewWidget.ID,
      createWidget: (options: Theia3dViewWidgetOptions) => {
        const child = ctx.container.createChild();
        child.bind(Theia3dViewWidgetOptions).toConstantValue(defaultTheia3dViewOptions(options));
        return child.get(Theia3dViewWidget);
      },
    }))
    .inSingletonScope();
};

import { injectable } from '@theia/core/shared/inversify';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';

import { ECSNextExplorerWidget } from './ecsnext-explorer-widget';

@injectable()
export class ECSNextExplorerContribution
  extends AbstractViewContribution<ECSNextExplorerWidget>
  implements FrontendApplicationContribution
{
  constructor() {
    super({
      widgetId: ECSNextExplorerWidget.ID,
      widgetName: ECSNextExplorerWidget.LABEL,
      defaultWidgetOptions: {
        area: 'left',
      },
      toggleCommandId: 'ecs-next:toggle',
    });
  }

  async initializeLayout(_app: FrontendApplication): Promise<void> {
    await this.openView({ activate: false });
  }
}

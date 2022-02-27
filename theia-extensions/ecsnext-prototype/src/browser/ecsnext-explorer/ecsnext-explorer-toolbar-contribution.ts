import { CommandContribution, CommandRegistry } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';
import { Widget } from '@theia/core/lib/browser';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

import { OpenTraceCommand } from './ecsnext-explorer-command';
import { ECSNextToolbarCommands } from './ecsnext-explorer-toolbar-command';
import { ECSNextProjectViewsWidget } from './sub-widgets/ecsnext-project-view-widget';

@injectable()
export class ECSNextToolbarContribution implements TabBarToolbarContribution, CommandContribution {
  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(ECSNextToolbarCommands.OPEN_TRACE, {
      isVisible: (w: Widget) => {
        if (w instanceof ECSNextProjectViewsWidget) {
          return true;
        }
        return false;
      },
      execute: async () => {
        await registry.executeCommand(OpenTraceCommand.id);
      },
    });
  }

  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    registry.registerItem({
      id: ECSNextToolbarCommands.OPEN_TRACE.id,
      command: ECSNextToolbarCommands.OPEN_TRACE.id,
      tooltip: ECSNextToolbarCommands.OPEN_TRACE.label,
      priority: 6,
    });
  }
}

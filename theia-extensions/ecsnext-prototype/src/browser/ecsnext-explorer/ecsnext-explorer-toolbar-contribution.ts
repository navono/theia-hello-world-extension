import { CommandContribution, CommandRegistry } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';
import { Widget } from '@theia/core/lib/browser';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';

import { ECSNextProjectCommands } from './ecsnext-explorer-command';
import { ECSNextToolbarCommands } from './ecsnext-explorer-toolbar-command';
import { ECSNextProjectViewsWidget } from './sub-widgets/ecsnext-project-view-widget';

@injectable()
export class ECSNextToolbarContribution implements TabBarToolbarContribution, CommandContribution {
  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(ECSNextToolbarCommands.CREAT_PROJECT, {
      isVisible: (w: Widget) => {
        if (w instanceof ECSNextProjectViewsWidget) {
          return true;
        }
        return false;
      },
      execute: async () => {
        await registry.executeCommand(ECSNextProjectCommands.CREATE_PROJECT.id);
      },
    });
  }

  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    registry.registerItem({
      id: ECSNextToolbarCommands.CREAT_PROJECT.id,
      command: ECSNextToolbarCommands.CREAT_PROJECT.id,
      tooltip: ECSNextToolbarCommands.CREAT_PROJECT.label,
      priority: 1,
    });
  }
}

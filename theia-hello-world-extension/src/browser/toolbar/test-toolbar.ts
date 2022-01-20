/* eslint-disable @typescript-eslint/no-namespace */
import { Command, CommandContribution, CommandRegistry } from '@theia/core';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { injectable, interfaces } from '@theia/core/shared/inversify';

import { ArduinoToolbar } from './arduino-toolbar';

@injectable()
export class TestToolBarContribution implements TabBarToolbarContribution, CommandContribution {
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(TestToolBarContribution.Commands.TEST_TOOLBAR, {
      isVisible: (widget) => ArduinoToolbar.is(widget) && widget.side === 'left',
      isEnabled: () => true,
      isToggled: () => true,
      execute: () => commands.executeCommand(TestToolBarContribution.Commands.TEST_TOOLBAR.id),
    });
  }

  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    registry.registerItem({
      id: TestToolBarContribution.Commands.TEST_TOOLBAR.id,
      command: TestToolBarContribution.Commands.TEST_TOOLBAR.id,
      priority: 0,
    });
  }
}

export namespace TestToolBarContribution {
  export namespace Commands {
    export const TEST_TOOLBAR: Command = {
      id: 'arduino-verify-sketch--toolbar',
    };
  }
}

export const bindTestToolBar = (bind: interfaces.Bind) => {
  bind(TestToolBarContribution).toSelf().inSingletonScope();
  bind(TabBarToolbarContribution).toService(TestToolBarContribution);
  bind(CommandContribution).toService(TestToolBarContribution);
};

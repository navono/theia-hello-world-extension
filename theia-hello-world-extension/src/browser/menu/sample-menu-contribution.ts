/** ******************************************************************************
 * Copyright (C) 2020 TORO Limited and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ******************************************************************************* */

import {
  QuickInputService,
  CommonMenus,
  CommonCommands,
  ApplicationShell,
  StatusBar,
  PreferenceService,
  // CorePreferences,
} from '@theia/core/lib/browser';
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MAIN_MENU_BAR,
  MenuContribution,
  MenuModelRegistry,
  MenuNode,
  MessageService,
  nls,
  SubMenuOptions,
} from '@theia/core/lib/common';
import { CommandService } from '@theia/core';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import { AsyncLocalizationProvider } from '@theia/core/lib/common/i18n/localization';

import { FamilyTreeWidgetCommand } from '../tree-widget/tree/family-tree-contribution';
import { FamilyTreeWidget } from '../tree-widget/tree/Family-tree-widget';

const SampleCommand: Command = {
  id: 'sample-command',
  label: 'Remove Setting',
};
const SampleCommand2: Command = {
  id: 'sample-command2',
  label: 'Restore Setting',
};
const SampleQuickInputCommand: Command = {
  id: 'sample-quick-input-command',
  category: 'Quick Input',
  label: 'Test Positive Integer',
};
const TheiaHelloWorldExtensionCommand: Command = {
  id: 'TheiaHelloWorldExtension.command',
  label: 'Say Hello from menu',
};

@injectable()
export class SampleCommandContribution implements CommandContribution {
  @inject(AsyncLocalizationProvider)
  protected readonly localizationProvider: AsyncLocalizationProvider;

  @inject(QuickInputService)
  protected readonly quickInputService: QuickInputService;

  @inject(MessageService)
  protected readonly messageService: MessageService;

  @inject(ApplicationShell)
  protected readonly shell: ApplicationShell;

  @inject(CommandService)
  protected readonly commandService: CommandService;

  @inject(StatusBar)
  protected readonly statusBar: StatusBar;

  @inject(PreferenceService)
  protected readonly preferenceService: PreferenceService;

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SampleCommand, {
      execute: async () => {
        const l = await this.localizationProvider.getAvailableLanguages();
        console.log('Language', l);

        // this.shell.leftPanelHandler.removeBottomMenu('settings-menu');
        // this.shell.leftPanelHandler.collapse();
        // this.shell.leftPanelHandler.toolBar.hide();
        // this.shell.leftPanelHandler.topMenu.hide();
        // this.shell.bottomPanel.hide();

        // this.shell.collapsePanel('left');
        // this.shell.collapsePanel('right');
        // this.shell.collapsePanel('bottom');

        // this.shell.leftPanelHandler.tabBar.dispose();
        // this.shell.leftPanelHandler.bottomMenu.dispose();

        // await this.commandService.executeCommand(CommonCommands.COLLAPSE_ALL_PANELS.id);
        // // await this.commandService.executeCommand(CommonCommands.CLOSE_MAIN_TAB.id);
        // this.shell.closeTabs('main', (title) => {
        //   return title.closable;
        // });

        this.preferenceService.updateValue('workbench.statusBar.visible', false);

        await this.shell.activateWidget(FamilyTreeWidget.ID);
        await this.commandService.executeCommand(CommonCommands.CLOSE_ALL_TABS.id);

        await this.shell.activateWidget(this.shell.bottomPanel.id);
        await this.commandService.executeCommand(CommonCommands.CLOSE_ALL_TABS.id);
      },
    });
    commands.registerCommand(SampleCommand2, {
      execute: async () => {
        this.preferenceService.updateValue('workbench.statusBar.visible', true);
        await this.commandService.executeCommand(FamilyTreeWidgetCommand.id);
      },
    });
    commands.registerCommand(SampleQuickInputCommand, {
      execute: async () => {
        const result = await this.quickInputService.input({
          placeHolder: 'Please provide a positive integer',
          validateInput: async (input: string) => {
            const numericValue = Number(input);
            if (Number.isNaN(numericValue)) {
              return 'Invalid: NaN';
            }
            if (numericValue % 2 === 1) {
              return 'Invalid: Odd Number';
            }
            if (numericValue < 0) {
              return 'Invalid: Negative Number';
            }
            if (!Number.isInteger(numericValue)) {
              return 'Invalid: Only Integers Allowed';
            }

            return undefined;
          },
        });
        if (result) {
          this.messageService.info(`Positive Integer: ${result}`);
        }
      },
    });

    commands.registerCommand(TheiaHelloWorldExtensionCommand, {
      execute: () => this.messageService.info('Hello World!'),
    });

    // 注销 帮助 命令
    commands.unregisterCommand(CommonCommands.ABOUT_COMMAND);
  }
}

@injectable()
export class SampleMenuContribution implements MenuContribution {
  async registerMenus(menus: MenuModelRegistry): Promise<void> {
    const subMenuPath = [...MAIN_MENU_BAR, 'sample-menu'];
    menus.registerSubmenu(subMenuPath, nls.localize('a-Menu', 'Sample Menu'), {
      order: '2', // that should put the menu right next to the File menu
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: SampleCommand.id,
      order: '0',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: SampleCommand2.id,
      order: '2',
    });
    const subSubMenuPath = [...subMenuPath, 'sample-sub-menu'];
    menus.registerSubmenu(subSubMenuPath, 'Sample sub menu', { order: '2' });
    menus.registerMenuAction(subSubMenuPath, {
      commandId: SampleCommand.id,
      order: '1',
    });
    menus.registerMenuAction(subSubMenuPath, {
      commandId: SampleCommand2.id,
      order: '3',
    });
    const placeholder = new PlaceholderMenuNode([...subSubMenuPath, 'placeholder'].join('-'), 'Placeholder', {
      order: '0',
    });
    menus.registerMenuNode(subSubMenuPath, placeholder);

    /**
     * Register an action menu with an invalid command (un-registered and without a label)
     * in order to determine that menus and the layout does not break on startup.
     */
    menus.registerMenuAction(subMenuPath, { commandId: 'invalid-command' });

    menus.registerMenuAction(CommonMenus.EDIT_FIND, {
      commandId: TheiaHelloWorldExtensionCommand.id,
      label: TheiaHelloWorldExtensionCommand.label,
    });

    // 注销 帮助 菜单
    // CommonMenus.HELP
    menus.unregisterMenuAction(CommonCommands.ABOUT_COMMAND);
    // menus.unregisterMenuAction('1_file');
  }
}

/**
 * Special menu node that is not backed by any commands and is always disabled.
 */
export class PlaceholderMenuNode implements MenuNode {
  // eslint-disable-next-line no-useless-constructor
  constructor(readonly id: string, public readonly label: string, protected options?: SubMenuOptions) {}

  get icon(): string | undefined {
    return this.options?.iconClass;
  }

  get sortString(): string {
    return this.options?.order || this.label;
  }
}

export const bindSampleMenu = (bind: interfaces.Bind) => {
  bind(CommandContribution).to(SampleCommandContribution).inSingletonScope();
  bind(MenuContribution).to(SampleMenuContribution).inSingletonScope();
};

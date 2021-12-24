import { AbstractViewContribution } from '@theia/core/lib/browser';
import { injectable } from '@theia/core/shared/inversify';
import { Command, CommandRegistry, MenuModelRegistry } from '@theia/core';
import { FamilyTreeWidget } from './Family-tree-widget';

export const FamilyTreeWidgetCommand: Command = {
  id: 'family-tree-widget:command',
  label: 'family tree',
};

@injectable()
export class FamilyTreeWidgetContribution extends AbstractViewContribution<
  FamilyTreeWidget
> {
  constructor() {
    super({
      widgetId: FamilyTreeWidget.ID,
      widgetName: FamilyTreeWidget.LABEL,
      defaultWidgetOptions: { area: 'left' },
      toggleCommandId: FamilyTreeWidgetCommand.id,
    });
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(FamilyTreeWidgetCommand, {
      execute: () => super.openView({ activate: false, reveal: true }),
    });
  }

  registerMenus(menus: MenuModelRegistry): void {
    super.registerMenus(menus);
  }
}

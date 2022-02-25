import { injectable } from 'inversify';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { ExplorerWidget } from './explorer-widget';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { MenuModelRegistry, CommandRegistry } from '@theia/core';
import { ExplorerCommands, ExplorerMenus } from './explorer-commands';

@injectable()
export class ExplorerContribution
  extends AbstractViewContribution<ExplorerWidget>
  implements FrontendApplicationContribution
{
  constructor() {
    super({
      widgetId: ExplorerWidget.ID,
      widgetName: ExplorerWidget.LABEL,
      defaultWidgetOptions: {
        area: 'left',
      },
      toggleCommandId: 'trace-explorer:toggle',
    });
  }

  async initializeLayout(): Promise<void> {
    await this.openView({ activate: false });
  }

  registerMenus(menus: MenuModelRegistry): void {
    super.registerMenus(menus);

    menus.registerMenuAction(ExplorerMenus.PREFERENCE_EDITOR_CONTEXT_MENU, {
      commandId: ExplorerCommands.OPEN_TRACE.id,
      label: 'Open Trace',
      order: 'a',
    });

    menus.registerMenuAction(ExplorerMenus.PREFERENCE_EDITOR_CONTEXT_MENU, {
      commandId: ExplorerCommands.CLOSE_TRACE.id,
      label: ExplorerCommands.CLOSE_TRACE.label,
      order: 'b',
    });

    menus.registerMenuAction(ExplorerMenus.PREFERENCE_EDITOR_CONTEXT_MENU, {
      commandId: ExplorerCommands.REMOVE_TRACE.id,
      label: ExplorerCommands.REMOVE_TRACE.label,
      order: 'c',
    });
  }

  async registerCommands(registry: CommandRegistry): Promise<void> {
    super.registerCommands(registry);
    const explorerWidget = await this.widget;

    registry.registerCommand(ExplorerCommands.OPEN_TRACE, {
      execute: (traceUUID: string) => {
        explorerWidget.openExperiment(traceUUID);
      },
    });

    registry.registerCommand(ExplorerCommands.CLOSE_TRACE, {
      execute: (traceUUID: string) => {
        explorerWidget.closeExperiment(traceUUID);
      },
    });

    registry.registerCommand(ExplorerCommands.REMOVE_TRACE, {
      execute: (traceUUID: string) => {
        explorerWidget.deleteExperiment(traceUUID);
      },
    });
  }
}

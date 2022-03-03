import { injectable, inject } from '@theia/core/shared/inversify';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { FrontendApplicationContribution, FrontendApplication, ViewContributionOptions } from '@theia/core/lib/browser';
import { SelectionService, CommandRegistry, MenuModelRegistry } from '@theia/core';
// import URI from '@theia/core/lib/common/uri';
import { OpenViewArguments } from '@theia/core/lib/browser/shell/view-contribution';

import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

import { ECSNextPreferences, SERVER_IP, SERVER_ARGS, SERVER_PORT } from '../ecsnext-server-preference';
import { ECSNextExplorerWidget, ECSNextExplorerWidgetOptions } from './ecsnext-explorer-widget';
import { ECSNextProjectCommands, ECSNextProjectMenus } from './ecsnext-explorer-command';

interface ECSNextExplorerContributionOptions extends ViewContributionOptions {
  baseUrl?: string;
}

@injectable()
export class ECSNextExplorerContribution
  extends AbstractViewContribution<ECSNextExplorerWidget>
  implements FrontendApplicationContribution
{
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;
  @inject(SelectionService) selectionService: SelectionService;

  // private readonly toDisposeOnClose = new DisposableCollection();
  // protected readonly onProjectsLoadedEmitter = new Emitter<void>();

  constructor() {
    super({
      widgetId: ECSNextExplorerWidget.ID,
      widgetName: ECSNextExplorerWidget.LABEL,
      defaultWidgetOptions: {
        area: 'left',
      },
      toggleCommandId: 'ecs-next:toggle',
    });

    // this.toDisposeOnClose.push(this.onProjectsLoadedEmitter);
  }

  async initializeLayout(_app: FrontendApplication): Promise<void> {
    await this.openView({ activate: true });
  }

  async openView(args: Partial<OpenViewArguments> = {}): Promise<ECSNextExplorerWidget> {
    const shell = this.shell;

    const widgetOptions: ECSNextExplorerContributionOptions = {
      baseUrl: this.baseUrl,
      widgetId: ECSNextExplorerWidget.ID,
      widgetName: ECSNextExplorerWidget.LABEL,
      defaultWidgetOptions: this.options.defaultWidgetOptions,
    };

    const widget = await this.widgetManager.getOrCreateWidget(
      this.options.viewContainerId || this.viewId,
      widgetOptions
    );
    const tabBar = shell.getTabBarFor(widget);
    const area = shell.getAreaFor(widget);
    if (!tabBar) {
      // The widget is not attached yet, so add it to the shell
      const widgetArgs: OpenViewArguments = {
        ...this.defaultViewOptions,
        ...args,
      };
      await shell.addWidget(widget, widgetArgs);
    } else if (args.toggle && area && shell.isExpanded(area) && tabBar.currentTitle === widget.title) {
      // The widget is attached and visible, so collapse the containing panel (toggle)
      switch (area) {
        case 'left':
        case 'right':
          await shell.collapsePanel(area);
          break;
        case 'bottom':
          // Don't collapse the bottom panel if it's currently split
          if (shell.bottomAreaTabBars.length === 1) {
            await shell.collapsePanel('bottom');
          }
          break;
        default:
          // The main area cannot be collapsed, so close the widget
          await this.closeView();
      }
      return this.widget;
    }
    if (widget.isAttached && args.activate) {
      await shell.activateWidget(this.viewId);
    } else if (widget.isAttached && args.reveal) {
      await shell.revealWidget(this.viewId);
    }
    return this.widget;
  }

  onStart(_app: FrontendApplication): void {
    fetch(`${this.baseUrl}/api/projects`)
      .then((res) => res.json())
      .then((projects) => {
        console.log(projects);
        signalManager().fireProjectsLoadedSignel(projects);
      });
  }

  onStop(_app: FrontendApplication): void {
    // this.toDisposeOnClose.dispose();
  }

  registerMenus(menus: MenuModelRegistry): void {
    super.registerMenus(menus);

    menus.registerMenuAction(ECSNextProjectMenus.PREFERENCE_EDITOR_CONTEXT_MENU, {
      commandId: ECSNextProjectCommands.DELETE_PROJECT.id,
      label: ECSNextProjectCommands.DELETE_PROJECT.label,
      order: 'a',
    });
  }

  registerCommands(registry: CommandRegistry): void {
    super.registerCommands(registry);

    registry.registerCommand(ECSNextProjectCommands.CREATE_PROJECT, {
      execute: () => {
        console.log('执行创建工程');
      },
    });
    registry.registerCommand(ECSNextProjectCommands.DELETE_PROJECT, {
      execute: (id: string) => {
        console.log('执行删除工程', id);
      },
    });
  }

  protected get baseUrl(): string | undefined {
    return `${this.serverPreferences[SERVER_IP]}:${this.serverPreferences[SERVER_PORT]}`;
  }

  protected get args(): string | undefined {
    return this.serverPreferences[SERVER_ARGS];
  }
}

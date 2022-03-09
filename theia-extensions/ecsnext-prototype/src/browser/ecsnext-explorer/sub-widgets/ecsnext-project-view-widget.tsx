import * as React from '@theia/core/shared/react';
import { CommandService } from '@theia/core';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';

// import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';
import { ReactProjectsWidget } from 'react-component/lib/explorer/explorer-opened-project-widget';

import { ECSNextProjectMenus } from '../ecsnext-explorer-command';
import { ECSNextViewerWidget } from '../../ecsnext-viewer/ecsnext-viewer-widget';
import { ProjectViewerCommand } from '../../ecsnext-viewer/ecsnext-viewer-command';

@injectable()
export class ECSNextProjectViewsWidget extends ReactWidget {
  static ID = 'ecsnext-project-views-widget';
  static LABEL = 'Projects';

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;
  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;
  @inject(CommandService) protected readonly commandService!: CommandService;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectViewsWidget.ID;
    this.title.label = ECSNextProjectViewsWidget.LABEL;

    this.update();
  }

  dispose(): void {
    super.dispose();
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    this.update();
  }

  protected onContextMenuEvent(e: React.MouseEvent<HTMLDivElement>, project: any): void {
    this.contextMenuRenderer.render({
      menuPath: ECSNextProjectMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
      anchor: { x: e.clientX, y: e.clientY },
      args: [project._id],
    });
  }

  protected onItemClickEvent(e: React.MouseEvent<HTMLDivElement>, project: any): void {
    const widgets = this.widgetManager.getWidgets(ECSNextViewerWidget.ID);
    const widget = widgets.find((w) => w.id === project._id);
    // Don't execute command if widget is already open.
    if (!widget) {
      this.commandService.executeCommand(ProjectViewerCommand.id, { projectUUID: project._id });
    }
  }

  render(): React.ReactNode {
    return (
      <ReactProjectsWidget
        id={this.id}
        title={this.title.label}
        contextMenuRenderer={(event, item) => this.onContextMenuEvent(event, item)}
        onClick={(event, item) => this.onItemClickEvent(event, item)}
      ></ReactProjectsWidget>
    );
  }
}

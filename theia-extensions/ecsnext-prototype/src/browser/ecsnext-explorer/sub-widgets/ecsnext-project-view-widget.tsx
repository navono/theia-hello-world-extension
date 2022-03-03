import { List } from 'antd';
import * as React from '@theia/core/shared/react';
import { CommandService } from '@theia/core';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
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

  private projects: any;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectViewsWidget.ID;
    this.title.label = ECSNextProjectViewsWidget.LABEL;

    signalManager().on(Signals.PROJECTS_LOADED, this.onProjectsLoaded);
    this.update();
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECTS_LOADED, this.onProjectsLoaded);
  }

  protected onProjectsLoaded = (projects: any) => {
    this.projects = projects;
    this.update();
  };

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    this.update();
  }

  protected doHandleItemClickEvent(item: any): void {
    const widgets = this.widgetManager.getWidgets(ECSNextViewerWidget.ID);
    const widget = widgets.find((w) => w.id === item._id);
    // Don't execute command if widget is already open.
    if (!widget) {
      this.commandService.executeCommand(ProjectViewerCommand.id, { projectUUID: item._id });
    } else {
      signalManager().fireProjectSelectedSignal(item);
    }
  }

  protected doHandleContextMenuEvent(event: React.MouseEvent<HTMLDivElement>, item: any): void {
    this.contextMenuRenderer.render({
      menuPath: ECSNextProjectMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
      anchor: { x: event.clientX, y: event.clientY },
      args: [item._id],
    });
  }

  render(): React.ReactNode {
    return (
      <List
        itemLayout="vertical"
        bordered={true}
        dataSource={this.projects}
        split={true}
        renderItem={(item: any) => (
          <List.Item
            onClick={() => this.doHandleItemClickEvent(item)}
            onContextMenu={(event) => this.doHandleContextMenuEvent(event, item)}
          >
            <List.Item.Meta title={item.name} description={item.desc} />
          </List.Item>
        )}
      />
    );
  }
}

import { List } from 'antd';
import * as React from '@theia/core/shared/react';
import { CommandService } from '@theia/core';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
import { ECSNextProjectMenus } from '../ecsnext-explorer-command';

export const ECSNextProjectUserWidgetOptions = Symbol('ECSNextProjectUserWidgetOptions');
export interface ECSNextProjectUserWidgetOptions {
  baseUrl?: string;
}

@injectable()
export class ECSNextProjectUserWidget extends ReactWidget {
  static ID = 'ecsnext-project-user-widget';
  static LABEL = 'Users';

  @inject(ECSNextProjectUserWidgetOptions) protected readonly options: ECSNextProjectUserWidgetOptions;
  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;
  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;
  @inject(CommandService) protected readonly commandService!: CommandService;

  private users: any;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectUserWidget.ID;
    this.title.label = ECSNextProjectUserWidget.LABEL;

    signalManager().on(Signals.PROJECT_USER_LOADED, this.onProjectUserChanged);
    signalManager().on(Signals.PROJECT_SELECTED, this.onProjectChanged);

    this.update();
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_USER_LOADED, this.onProjectUserChanged);
    signalManager().off(Signals.PROJECT_SELECTED, this.onProjectChanged);
  }

  protected onProjectUserChanged = (project: any, users: any) => {
    this.title.label = `${ECSNextProjectUserWidget.LABEL}: ${project.name}`;
    this.users = users;
    this.update();
  };

  protected onProjectChanged = (project: any) => {
    this.title.label = `${ECSNextProjectUserWidget.LABEL}: ${project.name}`;
    this.users = [];
    this.update();
  };

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  // protected onAfterShow(msg: Message): void {
  //   super.onAfterShow(msg);
  //   this.update();
  // }

  protected doHandleItemClickEvent(item: any): void {
    // const widgets = this.widgetManager.getWidgets(ECSNextViewerWidget.ID);
    // const widget = widgets.find((w) => w.id === item._id);
    // // Don't execute command if widget is already open.
    // if (!widget) {
    //   this.commandService.executeCommand(ProjectViewerCommand.id, { projectUUID: item._id });
    // } else {
    //   signalManager().fireProjectSelectedSignal(item);
    // }
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
        dataSource={this.users}
        split={true}
        renderItem={(item: any) => (
          <List.Item
            onClick={() => this.doHandleItemClickEvent(item)}
            onContextMenu={(event) => this.doHandleContextMenuEvent(event, item)}
          >
            <List.Item.Meta title={item.username} description={item.email} />
          </List.Item>
        )}
      />
    );
  }
}

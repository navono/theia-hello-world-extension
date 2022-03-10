import * as React from '@theia/core/shared/react';
import { CommandService } from '@theia/core';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';

import { ReactProjectUserWidget } from 'react-component/lib/explorer/explorer-project-user-widget';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

import { ECSNextPreferences, SERVER_IP, SERVER_PORT } from '../../ecsnext-server-preference';

// import { ECSNextProjectMenus } from '../ecsnext-explorer-command';

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
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;

  private currentProject: any;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectUserWidget.ID;
    this.title.label = ECSNextProjectUserWidget.LABEL;

    // Login and Project changed
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
    signalManager().on(Signals.PROJECT_SELECTED, this.onProjectChanged);
    signalManager().on(Signals.PROJECT_CLOSED, this.onProjectsClosed);

    this.update();
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_LOGIN, this.onProjectLogin);
    signalManager().off(Signals.PROJECT_SELECTED, this.onProjectChanged);
  }

  private onProjectLogin = (project: any, _user: any): void => {
    this.currentProject = project;
    this.title.label = `${ECSNextProjectUserWidget.LABEL}: ${project.name}`;
    this.getProjectUsers(project);

    this.update();
  };

  private onProjectChanged = (project: any) => {
    this.currentProject = project;
    this.title.label = `${ECSNextProjectUserWidget.LABEL}: ${project.name}`;

    const token = localStorage[`${this.currentProject._id}-jwt`];
    if (token) {
      this.getProjectUsers(project);
    } else {
      signalManager().fireProjectUserLoadedSignal(project, []);
    }

    this.update();
  };

  private onProjectsClosed = (project: any) => {
    if (this.currentProject?._id === project._id) {
      this.currentProject = undefined;
      this.title.label = `${ECSNextProjectUserWidget.LABEL}`;
    }
  };

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  private getProjectUsers = (project: any) => {
    const token = localStorage[`${this.currentProject._id}-jwt`];
    if (token) {
      fetch(`${this.baseUrl}/api/projects/${project._id}/users/`, {
        headers: {
          Accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })
        .then((res) => res.json())
        .then((users) => {
          signalManager().fireProjectUserLoadedSignal(project, users);
        });
    }
  };

  protected onContextMenuEvent(e: React.MouseEvent<HTMLDivElement>, item: any): void {
    // this.contextMenuRenderer.render({
    //   menuPath: ECSNextProjectMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
    //   anchor: { x: e.clientX, y: e.clientY },
    //   args: [item._id],
    // });
  }

  protected onItemClickEvent(e: React.MouseEvent<HTMLDivElement>, item: any): void {
    // const widgets = this.widgetManager.getWidgets(ECSNextViewerWidget.ID);
    // const widget = widgets.find((w) => w.id === item._id);
    // // Don't execute command if widget is already open.
    // if (!widget) {
    //   this.commandService.executeCommand(ProjectViewerCommand.id, { projectUUID: item._id });
    // } else {
    //   signalManager().fireProjectSelectedSignal(item);
    // }
    console.log('接收到用户点击', item);
  }

  render(): React.ReactNode {
    return (
      <ReactProjectUserWidget
        id={this.id}
        title={this.title.label}
        contextMenuRenderer={(event, project) => this.onContextMenuEvent(event, project)}
        onClick={(event, item) => this.onItemClickEvent(event, item)}
      ></ReactProjectUserWidget>
    );
  }

  private get baseUrl(): string | undefined {
    return `${this.serverPreferences[SERVER_IP]}:${this.serverPreferences[SERVER_PORT]}`;
  }
}

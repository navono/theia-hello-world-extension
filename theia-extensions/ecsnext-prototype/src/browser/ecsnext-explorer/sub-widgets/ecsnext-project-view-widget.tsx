import * as React from '@theia/core/shared/react';
import { CommandService } from '@theia/core';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
import { ReactOpenTracesWidget } from 'react-component/lib/explorer/explorer-opened-projects-widget';

import { ECSNextProjectMenus } from '../ecsnext-explorer-command';
import { ECSNextViewerWidget } from '../../ecsnext-viewer/ecsnext-viewer-widget';
import { ProjectViewerCommand } from '../../ecsnext-viewer/ecsnext-viewer-command';
import { ReactProjectViewWidget } from './view-list-widget';

@injectable()
export class ECSNextProjectViewsWidget extends ReactWidget {
  static ID = 'ecsnext-project-views-widget';
  static LABEL = 'Projects';

  private projects: Array<any> = [];

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;
  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;
  @inject(CommandService) protected readonly commandService!: CommandService;

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

  protected doHandleContextMenuEvent(e: React.MouseEvent<HTMLDivElement>, project: any): void {
    this.contextMenuRenderer.render({
      menuPath: ECSNextProjectMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
      anchor: { x: e.clientX, y: e.clientY },
      args: [project._id],
    });
  }

  protected doHandleItemClickEvent(e: React.MouseEvent<HTMLDivElement>, project: any): void {
    const widgets = this.widgetManager.getWidgets(ECSNextViewerWidget.ID);
    const widget = widgets.find((w) => w.id === project._id);
    // Don't execute command if widget is already open.
    if (!widget) {
      this.commandService.executeCommand(ProjectViewerCommand.id, { projectUUID: project._id });
    } else {
      signalManager().fireProjectViewerTabActivatedSignal(project);
    }
  }

  render(): React.ReactNode {
    return (
      <ReactOpenTracesWidget
        id={this.id}
        title={this.title.label}
        contextMenuRenderer={(event, experiment) => this.doHandleContextMenuEvent(event, experiment)}
        onClick={(event, experiment) => console.log('ReactOpenTracesWidget: ', event, experiment)}
      ></ReactOpenTracesWidget>
    );
  }
}

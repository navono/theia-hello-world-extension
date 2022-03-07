// import { List } from 'antd';
import * as React from '@theia/core/shared/react';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

import { ECSNextProjectMenus } from '../ecsnext-explorer-command';
import { ListWidget } from './list-widget';

export const ECSNextProjectModelsWidgetOptions = Symbol('ECSNextProjectModelsWidgetOptions');
export interface ECSNextProjectModelsWidgetOptions {
  baseUrl?: string;
}

@injectable()
export class ECSNextProjectModelsWidget extends ReactWidget {
  static ID = 'ecsnext-project-models-widget';
  static LABEL = 'Models';

  @inject(ECSNextProjectModelsWidgetOptions) protected readonly options: ECSNextProjectModelsWidgetOptions;
  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;
  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;

  private models: any;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectModelsWidget.ID;
    this.title.label = ECSNextProjectModelsWidget.LABEL;

    this.subscribeToEvents();
    this.update();
  }

  protected subscribeToEvents(): void {
    signalManager().on(Signals.PROJECT_MODEL_LOADED, this.onProjectModelChanged);
    signalManager().on(Signals.PROJECT_ACTIVATED, this.onProjectChanged);
  }

  dispose(): void {
    super.dispose();
    signalManager().on(Signals.PROJECT_MODEL_LOADED, this.onProjectModelChanged);
    signalManager().off(Signals.PROJECT_ACTIVATED, this.onProjectChanged);
  }

  protected onProjectModelChanged = (project: any, models: any): void => {
    this.title.label = `${ECSNextProjectModelsWidget.LABEL}: ${project.name}`;
    this.models = models;
    console.log('models ', this.models);
    this.update();
  };

  protected onProjectChanged = (project: any): void => {
    this.title.label = `${ECSNextProjectModelsWidget.LABEL}: ${project.name}`;
    this.models = [];
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
    return <ListWidget />;
  }
}

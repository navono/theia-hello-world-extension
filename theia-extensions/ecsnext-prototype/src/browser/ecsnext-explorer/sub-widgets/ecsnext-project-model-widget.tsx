import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

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

  private models: any;
  private currentLoginProjectId: string;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectModelsWidget.ID;
    this.title.label = ECSNextProjectModelsWidget.LABEL;

    this.subscribeToEvents();
    this.update();
  }

  protected subscribeToEvents(): void {
    signalManager().on(Signals.PROJECT_SELECTED, this.onProjectSelected);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);

    signalManager().on(Signals.PROJECTVIEWERTAB_ACTIVATED, this.onProjectChanged);
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_SELECTED, this.onProjectSelected);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
    signalManager().off(Signals.PROJECTVIEWERTAB_ACTIVATED, this.onProjectChanged);
  }

  protected onProjectLogin = (projectId: string, _user: any): void => {
    if (this.currentLoginProjectId && projectId === this.currentLoginProjectId) {
      return;
    }
    this.currentLoginProjectId = projectId;

    this.update();
  };

  protected onProjectSelected = (): void => {};

  protected onProjectChanged = (project: any): void => {
    this.title.label = `${ECSNextProjectModelsWidget.LABEL}: ${project.name}`;
    this.getModels(project._id);
  };

  private getModels = (projectId: string): void => {
    const token = localStorage[`${projectId}-jwt`];
    if (token) {
      fetch(`${this.options.baseUrl}/api/projects/${projectId}/models`)
        .then((res) => res.json())
        .then((models) => {
          this.models = models;
        });
    }
  };

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    this.update();
  }

  render(): React.ReactNode {
    return (
      <div>
        <p>模型列表</p>
      </div>
    );
  }
}

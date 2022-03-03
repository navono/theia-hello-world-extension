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
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_SELECTED, this.onProjectSelected);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  protected onProjectLogin = (projectId: string, _user: any): void => {
    if (this.currentLoginProjectId && projectId === this.currentLoginProjectId) {
      return;
    }

    this.currentLoginProjectId = projectId;

    const token = localStorage[`${this.currentLoginProjectId}-jwt`];
    if (token) {
      fetch(`${this.options.baseUrl}/api/projects/${projectId}/models`)
        .then((res) => res.json())
        .then((models) => {
          console.log(models);
        });
    }

    this.update();
  };

  protected onProjectSelected = (): void => {};

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

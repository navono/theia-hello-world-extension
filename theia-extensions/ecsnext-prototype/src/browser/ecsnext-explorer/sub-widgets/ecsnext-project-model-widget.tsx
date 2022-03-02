import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

@injectable()
export class ECSNextProjectModelsWidget extends ReactWidget {
  static ID = 'ecsnext-project-models-widget';
  static LABEL = 'Models';

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
      // const token = localStorage[`${this.currentLoginProjectId}-jwt`];
      // if (token) {
      //   fetch(`${this.baseUrl}/api/projects`)
      //     .then((res) => res.json())
      //     .then((projects) => {
      //       console.log(projects);
      //       signalManager().fireProjectsLoadedSignel(projects);
      //     });
      // }
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

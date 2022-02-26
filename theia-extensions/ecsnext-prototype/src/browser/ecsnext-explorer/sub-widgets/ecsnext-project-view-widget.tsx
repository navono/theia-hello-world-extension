import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

@injectable()
export class ECSNextProjectViewsWidget extends ReactWidget {
  static ID = 'ecsnext-project-views-widget';
  static LABEL = 'Projects';

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;

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

  protected onProjectsLoaded(projects: any) {
    console.log('收到列表：', projects);
  }

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
        <p>工程列表</p>
      </div>
    );
  }
}

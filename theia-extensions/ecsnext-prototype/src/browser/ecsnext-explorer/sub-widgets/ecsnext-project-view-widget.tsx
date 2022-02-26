import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';

@injectable()
export class ECSNextProjectViewsWidget extends ReactWidget {
  static ID = 'ecsnext-project-views-widget';
  static LABEL = 'Projects';

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectViewsWidget.ID;
    this.title.label = ECSNextProjectViewsWidget.LABEL;
    this.update();
  }

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;

  render(): React.ReactNode {
    return (
      <div>
        <p>工程列表</p>
      </div>
    );
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    this.update();
  }
}

import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';

@injectable()
export class ECSNextProjectModelsWidget extends ReactWidget {
  static ID = 'ecsnext-project-models-widget';
  static LABEL = 'Models';

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectModelsWidget.ID;
    this.title.label = ECSNextProjectModelsWidget.LABEL;
    this.update();
  }

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;

  render(): React.ReactNode {
    return (
      <div>
        <p>模型列表</p>
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

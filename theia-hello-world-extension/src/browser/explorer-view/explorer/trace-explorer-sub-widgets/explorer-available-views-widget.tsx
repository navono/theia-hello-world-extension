import { inject, injectable, postConstruct } from 'inversify';
import { ReactWidget, Widget, Message, WidgetManager } from '@theia/core/lib/browser';
// import { TspClientProvider } from '../../tsp-client-provider-impl';
import * as React from 'react';
// import { ReactAvailableViewsWidget } from 'traceviewer-react-components/lib/trace-explorer/trace-explorer-views-widget';

@injectable()
export class ExplorerAvailableViewsWidget extends ReactWidget {
  static ID = 'trace-explorer-views-widget';

  static LABEL = 'Available Views';

  // @inject(TspClientProvider) protected readonly tspClientProvider!: TspClientProvider;

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;

  @postConstruct()
  init(): void {
    this.id = ExplorerAvailableViewsWidget.ID;
    this.title.label = ExplorerAvailableViewsWidget.LABEL;
    this.update();
  }

  dispose(): void {
    super.dispose();
  }

  render(): React.ReactNode {
    return (
      <div>
        Avaliable views widget
        {/* {
          <ReactAvailableViewsWidget
            id={this.id}
            title={this.title.label}
            tspClientProvider={this.tspClientProvider}
          ></ReactAvailableViewsWidget>
        } */}
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

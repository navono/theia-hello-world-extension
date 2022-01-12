import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { CommandService } from '@theia/core';
import { ReactWidget, Widget, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';

// import { Experiment } from 'tsp-typescript-client/lib/models/experiment';
// import { ExperimentManager } from 'traceviewer-base/lib/experiment-manager';
// import { TspClientProvider } from '../../tsp-client-provider-impl';
// import { signalManager } from 'traceviewer-base/lib/signals/signal-manager';
import { ExplorerPropertyWidget } from './explorer-item-property-widget';
import { ContextMenuRenderer } from '@theia/core/lib/browser';
import { TraceViewerCommand } from '../../viewer/viewer-commands';
// import { ReactOpenTracesWidget } from 'traceviewer-react-components/lib/trace-explorer/trace-explorer-opened-traces-widget';
import { ExplorerMenus } from '../explorer-commands';
import { ViewerWidget } from '../../viewer/viewer-widget';

@injectable()
export class ExplorerOpenedTracesWidget extends ReactWidget {
  static ID = 'trace-explorer-opened-traces-widget';

  static LABEL = 'Opened Traces';

  static LIST_MARGIN = 2;

  static LINE_HEIGHT = 16;

  // @inject(TspClientProvider) protected readonly tspClientProvider!: TspClientProvider;

  @inject(ExplorerPropertyWidget) protected readonly tooltipWidget!: ExplorerPropertyWidget;

  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;

  @inject(CommandService) protected readonly commandService!: CommandService;

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;

  // private _experimentManager!: ExperimentManager;

  @postConstruct()
  async init(): Promise<void> {
    this.id = ExplorerOpenedTracesWidget.ID;
    this.title.label = ExplorerOpenedTracesWidget.LABEL;
    // this._experimentManager = this.tspClientProvider.getExperimentManager();
    // this.tspClientProvider.addTspClientChangeListener(() => {
    //   this._experimentManager = this.tspClientProvider.getExperimentManager();
    // });
    this.update();
  }

  protected doHandleContextMenuEvent(event: React.MouseEvent<HTMLDivElement>): void {
    this.contextMenuRenderer.render({
      menuPath: ExplorerMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
      anchor: { x: event.clientX, y: event.clientY },
      args: [],
    });
  }

  protected doHandleClickEvent(event: React.MouseEvent<HTMLDivElement>): void {
    console.error('doHandleClickEvent', event);
    this.openExperiment('');
  }

  public openExperiment(traceUUID: string): void {
    const widgets = this.widgetManager.getWidgets(ViewerWidget.ID);
    const widget = widgets.find((w) => w.id === traceUUID);
    // Don't execute command if widget is already open.
    if (!widget) {
      this.commandService.executeCommand(TraceViewerCommand.id, { traceUUID });
    }
  }

  public closeExperiment(traceUUID: string): void {
    console.error('closeExperiment', traceUUID);

    // signalManager().fireCloseTraceViewerTabSignal(traceUUID);
  }

  public deleteExperiment(traceUUID: string): void {
    // this._experimentManager.deleteExperiment(traceUUID);
    this.closeExperiment(traceUUID);
  }

  render(): React.ReactNode {
    return (
      <div>
        Open traces widget
        {/* { <ReactOpenTracesWidget
                id={this.id}
                title={this.title.label}
                tspClientProvider={this.tspClientProvider}
                contextMenuRenderer={(event, experiment) => this.doHandleContextMenuEvent(event, experiment) }
                onClick={(event, experiment) => this.doHandleClickEvent(event, experiment) }
            ></ReactOpenTracesWidget>
            } */}
      </div>
    );
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }
}

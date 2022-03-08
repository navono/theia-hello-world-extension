import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { CommandService } from '@theia/core';
import { ReactWidget, Widget, WidgetManager } from '@theia/core/lib/browser';
import * as React from '@theia/core/shared/react';

// import { any } from 'tsp-typescript-client/lib/models/experiment';
import { experimentManager } from '../../util/experiment-manager';
// import { TspClientProvider } from '../../tsp-client-provider-impl';
import { signalManager, Signals } from '../../util/signal-manager';
import { ExplorerPropertyWidget } from './explorer-item-property-widget';
import { ContextMenuRenderer } from '@theia/core/lib/browser';
import { TraceViewerCommand } from '../../viewer/viewer-commands';
import { ExplorerMenus } from '../explorer-commands';
import { ViewerWidget } from '../../viewer/viewer-widget';

@injectable()
export class ExplorerOpenedTracesWidget extends ReactWidget {
  static ID = 'explorer-opened-project-traces-widget';

  static LABEL = 'Opened Traces';

  static LIST_MARGIN = 2;

  static LINE_HEIGHT = 16;

  // @inject(TspClientProvider) protected readonly tspClientProvider!: TspClientProvider;

  @inject(ExplorerPropertyWidget) protected readonly tooltipWidget!: ExplorerPropertyWidget;

  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;

  @inject(CommandService) protected readonly commandService!: CommandService;

  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;

  private _selectedExperiment: any | undefined;

  private _openedExperiments: any[] = [];

  private _selectedExperimentIndex = -1;

  private _experimentManager = experimentManager();

  private _onExperimentOpened = (experiment: any): Promise<void> => this.doHandleExperimentOpenedSignal(experiment);

  // private _onExperimentClosed = (experiment: any): void => this.doHandleExperimentClosed(experiment);

  // private _onExperimentDeleted = (experiment: any): Promise<void> => this.doHandleExperimentDeletedSignal(experiment);

  private _onOpenedTracesWidgetActivated = (experiment: any): void =>
    this.doHandleTracesWidgetActivatedSignal(experiment);

  constructor() {
    super();
    signalManager().on(Signals.EXPERIMENT_OPENED, this._onExperimentOpened);
    // signalManager().on(Signals.EXPERIMENT_CLOSED, this._onExperimentClosed);
    // signalManager().on(Signals.EXPERIMENT_DELETED, this._onExperimentDeleted);
    signalManager().on(Signals.TRACEVIEWERTAB_ACTIVATED, this._onOpenedTracesWidgetActivated);
  }

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

  public async doHandleExperimentOpenedSignal(experiment: any): Promise<void> {
    console.error('open ', experiment);

    await this.updateOpenedExperiments();
    this.updateSelectedExperiment();
  }

  protected updateOpenedExperiments = async (): Promise<void> => this.doUpdateOpenedExperiments();

  protected async doUpdateOpenedExperiments(): Promise<void> {
    const remoteExperiments = await this._experimentManager.getOpenedExperiments();
    remoteExperiments.forEach((experiment) => {
      this._experimentManager.addExperiment(experiment);
    });
    this._selectedExperimentIndex = remoteExperiments.findIndex(
      (experiment) => this._selectedExperiment && experiment.UUID === this._selectedExperiment.UUID
    );
    this._openedExperiments = remoteExperiments;

    signalManager().fireOpenedTracesChangedSignal(remoteExperiments.length);
  }

  protected doHandleContextMenuEvent(event: React.MouseEvent<HTMLDivElement>): void {
    this.contextMenuRenderer.render({
      menuPath: ExplorerMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
      anchor: { x: event.clientX, y: event.clientY },
      args: [],
    });
  }

  private updateSelectedExperiment(): void {
    if (
      this._openedExperiments &&
      this._selectedExperimentIndex >= 0 &&
      this._selectedExperimentIndex < this._openedExperiments.length
    ) {
      this._selectedExperiment = this._openedExperiments[this._selectedExperimentIndex];
      signalManager().fireExperimentSelectedSignal(this._selectedExperiment);
    }
  }

  protected doHandleTracesWidgetActivatedSignal(experiment: any): void {
    if (this._selectedExperiment?.UUID !== experiment.UUID) {
      this._selectedExperiment = experiment;
      const selectedIndex = this._openedExperiments.findIndex(
        (openedExperiment) => openedExperiment.UUID === experiment.UUID
      );
      this.selectExperiment(selectedIndex);
    }
  }

  private selectExperiment(index: number): void {
    if (index >= 0 && index !== this._selectedExperimentIndex) {
      this._selectedExperimentIndex = index;
      this._selectedExperiment = this._openedExperiments[index];
      signalManager().fireExperimentSelectedSignal(this._selectedExperiment);
    }
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
        {/* { <ReactProjectsWidget
                id={this.id}
                title={this.title.label}
                tspClientProvider={this.tspClientProvider}
                contextMenuRenderer={(event, experiment) => this.doHandleContextMenuEvent(event, experiment) }
                onClick={(event, experiment) => this.doHandleClickEvent(event, experiment) }
            ></ReactProjectsWidget>
            } */}
      </div>
    );
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }
}

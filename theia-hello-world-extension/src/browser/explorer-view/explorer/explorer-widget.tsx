import { injectable, inject, postConstruct, interfaces, Container } from '@theia/core/shared/inversify';
import { ViewContainer, BaseWidget, Message, PanelLayout, codicon } from '@theia/core/lib/browser';

import { ExplorerPlaceholderWidget } from './trace-explorer-sub-widgets/explorer-placeholder-widget';
import { ExplorerOpenedTracesWidget } from './trace-explorer-sub-widgets/explorer-opened-traces-widget';
import { ExplorerAvailableViewsWidget } from './trace-explorer-sub-widgets/explorer-available-views-widget';
import { ExplorerPropertyWidget } from './trace-explorer-sub-widgets/explorer-item-property-widget';
import { signalManager, Signals } from '../util/signal-manager';
// import { OpenedTracesUpdatedSignalPayload } from 'traceviewer-base/src/signals/opened-traces-updated-signal-payload';

@injectable()
export class ExplorerWidget extends BaseWidget {
  static LABEL = 'Viewer';

  static ID = 'trace-explorer';

  protected viewsContainer!: ViewContainer;

  private _numberOfOpenedTraces = 0;

  @inject(ExplorerAvailableViewsWidget) protected readonly availableWidget!: ExplorerAvailableViewsWidget;

  @inject(ExplorerOpenedTracesWidget) protected readonly openedTracesWidget!: ExplorerOpenedTracesWidget;

  @inject(ExplorerPropertyWidget) protected readonly itemPropertyWidget!: ExplorerPropertyWidget;

  @inject(ExplorerPlaceholderWidget) protected readonly placeholderWidget!: ExplorerPlaceholderWidget;

  @inject(ViewContainer.Factory) protected readonly viewContainerFactory!: ViewContainer.Factory;

  openExperiment(traceUUID: string): void {
    return this.openedTracesWidget.openExperiment(traceUUID);
  }

  closeExperiment(traceUUID: string): void {
    return this.openedTracesWidget.closeExperiment(traceUUID);
  }

  deleteExperiment(traceUUID: string): void {
    return this.openedTracesWidget.deleteExperiment(traceUUID);
  }

  static createWidget(parent: interfaces.Container): ExplorerWidget {
    return ExplorerWidget.createContainer(parent).get(ExplorerWidget);
  }

  static createContainer(parent: interfaces.Container): Container {
    const child = new Container({ defaultScope: 'Singleton' });
    child.parent = parent;
    child.bind(ExplorerPlaceholderWidget).toSelf();
    child.bind(ExplorerOpenedTracesWidget).toSelf();
    child.bind(ExplorerAvailableViewsWidget).toSelf();
    child.bind(ExplorerPropertyWidget).toSelf();
    child.bind(ExplorerWidget).toSelf().inSingletonScope();
    return child;
  }

  @postConstruct()
  init(): void {
    console.error('Explorer widget init');

    this.id = ExplorerWidget.ID;
    this.title.label = ExplorerWidget.LABEL;
    this.title.caption = ExplorerWidget.LABEL;
    this.title.iconClass = codicon('shield');
    this.title.closable = true;

    this.viewsContainer = this.viewContainerFactory({
      id: this.id,
    });
    this.viewsContainer.addWidget(this.openedTracesWidget);
    this.viewsContainer.addWidget(this.availableWidget);
    this.viewsContainer.addWidget(this.itemPropertyWidget);
    this.toDispose.push(this.viewsContainer);
    const layout = (this.layout = new PanelLayout());
    layout.addWidget(this.placeholderWidget);
    layout.addWidget(this.viewsContainer);

    this.node.tabIndex = 0;
    signalManager().on(Signals.OPENED_TRACES_UPDATED, this.onUpdateSignal);
    this.update();
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.OPENED_TRACES_UPDATED, this.onUpdateSignal);
  }

  protected onUpdateSignal = (payload: any): void => this.doHandleOpenedTracesChanged(payload);

  protected doHandleOpenedTracesChanged(payload: any): void {
    this._numberOfOpenedTraces = payload;
    this.update();
  }

  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
    if (this._numberOfOpenedTraces > 0) {
      this.viewsContainer.show();
      this.placeholderWidget.hide();
    } else {
      this.viewsContainer.hide();
      this.placeholderWidget.show();
    }
  }

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    this.node.focus();
  }
}

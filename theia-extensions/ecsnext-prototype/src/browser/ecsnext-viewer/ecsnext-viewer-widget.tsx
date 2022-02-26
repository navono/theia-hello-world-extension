import { injectable, postConstruct } from '@theia/core/shared/inversify';
import * as React from '@theia/core/shared/react';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { ThemeService } from '@theia/core/lib/browser/theming';

import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

export const ECSNextViewerWidgetOptions = Symbol('ECSNextViewerWidgetOptions');
export interface ECSNextViewerWidgetOptions {
  projectURI: string;
  projectUUID?: string;
}

@injectable()
export class ECSNextViewerWidget extends ReactWidget {
  static ID = 'ecsnext-viewer';
  static LABEL = 'ECS Viewer';

  protected openedExperiment: boolean | undefined;
  protected backgroundTheme: string;

  @postConstruct()
  async init(): Promise<void> {
    // this.uri = new Path(this.options.traceURI);
    this.id = 'theia-ecsnext';
    this.title.label = 'ECS: ';
    this.title.closable = true;
    this.addClass('theia-ecsnext-');

    this.openedExperiment = true;

    this.backgroundTheme = ThemeService.get().getCurrentTheme().type;
    ThemeService.get().onDidColorThemeChange(() => this.updateBackgroundTheme());

    // if (!this.options.traceUUID) {
    //   this.initialize();
    // }
    // this.tspClient = this.tspClientProvider.getTspClient();
    // this.traceManager = this.tspClientProvider.getTraceManager();
    // this.experimentManager = this.tspClientProvider.getExperimentManager();
    // this.tspClientProvider.addTspClientChangeListener((tspClient) => {
    //   this.tspClient = tspClient;
    //   this.traceManager = this.tspClientProvider.getTraceManager();
    //   this.experimentManager = this.tspClientProvider.getExperimentManager();
    // });
    // if (this.options.traceUUID) {
    //   const experiment = await this.experimentManager.updateExperiment(this.options.traceUUID);
    //   if (experiment) {
    //     this.openedExperiment = experiment;
    //     this.title.label = 'Trace: ' + experiment.name;
    //     this.id = experiment.UUID;
    //     this.experimentManager.addExperiment(experiment);
    //     signalManager().fireExperimentOpenedSignal(experiment);
    //     if (this.isVisible) {
    //       signalManager().fireTraceViewerTabActivatedSignal(experiment);
    //     }
    //     this.fetchMarkerSets(experiment.UUID);
    //   }
    //   this.update();
    // }
    // this.subscribeToEvents();
    // this.toDispose.push(this.toDisposeOnNewExplorer);
    // // Make node focusable so it can achieve focus on activate (avoid warning);
    // this.node.tabIndex = 0;
  }

  protected render(): React.ReactNode {
    // this.onOutputRemoved = this.onOutputRemoved.bind(this);
    return (
      <div className="trace-viewer-container">{this.openedExperiment ? <p>Viewer</p> : 'Trace is loading...'}</div>
    );
  }

  protected updateBackgroundTheme(): void {
    const currentThemeType = ThemeService.get().getCurrentTheme().type;
    signalManager().fireThemeChangedSignal(currentThemeType);
  }
}

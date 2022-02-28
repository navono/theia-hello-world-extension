import { DisposableCollection } from '@theia/core';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import * as React from '@theia/core/shared/react';
import { ApplicationShell, Message } from '@theia/core/lib/browser';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { ThemeService } from '@theia/core/lib/browser/theming';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
import { ECSNextPreferences, SERVER_IP, SERVER_ARGS, SERVER_PORT } from '../ecsnext-server-preference';

export const ECSNextViewerWidgetOptions = Symbol('ECSNextViewerWidgetOptions');
export interface ECSNextViewerWidgetOptions {
  projectURI: string;
  projectUUID?: string;
}

@injectable()
export class ECSNextViewerWidget extends ReactWidget {
  static ID = 'ecsnext-viewer';
  static LABEL = 'ECS Viewer';

  protected openedProject: any | undefined;
  protected backgroundTheme: string;
  protected readonly toDisposeOnNewExplorer = new DisposableCollection();

  @inject(ECSNextViewerWidgetOptions) protected readonly options: ECSNextViewerWidgetOptions;
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;

  private onProjectSelected = (experiment: any): void => this.doHandleProjectSelectedSignal(experiment);

  @postConstruct()
  async init(): Promise<void> {
    this.id = 'theia-ecsnext';
    this.title.label = '工程: ';
    this.title.closable = true;
    this.addClass('theia-ecsnext-');
    this.backgroundTheme = ThemeService.get().getCurrentTheme().type;
    ThemeService.get().onDidColorThemeChange(() => this.updateBackgroundTheme());

    console.log(this.options);

    if (this.options.projectUUID) {
      const project = await fetch(`${this.baseUrl}/api/projects/${this.options.projectUUID}`).then((res) => res.json());
      if (project) {
        this.title.label = '工程: ' + project.name;
        this.id = project._id;

        this.openedProject = project;
      }
    }

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

    this.update();
    this.subscribeToEvents();
  }

  protected render(): React.ReactNode {
    // this.onOutputRemoved = this.onOutputRemoved.bind(this);
    return <div className="trace-viewer-container">{this.openedProject ? <p>Viewer</p> : 'Trace is loading...'}</div>;
  }

  protected subscribeToEvents(): void {
    this.toDisposeOnNewExplorer.dispose();
    signalManager().on(Signals.PROJECT_SELECTED, this.onProjectSelected);
  }

  protected updateBackgroundTheme(): void {
    const currentThemeType = ThemeService.get().getCurrentTheme().type;
    signalManager().fireThemeChangedSignal(currentThemeType);
  }

  onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    if (this.openedProject) {
      signalManager().fireProjectViewerTabActivatedSignal(this.openedProject);
    }
  }

  onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    if (this.openedProject) {
      signalManager().fireProjectViewerTabActivatedSignal(this.openedProject);
    }
    this.node.focus();
  }

  protected doHandleProjectSelectedSignal(project: any): void {
    if (this.openedProject && this.openedProject._id === project._id) {
      this.shell.activateWidget(this.openedProject._id);
    }
  }

  protected get baseUrl(): string | undefined {
    return `${this.serverPreferences[SERVER_IP]}:${this.serverPreferences[SERVER_PORT]}`;
  }

  protected get args(): string | undefined {
    return this.serverPreferences[SERVER_ARGS];
  }
}

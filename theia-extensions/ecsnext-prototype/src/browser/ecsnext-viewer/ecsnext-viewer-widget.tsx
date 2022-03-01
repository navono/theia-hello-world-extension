import { DisposableCollection } from '@theia/core';
import { injectable, postConstruct, inject, interfaces, Container } from '@theia/core/shared/inversify';
import { ViewContainer, ApplicationShell, Message, BaseWidget, PanelLayout } from '@theia/core/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';
import 'antd/dist/antd.css';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
import { ECSNextPreferences, SERVER_IP, SERVER_ARGS, SERVER_PORT } from '../ecsnext-server-preference';
// import { LoginForm } from './login';
import { LoginWidget } from './login/login-widget';
import { ProjectDetailWidget } from './project/project-detail-widget';

export const ECSNextViewerWidgetOptions = Symbol('ECSNextViewerWidgetOptions');
export interface ECSNextViewerWidgetOptions {
  projectURI: string;
  projectUUID?: string;
}

@injectable()
export class ECSNextViewerWidget extends BaseWidget {
  static ID = 'ecsnext-viewer';
  static LABEL = 'ECS Viewer';

  protected viewsContainer!: ViewContainer;
  protected openedProject: any | undefined;
  protected backgroundTheme: string;
  protected readonly toDisposeOnNewExplorer = new DisposableCollection();
  protected bLogin = false;

  @inject(LoginWidget) protected readonly projectLoginWidget!: LoginWidget;
  @inject(ProjectDetailWidget) protected readonly projectDetailWidget!: ProjectDetailWidget;

  @inject(ECSNextViewerWidgetOptions) protected readonly options: ECSNextViewerWidgetOptions;
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;
  @inject(ViewContainer.Factory) protected readonly viewContainerFactory!: ViewContainer.Factory;

  private onProjectSelected = (project: any): void => this.doHandleProjectSelectedSignal(project);
  private onProjectLogin = (projectId: string, user: any): void => this.doHandleProjectLoginSignal(projectId, user);

  @postConstruct()
  async init(): Promise<void> {
    this.id = 'theia-ecsnext';
    this.title.label = '工程: ';
    this.title.closable = true;

    this.viewsContainer = this.viewContainerFactory({
      id: this.id,
    });
    this.viewsContainer.addWidget(this.projectDetailWidget);
    this.toDispose.push(this.viewsContainer);

    const layout = (this.layout = new PanelLayout());
    layout.addWidget(this.projectLoginWidget);
    layout.addWidget(this.viewsContainer);

    // this.backgroundTheme = ThemeService.get().getCurrentTheme().type;
    // ThemeService.get().onDidColorThemeChange(() => this.updateBackgroundTheme());

    if (this.options.projectUUID && !this.openedProject) {
      const project = await fetch(`${this.baseUrl}/api/projects/${this.options.projectUUID}`).then((res) => res.json());
      if (project) {
        this.title.label = '工程: ' + project.name;
        this.id = project._id;

        this.openedProject = project;
      }
    }

    const token = localStorage[`${this.openedProject._id}-jwt`];
    console.log('token', token);
    if (token) {
      this.bLogin = true;
    }

    this.update();
    this.subscribeToEvents();
  }

  static createWidget(parent: interfaces.Container, opt: ECSNextViewerWidgetOptions): ECSNextViewerWidget {
    return ECSNextViewerWidget.createContainer(parent, opt).get(ECSNextViewerWidget);
  }

  static createContainer(parent: interfaces.Container, opt: ECSNextViewerWidgetOptions): Container {
    const child = new Container({ defaultScope: 'Singleton' });
    child.parent = parent;

    child.bind(LoginWidget).toSelf();
    child.bind(ProjectDetailWidget).toSelf();
    child.bind(ECSNextViewerWidgetOptions).toConstantValue(opt);
    child.bind(ECSNextViewerWidget).toSelf().inSingletonScope();
    return child;
  }

  protected subscribeToEvents(): void {
    this.toDisposeOnNewExplorer.dispose();
    signalManager().on(Signals.PROJECT_SELECTED, this.onProjectSelected);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  protected updateBackgroundTheme(): void {
    const currentThemeType = ThemeService.get().getCurrentTheme().type;
    signalManager().fireThemeChangedSignal(currentThemeType);
  }

  onAfterShow = (msg: Message): void => {
    super.onAfterShow(msg);
    if (this.openedProject) {
      const token = localStorage[`${this.openedProject._id}-jwt`];
      if (token) {
        this.bLogin = true;
      }
      signalManager().fireProjectViewerTabActivatedSignal(this.openedProject);
    }
  };

  onActivateRequest = (msg: Message): void => {
    super.onActivateRequest(msg);
    if (this.openedProject) {
      signalManager().fireProjectViewerTabActivatedSignal(this.openedProject);
    }
    this.node.focus();
  };

  onUpdateRequest = (msg: Message): void => {
    super.onUpdateRequest(msg);

    if (this.openedProject) {
      const token = localStorage[`${this.openedProject._id}-jwt`];
      if (token) {
        this.bLogin = true;
        this.projectLoginWidget.hide();
        this.viewsContainer.show();
      } else {
        this.projectLoginWidget.show();
        this.viewsContainer.hide();
      }
    }
  };

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_SELECTED, this.onProjectSelected);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  protected doHandleProjectSelectedSignal(project: any): void {
    if (this.openedProject && this.openedProject._id === project._id) {
      this.shell.activateWidget(this.openedProject._id);
    }
  }

  protected doHandleProjectLoginSignal(projectId: string, _user: any): void {
    if (this.openedProject && projectId === this.openedProject._id) {
      const token = localStorage[`${this.openedProject._id}-jwt`];
      if (token) {
        this.bLogin = true;
      }
    }
    this.update();
  }

  protected get baseUrl(): string | undefined {
    return `${this.serverPreferences[SERVER_IP]}:${this.serverPreferences[SERVER_PORT]}`;
  }

  protected get args(): string | undefined {
    return this.serverPreferences[SERVER_ARGS];
  }
}

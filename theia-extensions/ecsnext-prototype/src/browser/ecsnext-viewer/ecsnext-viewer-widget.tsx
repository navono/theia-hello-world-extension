import * as React from '@theia/core/shared/react';
import { DisposableCollection } from '@theia/core';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ViewContainer, ApplicationShell, Message, ReactWidget } from '@theia/core/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

import { ECSNextPreferences, SERVER_IP, SERVER_ARGS, SERVER_PORT } from '../ecsnext-server-preference';
import { Login } from './login/login-widget';

export const ECSNextViewerWidgetOptions = Symbol('ECSNextViewerWidgetOptions');
export interface ECSNextViewerWidgetOptions {
  projectURI: string;
  projectUUID?: string;
}

@injectable()
export class ECSNextViewerWidget extends ReactWidget {
  static ID = 'ecsnext-viewer';
  static LABEL = 'ECS Viewer';

  // protected viewsContainer!: ViewContainer;
  protected currentProject!: any;
  protected backgroundTheme: string;
  protected readonly toDisposeOnNewExplorer = new DisposableCollection();

  // @inject(LoginWidget) protected readonly projectLoginWidget!: LoginWidget;
  // @inject(ProjectDetailWidget) protected readonly projectDetailWidget!: ProjectDetailWidget;
  @inject(ECSNextViewerWidgetOptions) protected readonly options: ECSNextViewerWidgetOptions;
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;
  @inject(ViewContainer.Factory) protected readonly viewContainerFactory!: ViewContainer.Factory;

  // private onProjectSelected = (project: any): void => this.doHandleProjectSelectedSignal(project);
  // private onProjectLogin = (projectId: string, user: any): void => this.doHandleProjectLoginSignal(projectId, user);

  @postConstruct()
  async init(): Promise<void> {
    this.id = 'theia-ecsnext';
    this.title.label = '工程: ';
    this.title.closable = true;

    // this.viewsContainer = this.viewContainerFactory({
    //   id: this.id,
    // });
    // this.toDispose.push(this.viewsContainer);

    // this.viewsContainer.addWidget(this.projectLoginWidget);
    // this.viewsContainer.addWidget(this.projectDetailWidget);

    // const layout = new Panel();
    // // PanelLayout;
    // layout.addWidget(this.projectLoginWidget);
    // layout.addWidget(this.viewsContainer);

    // this.shell.addWidget(this.projectLoginWidget, { area: 'main' });
    // this.shell.addWidget(this.projectDetailWidget, { area: 'main' });

    // this.projectDetailWidget.hide();
    // this.projectLoginWidget.hide();

    // this.backgroundTheme = ThemeService.get().getCurrentTheme().type;
    // ThemeService.get().onDidColorThemeChange(() => this.updateBackgroundTheme());

    if (this.options.projectUUID !== this.currentProject?._id) {
      const project = await fetch(`${this.baseUrl}/api/projects/${this.options.projectUUID}`).then((res) => res.json());
      if (project) {
        this.title.label = '工程: ' + project.name;
        this.id = project._id;

        this.currentProject = project;
      }
    }

    const token = localStorage[`${this.currentProject._id}-jwt`];
    if (token) {
      this.currentProject.bLogin = true;
    }

    this.subscribeToEvents();
    this.update();
  }

  // static createWidget(parent: interfaces.Container, opt: ECSNextViewerWidgetOptions): ECSNextViewerWidget {
  //   return ECSNextViewerWidget.createContainer(parent, opt).get(ECSNextViewerWidget);
  // }

  // static createContainer(parent: interfaces.Container, opt: ECSNextViewerWidgetOptions): Container {
  //   const child = new Container({ defaultScope: 'Singleton' });
  //   child.parent = parent;

  //   child.bind(LoginWidget).toSelf();
  //   child.bind(ProjectDetailWidget).toSelf();

  //   child.bind(ECSNextViewerWidgetOptions).toConstantValue(opt);
  //   child.bind(ECSNextViewerWidget).toSelf().inSingletonScope();
  //   return child;
  // }

  protected subscribeToEvents(): void {
    this.toDisposeOnNewExplorer.dispose();

    this.shell.onDidChangeCurrentWidget(({ newValue }) => {
      console.log('newValue', newValue?.id, newValue?.title);
    });

    signalManager().on(Signals.PROJECT_ACTIVATED, this.onProjectChanged);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_ACTIVATED, this.onProjectChanged);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  protected updateBackgroundTheme(): void {
    const currentThemeType = ThemeService.get().getCurrentTheme().type;
    signalManager().fireThemeChangedSignal(currentThemeType);
  }

  onAfterShow = (msg: Message): void => {
    super.onAfterShow(msg);

    if (this.currentProject) {
      console.log('激活工程：', this.currentProject.name);
      signalManager().fireProjectViewerTabActivatedSignal(this.currentProject);
      const token = localStorage[`${this.currentProject._id}-jwt`];
      this.getProjectUsers(this.currentProject, token);
    }
  };

  onActivateRequest = (msg: Message): void => {
    super.onActivateRequest(msg);

    if (this.currentProject) {
      signalManager().fireProjectViewerTabActivatedSignal(this.currentProject);
    }

    this.node.focus();
  };

  onUpdateRequest = (msg: Message): void => {
    super.onUpdateRequest(msg);

    // if (this.currentProject) {
    //   const token = localStorage[`${this.currentProject._id}-jwt`];
    //   if (token) {
    //     this.projectLoginWidget.hide();
    //     this.viewsContainer.show();
    //     this.currentWidget = this.viewsContainer;
    //   } else {
    //     this.projectLoginWidget.projectId = this.currentProject._id;
    //     this.projectLoginWidget.show();
    //     this.viewsContainer.hide();
    //     this.currentWidget = this.viewsContainer;
    //   }
    // }
  };

  render(): React.ReactNode {
    return (
      <div className="ecsnext-viewer-container">
        {this.currentProject.bLogin ? (
          <p>{this.currentProject.name} 已登录</p>
        ) : (
          <Login project={this.currentProject}></Login>
        )}
      </div>
    );
  }

  private onProjectChanged = (project: any) => {
    this.currentProject = project;
    const token = localStorage[`${project._id}-jwt`];
    if (token) {
      this.currentProject.bLogin = true;
      this.getProjectUsers(project, token);
      this.getProjectModels(project, token);
    }

    this.shell.activateWidget(project._id);
  };

  private onProjectLogin = (project: any, _user: any): void => {
    this.currentProject = project;
    const token = localStorage[`${project._id}-jwt`];
    if (token) {
      this.currentProject.bLogin = true;

      // 获取当前工程的信息
      this.getProjectUsers(project, token);
      this.getProjectModels(project, token);
    }

    this.update();
  };

  private getProjectUsers = (project: any, token: string) => {
    if (token) {
      fetch(`${this.baseUrl}/api/projects/${project._id}/users/`, {
        headers: {
          Accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })
        .then((res) => res.json())
        .then((users) => {
          signalManager().fireProjectUserLoadedSignal(project, users);
        });
    }
  };

  private getProjectModels = (project: any, token: string) => {
    if (token) {
      fetch(`${this.baseUrl}/api/projects/${project._id}/models/`, {
        headers: {
          Accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
        method: 'GET',
      })
        .then((res) => res.json())
        .then((models) => {
          signalManager().fireProjectModelLoadedSignal(project, models);
        });
    }
  };

  protected get baseUrl(): string | undefined {
    return `${this.serverPreferences[SERVER_IP]}:${this.serverPreferences[SERVER_PORT]}`;
  }

  protected get args(): string | undefined {
    return this.serverPreferences[SERVER_ARGS];
  }
}

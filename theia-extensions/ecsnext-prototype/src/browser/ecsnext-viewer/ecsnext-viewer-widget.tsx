import * as React from '@theia/core/shared/react';
import { DisposableCollection } from '@theia/core';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ApplicationShell, Message, ReactWidget } from '@theia/core/lib/browser';
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

  protected currentProject!: any;
  protected backgroundTheme: string;
  protected readonly toDisposeOnNewExplorer = new DisposableCollection();

  @inject(ECSNextViewerWidgetOptions) protected readonly options: ECSNextViewerWidgetOptions;
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;
  @inject(ApplicationShell) protected readonly shell: ApplicationShell;

  @postConstruct()
  async init(): Promise<void> {
    this.id = 'theia-ecsnext';
    this.title.label = '工程: ';
    this.title.closable = true;
    if (this.options.projectUUID !== this.currentProject?._id) {
      const project = await fetch(`${this.baseUrl}/api/projects/${this.options.projectUUID}`).then((res) => res.json());
      if (project) {
        this.title.label = '工程: ' + project.name;
        this.id = project._id;

        this.currentProject = project;
      }

      const token = localStorage[`${this.currentProject._id}-jwt`];
      if (token) {
        this.currentProject.bLogin = true;
      }
    }

    this.subscribeToEvents();
    this.update();
  }

  protected subscribeToEvents(): void {
    this.toDisposeOnNewExplorer.dispose();

    signalManager().on(Signals.PROJECT_SELECTED, this.onProjectSelectionChanged);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECT_SELECTED, this.onProjectSelectionChanged);
    signalManager().on(Signals.PROJECT_LOGIN, this.onProjectLogin);
  }

  protected updateBackgroundTheme(): void {
    const currentThemeType = ThemeService.get().getCurrentTheme().type;
    signalManager().fireThemeChangedSignal(currentThemeType);
  }

  onAfterShow = (msg: Message): void => {
    super.onAfterShow(msg);

    if (this.currentProject) {
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

  async onCloseRequest(msg: Message): Promise<void> {
    super.onCloseRequest(msg);
    if (this.currentProject) {
      signalManager().fireProjectClosedSignal(this.currentProject);
    }
  }

  render(): React.ReactNode {
    return (
      <div className="ecsnext-viewer-container">
        {this.currentProject?.bLogin ? (
          <p>{this.currentProject.name} 已登录</p>
        ) : (
          <Login project={this.currentProject}></Login>
        )}
      </div>
    );
  }

  private onProjectSelectionChanged = (project: any) => {
    if (this.currentProject && this.currentProject._id === project._id) {
      this.shell.activateWidget(this.currentProject._id);
    }
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

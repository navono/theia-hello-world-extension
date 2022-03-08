import '../../style/project-explorer.css';

import * as React from 'react';
import { List, ListRowProps, Index, AutoSizer } from 'react-virtualized';
import { Experiment } from 'tsp-typescript-client/lib/models/experiment';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCopy } from '@fortawesome/free-solid-svg-icons';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';

export interface ReactProjectsWidgetProps {
  id: string;
  title: string;
  contextMenuRenderer?: (event: React.MouseEvent<HTMLDivElement>, project: any) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>, project: any) => void;
}

export interface ReactProjectsWidgetState {
  openedProjects: Array<any>;
  selectedProjectIndex: number;
}

export class ReactProjectsWidget extends React.Component<ReactProjectsWidgetProps, ReactProjectsWidgetState> {
  static LIST_MARGIN = 2;
  static LINE_HEIGHT = 16;

  private _forceUpdateKey = false;
  private _selectedProject: any | undefined;

  constructor(props: ReactProjectsWidgetProps) {
    super(props);

    signalManager().on(Signals.PROJECTS_LOADED, this.handleProjectsLoaded);
    signalManager().on(Signals.PROJECT_VIEWTAB_ACTIVATED, this.handleProjectsWidgetActivated);

    this.state = {
      openedProjects: [],
      selectedProjectIndex: -1,
    };
  }

  componentWillUnmount(): void {
    signalManager().off(Signals.PROJECTS_LOADED, this.handleProjectsLoaded);
    signalManager().off(Signals.PROJECT_VIEWTAB_ACTIVATED, this.handleProjectsWidgetActivated);
  }

  private handleProjectsLoaded = (projects: Array<any>): void => {
    const selectedIndex = projects.findIndex(
      (project) => this._selectedProject && project._id === this._selectedProject._id
    );
    this.setState({ openedProjects: projects, selectedProjectIndex: selectedIndex });
  };

  private handleProjectsWidgetActivated = (project: any): void => {
    if (this._selectedProject?._id !== project._id) {
      this._selectedProject = project;
      const selectedIndex = this.state.openedProjects.findIndex((openedProject) => openedProject._id === project._id);
      this.selectProject(selectedIndex);
    }
  };

  protected onProjectItemContextMenuEvent = (event: React.MouseEvent<HTMLDivElement>, projectId: string): void => {
    const project = this.getProject(projectId);
    this.doHandleOnProjectSelected(event, project);

    if (project !== undefined && this.props.contextMenuRenderer) {
      this.props.contextMenuRenderer(event, project);
    }
    event.preventDefault();
    event.stopPropagation();
  };

  protected handleProjectItemClickEvent = (event: React.MouseEvent<HTMLDivElement>, projectId: string): void => {
    const project = this.getProject(projectId);
    this.doHandleOnProjectSelected(event, project);

    if (project !== undefined && this.props.onClick) {
      this.props.onClick(event, project);
    }

    event.preventDefault();
    event.stopPropagation();
  };

  private getProject(traceUUID: string): Experiment | undefined {
    return this.state.openedProjects.find((project) => project._id === traceUUID);
  }

  render(): React.ReactNode {
    const totalHeight = this.getTotalHeight();
    this._forceUpdateKey = !this._forceUpdateKey;
    const key = Number(this._forceUpdateKey);
    return (
      <div className="explorer-opened-project">
        <div className="explorer-opened-project-content">
          <AutoSizer>
            {({ width }) => (
              <List
                key={key}
                height={totalHeight}
                width={width}
                rowCount={this.state.openedProjects.length}
                rowHeight={this.getRowHeight}
                rowRenderer={this.renderProjectRow}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    );
  }

  protected renderProjectRow = (props: ListRowProps): React.ReactNode => {
    const project =
      this.state.openedProjects.length && props.index < this.state.openedProjects.length
        ? this.state.openedProjects[props.index]
        : '';

    let traceContainerClassName = 'list-container';
    if (props.index === this.state.selectedProjectIndex && this.state.selectedProjectIndex >= 0) {
      traceContainerClassName = traceContainerClassName + ' theia-mod-selected';
    }
    return (
      <div
        className={traceContainerClassName}
        id={`${traceContainerClassName}-${props.index}`}
        key={props.key}
        style={props.style}
        onClick={(event) => {
          this.handleProjectItemClickEvent(event, project._id);
        }}
        onContextMenu={(event) => {
          this.onProjectItemContextMenuEvent(event, project._id);
        }}
        data-id={`${props.index}`}
      >
        <div className="element-container">
          <div className="element-info">
            <h4 className="element-name">{project.name}</h4>
            <div className="element-description">{`  ${project.desc}`}</div>
          </div>
        </div>
      </div>
    );
  };

  protected getRowHeight = (index: Index | number): number => {
    // 名字 和 描述 的高度
    return 2.5 * ReactProjectsWidget.LINE_HEIGHT;
  };

  protected getTotalHeight(): number {
    let totalHeight = 0;
    for (let i = 0; i < this.state.openedProjects.length; i++) {
      totalHeight += this.getRowHeight(i);
    }
    return totalHeight;
  }

  protected doHandleOnProjectSelected = (e: React.MouseEvent<HTMLDivElement>, project: any): void => {
    const index = Number(e.currentTarget.getAttribute('data-id'));
    this.selectProject(index);

    signalManager().fireProjectSelectedSignal(project);
  };

  private selectProject = (index: number): void => {
    if (index >= 0 && index !== this.state.selectedProjectIndex) {
      this.setState({ selectedProjectIndex: index });
      this._selectedProject = this.state.openedProjects[index];
      signalManager().fireProjectSelectedSignal(this._selectedProject);
    }
  };
}

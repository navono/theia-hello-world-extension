import * as React from '@theia/core/shared/react';
import { List, ListRowProps, Index, AutoSizer } from 'react-virtualized';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

export interface ReactProjectViewWidgetProps {
  id: string;
  title: string;
  // tspClientProvider: ITspClientProvider,
  contextMenuRenderer?: (event: React.MouseEvent<HTMLDivElement>, project: any) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>, project: any) => void;
}

export interface ReactProjectViewWidgetState {
  avaliableProjects: Array<any>;
  selectedProjectIndex: number;
}

export class ReactProjectViewWidget extends React.Component<ReactProjectViewWidgetProps, ReactProjectViewWidgetState> {
  static LIST_MARGIN = 2;
  static LINE_HEIGHT = 16;

  private _selectedProject: any | undefined;
  private _forceUpdateKey = false;

  render(): React.ReactNode {
    const totalHeight = this.getTotalHeight();
    this._forceUpdateKey = !this._forceUpdateKey;
    const key = Number(this._forceUpdateKey);

    return (
      <div className="trace-explorer-opened">
        <div className="trace-explorer-panel-content" onClick={this.updateOpenedProject}>
          <AutoSizer>
            {({ width }) => (
              <List
                key={key}
                height={totalHeight}
                width={width}
                rowCount={this.state.avaliableProjects.length}
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
    const proectName =
      this.state.avaliableProjects.length && props.index < this.state.avaliableProjects.length
        ? this.state.avaliableProjects[props.index].name
        : '';
    const projectUUID =
      this.state.avaliableProjects.length && props.index < this.state.avaliableProjects.length
        ? this.state.avaliableProjects[props.index].UUID
        : '';
    let traceContainerClassName = 'trace-list-container';
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
          this.handleClickEvent(event, projectUUID);
        }}
        onContextMenu={(event) => {
          this.handleContextMenuEvent(event, projectUUID);
        }}
        data-id={`${props.index}`}
      >
        <div className="trace-element-container">
          <div className="trace-element-info">
            <h4 className="trace-element-name">{proectName}</h4>
          </div>
        </div>
      </div>
    );
  };

  protected getRowHeight = (index: Index | number): number => {
    const resolvedIndex = typeof index === 'object' ? index.index : index;
    const project = this.state.avaliableProjects[resolvedIndex];
    let totalHeight = 0;
    if (project.name) {
      totalHeight += ReactProjectViewWidget.LINE_HEIGHT;
    }
    for (let i = 0; i < project.traces.length; i++) {
      totalHeight += ReactProjectViewWidget.LINE_HEIGHT;
    }
    return totalHeight;
  };

  protected getTotalHeight(): number {
    let totalHeight = 0;
    for (let i = 0; i < this.state.avaliableProjects.length; i++) {
      totalHeight += this.getRowHeight(i);
    }
    return totalHeight;
  }

  protected updateOpenedProject = (): void => {
    console.log('updateOpenedProject');
  };

  protected doHandleOnProjectSelected(e: React.MouseEvent<HTMLDivElement>): void {
    const index = Number(e.currentTarget.getAttribute('data-id'));
    this.selectProject(index);
  }

  private handleClickEvent = (e: React.MouseEvent<HTMLDivElement>, projectUUID: string): void => {
    this.doHandleOnProjectSelected(e);
    const project = this.getProject(projectUUID);
    if (project !== undefined && this.props.onClick) {
      this.props.onClick(e, project);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  private handleContextMenuEvent = (e: React.MouseEvent<HTMLDivElement>, projectUUID: string): void => {
    this.doHandleOnProjectSelected(e);
    const project = this.getProject(projectUUID);
    if (project !== undefined && this.props.contextMenuRenderer) {
      this.props.contextMenuRenderer(e, project);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  private getProject(projectUUID: string): any | undefined {
    return this.state.avaliableProjects.find((project) => project._id === projectUUID);
  }

  private selectProject(index: number): void {
    if (index >= 0 && index !== this.state.selectedProjectIndex) {
      this.setState({ selectedProjectIndex: index });
      this._selectedProject = this.state.avaliableProjects[index];
      signalManager().fireExperimentSelectedSignal(this._selectedProject);
    }
  }
}

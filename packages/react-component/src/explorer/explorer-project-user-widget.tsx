import '../../style/project-explorer.css';

import * as React from 'react';
import { ListRowProps, Index } from 'react-virtualized';
import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';
import { AutoSizeList } from './list-widget';

export interface ReactProjectUserWidgetProps {
  id: string;
  title: string;
  contextMenuRenderer?: (event: React.MouseEvent<HTMLDivElement>, project: any) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>, project: any) => void;
}

export interface ReactProjectUserWidgetState {
  users: Array<any>;
  selectedIndex: number;
}

export class ReactProjectUserWidget extends React.Component<ReactProjectUserWidgetProps, ReactProjectUserWidgetState> {
  static LIST_MARGIN = 2;
  static LINE_HEIGHT = 16;

  private currentProject: any;
  private _selectedUser: any | undefined;

  constructor(props: ReactProjectUserWidgetProps) {
    super(props);

    signalManager().on(Signals.PROJECT_USER_LOADED, this.handleUserLoaded);
    signalManager().on(Signals.PROJECT_CLOSED, this.handleProjectsClosed);

    this.state = {
      users: [],
      selectedIndex: -1,
    };
  }

  componentWillUnmount(): void {
    signalManager().off(Signals.PROJECT_USER_LOADED, this.handleUserLoaded);
    signalManager().off(Signals.PROJECT_CLOSED, this.handleProjectsClosed);
  }

  private handleUserLoaded = (project: any, users: Array<any>): void => {
    this.currentProject = project;
    const selectedIndex = users.findIndex((user) => this._selectedUser && user._id === this._selectedUser._id);
    this.setState({ users: users, selectedIndex: selectedIndex });
  };

  private handleProjectsClosed = (project: any): void => {
    if (this.currentProject?._id === project._id) {
      this.currentProject = undefined;
      this.setState({ users: [], selectedIndex: -1 });
    }
  };

  // private handleProjectSelected = (project: any): void => {};

  render(): React.ReactNode {
    const totalHeight = this.getTotalHeight();
    const rowHeight = this.getRowHeight(0);
    return (
      <AutoSizeList
        key={0}
        totalHeight={totalHeight}
        rowCount={this.state.users.length}
        rowHeight={rowHeight}
        rowRenderer={this.renderItemRow}
      ></AutoSizeList>
    );
  }

  protected renderItemRow = (props: ListRowProps): React.ReactNode => {
    const user = this.state.users.length && props.index < this.state.users.length ? this.state.users[props.index] : '';

    let containerClassName = 'list-container';
    if (props.index === this.state.selectedIndex && this.state.selectedIndex >= 0) {
      containerClassName = containerClassName + ' theia-mod-selected';
    }

    return (
      <div
        className={containerClassName}
        id={`${containerClassName}-${props.index}`}
        key={props.key}
        style={props.style}
        onClick={(event) => {
          this.handleItemClickEvent(event, user._id);
        }}
        onContextMenu={(event) => {
          this.onItemContextMenuEvent(event, user._id);
        }}
        data-id={`${props.index}`}
      >
        <div className="element-container">
          <div className="element-info">
            <h4 className="element-name">{user.username}</h4>
            <div className="element-description">{`  ${user.bio}`}</div>
          </div>
        </div>
      </div>
    );
  };

  protected handleItemClickEvent = (event: React.MouseEvent<HTMLDivElement>, projectId: string): void => {
    const user = this.getUser(projectId);
    this.doHandleOnUserSelected(event, user);

    if (user !== undefined && this.props.onClick) {
      this.props.onClick(event, user);
    }

    event.preventDefault();
    event.stopPropagation();
  };

  protected onItemContextMenuEvent = (event: React.MouseEvent<HTMLDivElement>, userId: string): void => {
    const user = this.getUser(userId);
    this.doHandleOnUserSelected(event, user);

    if (user !== undefined && this.props.contextMenuRenderer) {
      this.props.contextMenuRenderer(event, user);
    }
    event.preventDefault();
    event.stopPropagation();
  };

  protected getUser = (userId: string): any => this.state.users.find((user) => user._id === userId);

  protected doHandleOnUserSelected = (e: React.MouseEvent<HTMLDivElement>, user: any): void => {
    const index = Number(e.currentTarget.getAttribute('data-id'));
    this.selectUser(index);

    signalManager().fireUserSelectedSignal(user);
  };

  private selectUser = (index: number): void => {
    if (index >= 0 && index !== this.state.selectedIndex) {
      this.setState({ selectedIndex: index });
      this._selectedUser = this.state.users[index];
      signalManager().fireUserSelectedSignal(this._selectedUser);
    }
  };

  protected getRowHeight = (index: Index | number): number =>
    // 名字 和 描述 的高度
    2.5 * ReactProjectUserWidget.LINE_HEIGHT;

  protected getTotalHeight(): number {
    let totalHeight = 0;
    for (let i = 0; i < this.state.users.length; i++) {
      totalHeight += this.getRowHeight(i);
    }
    return totalHeight;
  }
}

import { List } from 'antd';
import * as React from '@theia/core/shared/react';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget, Widget, Message, WidgetManager, ContextMenuRenderer } from '@theia/core/lib/browser';

import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

@injectable()
export class ECSNextProjectViewsWidget extends ReactWidget {
  static ID = 'ecsnext-project-views-widget';
  static LABEL = 'Projects';

  private projects: any;
  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;
  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;

  @postConstruct()
  init(): void {
    this.id = ECSNextProjectViewsWidget.ID;
    this.title.label = ECSNextProjectViewsWidget.LABEL;

    signalManager().on(Signals.PROJECTS_LOADED, this.onProjectsLoaded);

    this.update();
  }

  dispose(): void {
    super.dispose();
    signalManager().off(Signals.PROJECTS_LOADED, this.onProjectsLoaded);
  }

  protected onProjectsLoaded = (projects: any) => {
    this.projects = projects;
  };

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this.update();
  }

  protected onAfterShow(msg: Message): void {
    super.onAfterShow(msg);
    this.update();
  }

  render(): React.ReactNode {
    return (
      <List
        itemLayout="vertical"
        bordered={true}
        dataSource={this.projects}
        split={true}
        renderItem={(item: any) => (
          <List.Item onClick={() => console.log(item.name)}>
            <List.Item.Meta title={item.name} description={item.desc} />
          </List.Item>
        )}
      />
    );
  }
}

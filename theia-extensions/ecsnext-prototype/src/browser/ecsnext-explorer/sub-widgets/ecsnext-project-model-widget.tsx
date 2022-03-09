import * as React from '@theia/core/shared/react';
import { Emitter, Event } from '@theia/core';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import {
  TreeWidget,
  TreeModel,
  TreeProps,
  TreeNode,
  ExpandableTreeNode,
  LabelProvider,
  WidgetManager,
  ContextMenuRenderer,
  codicon,
} from '@theia/core/lib/browser';
// import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

// import { ECSNextProjectMenus } from '../ecsnext-explorer-command';
import { Category, CategoryNode, MemberNode } from './model/model-model';
import mockData from './model/model-tree.json';

export const ECSNextProjectModelsWidgetOptions = Symbol('ECSNextProjectModelsWidgetOptions');
export interface ECSNextProjectModelsWidgetOptions {
  baseUrl?: string;
}

@injectable()
export class ECSNextProjectModelsWidget extends TreeWidget {
  static ID = 'ecsnext-project-models-widget';
  static LABEL = 'Models';

  @inject(ECSNextProjectModelsWidgetOptions) protected readonly options: ECSNextProjectModelsWidgetOptions;
  @inject(WidgetManager) protected readonly widgetManager!: WidgetManager;
  @inject(ContextMenuRenderer) protected readonly contextMenuRenderer!: ContextMenuRenderer;

  protected onTreeWidgetSelectionEmitter = new Emitter<readonly Readonly<MemberNode>[]>();

  constructor(
    @inject(TreeProps) readonly props: TreeProps,
    @inject(TreeModel) readonly model: TreeModel,
    @inject(LabelProvider) readonly labelProvider: LabelProvider,
    @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer
  ) {
    super(props, model, contextMenuRenderer);

    this.id = ECSNextProjectModelsWidget.ID;
    this.title.label = ECSNextProjectModelsWidget.LABEL;
    this.title.closable = true;
    this.title.caption = ECSNextProjectModelsWidget.LABEL;
    this.title.iconClass = codicon('person');

    const category: Category = {
      name: '模型',
      children: mockData.RES.Tree,
    };
    const root: CategoryNode = {
      id: 'ecs-model-root',
      name: 'ecs-model-root',
      visible: false,
      parent: undefined,
      children: [],
      category: category,
    };
    this.model.root = root;
  }

  @postConstruct()
  protected init(): void {
    super.init();

    this.toDispose.push(this.onTreeWidgetSelectionEmitter);
    this.model.onSelectionChanged((e) => {
      console.log((e as any)[0].id);

      this.onTreeWidgetSelectionEmitter.fire(e as readonly Readonly<MemberNode>[]);
    });

    // this.subscribeToEvents();
    // this.update();
  }

  get onSelectionChange(): Event<readonly Readonly<MemberNode>[]> {
    return this.onTreeWidgetSelectionEmitter.event;
  }

  // protected subscribeToEvents(): void {
  //   // Login and Project changed

  //   signalManager().on(Signals.PROJECT_MODEL_LOADED, this.onProjectModelChanged);
  //   signalManager().on(Signals.PROJECT_VIEWTAB_ACTIVATED, this.onProjectTabActivated);
  // }

  // dispose(): void {
  //   super.dispose();
  //   signalManager().on(Signals.PROJECT_MODEL_LOADED, this.onProjectModelChanged);
  //   signalManager().off(Signals.PROJECT_VIEWTAB_ACTIVATED, this.onProjectTabActivated);
  // }

  protected isExpandable(node: TreeNode): node is ExpandableTreeNode {
    if (CategoryNode.is(node)) {
      return true;
    }

    if (MemberNode.is(node) && node.member.children) {
      return node.member.children.length > 0;
    }

    return false;
  }

  protected renderIcon(node: TreeNode): React.ReactNode {
    return <div className={this.labelProvider.getIcon(node)}></div>;
  }

  // protected onProjectModelChanged = (project: any, models: any): void => {
  //   this.title.label = `${ECSNextProjectModelsWidget.LABEL}: ${project.name}`;
  //   this.models = models;
  //   console.log('models ', this.models);
  //   this.update();
  // };

  // protected onProjectTabActivated = (project: any): void => {
  //   this.title.label = `${ECSNextProjectModelsWidget.LABEL}: ${project.name}`;
  //   this.models = [];
  //   this.update();
  // };

  // protected onResize(msg: Widget.ResizeMessage): void {
  //   super.onResize(msg);
  //   this.update();
  // }

  // protected onAfterShow(msg: Message): void {
  //   super.onAfterShow(msg);
  //   this.update();
  // }

  // protected doHandleItemClickEvent(item: any): void {
  //   // const widgets = this.widgetManager.getWidgets(ECSNextViewerWidget.ID);
  //   // const widget = widgets.find((w) => w.id === item._id);
  //   // // Don't execute command if widget is already open.
  //   // if (!widget) {
  //   //   this.commandService.executeCommand(ProjectViewerCommand.id, { projectUUID: item._id });
  //   // } else {
  //   //   signalManager().fireProjectSelectedSignal(item);
  //   // }
  // }

  // protected doHandleContextMenuEvent(event: React.MouseEvent<HTMLDivElement>, item: any): void {
  //   this.contextMenuRenderer.render({
  //     menuPath: ECSNextProjectMenus.PREFERENCE_EDITOR_CONTEXT_MENU,
  //     anchor: { x: event.clientX, y: event.clientY },
  //     args: [item._id],
  //   });
  // }

  // private getProjectModels = (project: any, token: string) => {
  //   if (token) {
  //     fetch(`${this.baseUrl}/api/projects/${project._id}/models/`, {
  //       headers: {
  //         Accept: 'application/json',
  //         authorization: `Bearer ${token}`,
  //       },
  //       method: 'GET',
  //     })
  //       .then((res) => res.json())
  //       .then((models) => {
  //         signalManager().fireProjectModelLoadedSignal(project, models);
  //       });
  //   }
  // };

  // render(): React.ReactNode {
  //   return <></>;
  // }
}

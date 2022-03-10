import * as React from '@theia/core/shared/react';
import { Emitter, Event, MenuPath } from '@theia/core';
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
  // codicon,
  CompositeTreeNode,
} from '@theia/core/lib/browser';
import { nls } from '@theia/core/lib/common/nls';
// import { signalManager, Signals } from 'ecsnext-base/lib/signals/signal-manager';

// import { ECSNextProjectMenus } from '../ecsnext-explorer-command';
import { Category, CategoryNode, MemberNode } from './model-model';
import mockData from './model-tree.json';

// export const ECSNextProjectModelsWidgetOptions = Symbol('ECSNextProjectModelsWidgetOptions');
// export interface ECSNextProjectModelsWidgetOptions {
//   baseUrl?: string;
// }

export namespace TreeContextMenu {
  export const CONTEXT_MENU: MenuPath = ['theia-tree-editor-tree-context-menu'];
  export const ADD_MENU: MenuPath = ['theia-tree-editor-tree-add-menu'];
}

@injectable()
export class ECSNextProjectModelTreeWidget extends TreeWidget {
  static ID = 'ecsnext-project-models-widget';
  static LABEL = 'Models';

  // @inject(ECSNextProjectModelsWidgetOptions) protected readonly options: ECSNextProjectModelsWidgetOptions;
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

    this.id = ECSNextProjectModelTreeWidget.ID;
    this.title.label = ECSNextProjectModelTreeWidget.LABEL;

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

    this.model.refresh();
  }

  get onSelectionChange(): Event<readonly Readonly<MemberNode>[]> {
    return this.onTreeWidgetSelectionEmitter.event;
  }

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

  protected override renderTree(model: TreeModel): React.ReactNode {
    if (CompositeTreeNode.is(this.model.root) && !this.model.root.children.length) {
      return (
        <div className="theia-widget-noInfo no-outline">
          {nls.localizeByDefault('The active editor cannot provide outline information.')}
        </div>
      );
    }
    return super.renderTree(model);
  }
}

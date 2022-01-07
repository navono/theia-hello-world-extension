import { Emitter, Event } from '@theia/core';
import * as React from '@theia/core/shared/react';
import {
  ContextMenuRenderer,
  TreeModel,
  TreeProps,
  TreeWidget,
  TreeNode,
  ExpandableTreeNode,
  LabelProvider,
} from '@theia/core/lib/browser';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { FamilyRootNode, MemberNode } from './family-tree';
import { Family } from './family';
import { ReactNode } from '@theia/core/shared/react';

@injectable()
export class FamilyTreeWidget extends TreeWidget {
  static readonly ID = 'family-tree-widget';

  static readonly LABEL = 'Family Tree';

  protected onTreeWidgetSelectionEmitter = new Emitter<readonly Readonly<MemberNode>[]>();

  constructor(
    @inject(TreeProps) readonly props: TreeProps,
    @inject(TreeModel) readonly model: TreeModel,
    @inject(LabelProvider) readonly labelProvider: LabelProvider,
    @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer
  ) {
    super(props, model, contextMenuRenderer);

    this.title.label = FamilyTreeWidget.LABEL;
    this.title.caption = FamilyTreeWidget.LABEL;
    this.title.iconClass = 'codicon codicon-person';
    this.id = FamilyTreeWidget.ID;

    const family: Family = {
      name: 'Vestrit',
      members: [
        {
          firstName: 'Ephron',
          nickName: 'Ephy',
          children: [
            {
              firstName: 'Keffria',
              nickName: 'Keff',
              children: [
                {
                  firstName: 'Wintrow',
                  nickName: 'Win',
                },
                {
                  firstName: 'Malta',
                  nickName: 'Ederling Queen',
                  children: [
                    {
                      firstName: 'Ephron Bendir',
                      nickName: 'Ben',
                    },
                  ],
                },
                {
                  firstName: 'Selden',
                  nickName: 'Ederling Prince',
                },
              ],
            },
            {
              firstName: 'Althea',
              nickName: 'Alth',
            },
          ],
        },
      ],
    };

    const root: FamilyRootNode = {
      id: 'family-root',
      name: 'family-root',
      visible: false,
      parent: undefined,
      children: [],
      family,
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
  }

  get onSelectionChange(): Event<readonly Readonly<MemberNode>[]> {
    return this.onTreeWidgetSelectionEmitter.event;
  }

  protected isExpandable(node: TreeNode): node is ExpandableTreeNode {
    if (FamilyRootNode.is(node)) return true;

    if (MemberNode.is(node) && node.member.children) return node.member.children.length > 0;

    return false;
  }

  protected renderIcon(node: TreeNode): ReactNode {
    return <div className={this.labelProvider.getIcon(node)}></div>;
  }
}

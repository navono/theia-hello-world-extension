/* eslint-disable @typescript-eslint/no-namespace */
import { TreeImpl, CompositeTreeNode, TreeNode, ExpandableTreeNode, SelectableTreeNode } from '@theia/core/lib/browser';
import { injectable } from '@theia/core/shared/inversify';

export interface Category {
  name: string;
  children: Member[];
}

export interface Member {
  ID: string;
  Title: string;
  Type: string;
  Lang?: string;
  children?: Member[];
}

@injectable()
export class ModelTreeNodeFactory extends TreeImpl {
  protected resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {
    if (CategoryNode.is(parent)) {
      return Promise.resolve(parent.category.children.map((m) => this.makeMemberNode(m)));
    }

    if (MemberNode.is(parent) && parent.children) {
      return Promise.resolve(parent.member.children?.map((m) => this.makeMemberNode(m)) || []);
    }

    return Promise.resolve(Array.from(parent.children));
  }

  makeMemberNode(m: Member) {
    const node: MemberNode = {
      id: m.ID,
      name: m.Title,
      parent: undefined,
      expanded: false,
      selected: false,
      children: [],
      member: m,
    };
    return node;
  }
}

export interface CategoryNode extends CompositeTreeNode {
  category: Category;
}

// eslint-disable-next-line no-redeclare
export namespace CategoryNode {
  export function is(node: object): node is CategoryNode {
    return !!node && 'category' in node;
  }
}

export interface MemberNode extends CompositeTreeNode, ExpandableTreeNode, SelectableTreeNode {
  member: Member;
}

// eslint-disable-next-line no-redeclare
export namespace MemberNode {
  export function is(node: object): node is MemberNode {
    const memberNode = node as any;
    const member = memberNode.type !== 'CRL' && memberNode.type !== 'SITE' && memberNode.type !== 'SNS';
    return !!node && member;
  }
}

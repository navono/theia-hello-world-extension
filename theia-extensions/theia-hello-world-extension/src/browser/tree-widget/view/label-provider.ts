import { LabelProvider, LabelProviderContribution, codicon, TreeNode } from '@theia/core/lib/browser';
import { injectable, inject } from '@theia/core/shared/inversify';
import { FamilyRootNode, MemberNode } from '../tree/family-tree';

export const DEFAULT_VIEW_ICON = codicon('info');

@injectable()
export class FamilyViewLabelProvider implements LabelProviderContribution {
  @inject(LabelProvider)
  protected readonly labelProvider: LabelProvider;

  canHandle(element: TreeNode): number {
    console.log('Family view label provider', element);

    return 100;
  }

  // getIcon(node: ResourcePropertiesCategoryNode | ResourcePropertiesItemNode): string {
  //   if (ResourcePropertiesCategoryNode.is(node)) {
  //     return node.icon ?? DEFAULT_INFO_ICON;
  //   }
  //   return node.icon ?? '';
  // }

  getName(node: FamilyRootNode | MemberNode): string {
    if (MemberNode.is(node)) {
      return node.member.firstName;
    }

    if (FamilyRootNode.is(node)) {
      return node.family.name;
    }

    return '';
  }
}

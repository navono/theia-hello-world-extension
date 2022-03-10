import { injectable } from '@theia/core/shared/inversify';
import { CompositeTreeNode, TreeModelImpl, ExpandableTreeNode, TreeNode } from '@theia/core/lib/browser';

@injectable()
export class ProjectModfelTreeModel extends TreeModelImpl {
  /**
   * Handle the expansion of the tree node.
   * - The method is a no-op in order to preserve focus on the editor
   * after attempting to perform a `collapse-all`.
   * @param node the expandable tree node.
   */
  protected override handleExpansion(node: Readonly<ExpandableTreeNode>): void {
    // no-op
  }

  override async collapseAll(raw?: Readonly<CompositeTreeNode>): Promise<boolean> {
    const node = raw || this.selectedNodes[0];
    if (CompositeTreeNode.is(node)) {
      return this.expansionService.collapseAll(node);
    }
    return false;
  }

  /**
   * The default behavior of `openNode` calls `doOpenNode` which by default
   * toggles the expansion of the node. Overriding to prevent expansion, but
   * allow for the `onOpenNode` event to still fire on a double-click event.
   */
  override openNode(raw?: TreeNode | undefined): void {
    const node = raw || this.selectedNodes[0];
    if (node) {
      this.onOpenNodeEmitter.fire(node);
    }
  }
}

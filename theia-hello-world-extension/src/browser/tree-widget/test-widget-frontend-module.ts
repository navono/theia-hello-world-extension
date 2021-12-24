import {
  createTreeContainer,
  TreeWidget,
  TreeImpl,
  Tree,
} from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';

/* eslint-disable */
import '../../../src/browser/tree-widget/style/index.css';
import { FamilyTreeWidget } from './tree/family-tree-widget';
import { FamilyTree } from './tree/family-tree';

export function createFamilyTreeWidget(
  parent: interfaces.Container,
): FamilyTreeWidget {
  const child = createTreeContainer(parent);

  child.unbind(TreeImpl);
  child.bind(FamilyTree).toSelf();
  child.rebind(Tree).toService(FamilyTree);

  child.unbind(TreeWidget);
  child.bind(FamilyTreeWidget).toSelf();

  return child.get(FamilyTreeWidget);
}

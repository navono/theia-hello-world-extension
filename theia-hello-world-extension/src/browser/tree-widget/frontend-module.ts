import {
  FrontendApplicationContribution,
  bindViewContribution,
  LabelProviderContribution,
  WidgetFactory,
  createTreeContainer,
  TreeWidget,
  TreeImpl,
  Tree,
} from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';

/* eslint-disable */
import '../../../src/browser/tree-widget/style/index.css';
import { FamilyTreeWidgetContribution } from './tree/family-tree-contribution';
import { FamilyTreeWidget } from './tree/Family-tree-widget';
import { FamilyTree } from './tree/family-tree';
import { FamilyTreeLabelProviderContribution } from './tree/label-provider-contribution';


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


export const bindTreeWidget = (bind: interfaces.Bind) => {
  bindViewContribution(bind, FamilyTreeWidgetContribution);
  bind(FrontendApplicationContribution).toService(FamilyTreeWidgetContribution);
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: FamilyTreeWidget.ID,
      createWidget: () => createFamilyTreeWidget(ctx.container),
    }))
    .inSingletonScope();

  // label binding
  bind(FamilyTreeLabelProviderContribution).toSelf().inSingletonScope();
  bind(LabelProviderContribution).toService(FamilyTreeLabelProviderContribution);
};
import { LabelProvider, LabelProviderContribution, codicon } from '@theia/core/lib/browser';
import { TreeLabelProvider } from '@theia/core/lib/browser/tree/tree-label-provider';
import { inject, injectable } from '@theia/core/shared/inversify';

@injectable()
export class FamilyTreeLabelProviderContribution implements LabelProviderContribution {
  @inject(LabelProvider)
  protected readonly labelProvider: LabelProvider;

  @inject(TreeLabelProvider)
  protected readonly treeLabelProvider: TreeLabelProvider;

  canHandle(element: object): number {
    return this.treeLabelProvider.canHandle(element) + 1;
  }

  //   getName(node: object): string {
  //     return this.labelProvider.getName(node.uri);
  // }

  getIcon(): string {
    return codicon('home my-family-icon');
  }
}

import { LabelProviderContribution } from '@theia/core/lib/browser';
import { FileStatNode } from '@theia/filesystem/lib/browser/file-tree/file-tree';
import { FileTreeLabelProvider } from '@theia/filesystem/lib/browser/file-tree/file-tree-label-provider';
import { injectable } from '@theia/core/shared/inversify';
import URI from '@theia/core/lib/common/uri';

@injectable()
export class CustomLabelProviderContribution implements LabelProviderContribution {
  canHandle(element: object): number {
    if (element instanceof URI && element.path.ext === '.my') {
      return Number.MAX_SAFE_INTEGER;
    }

    return 0;
  }

  getIcon(): string {
    // return 'fa fa-star-o';
    return 'codicon codicon-home my-file-icon';
  }
}

@injectable()
export class CustomTreeLabelProviderContribution extends FileTreeLabelProvider {
  canHandle(element: object): number {
    if (FileStatNode.is(element)) {
      const uri = element.uri;

      if (uri.path.ext === '.my') {
        return super.canHandle(element) + 1;
      }
    }

    return 0;
  }

  getIcon(): string {
    // return 'fa fa-star-o';
    return 'codicon codicon-home my-file-icon';
  }
}

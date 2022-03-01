import { BaseTreeEditorContribution, MasterTreeWidget, TreeEditor } from 'tree-view';
import {
  ApplicationShell,
  NavigatableWidgetOptions,
  OpenerService,
  WidgetOpenerOptions,
} from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable } from 'inversify';

import { ProjectDetailWidget } from './project-detail-widget';
import { TreeLabelProvider } from './tree/tree-label-provider';
import { TreeModelService } from './tree/tree-model-service';

@injectable()
export class ProjectDetailContribution extends BaseTreeEditorContribution {
  @inject(ApplicationShell) protected shell: ApplicationShell;
  @inject(OpenerService) protected opener: OpenerService;

  constructor(
    @inject(TreeModelService) modelService: TreeEditor.ModelService,
    @inject(TreeLabelProvider) labelProvider: TreeLabelProvider
  ) {
    super(ProjectDetailWidget.EDITOR_ID, modelService, labelProvider);
  }

  readonly id = ProjectDetailWidget.WIDGET_ID;
  readonly label = MasterTreeWidget.WIDGET_LABEL;

  canHandle(uri: URI): number {
    if (uri.path.ext === '.tree') {
      return 1000;
    }
    return 0;
  }

  protected createWidgetOptions(uri: URI, _options?: WidgetOpenerOptions): NavigatableWidgetOptions {
    return {
      kind: 'navigatable',
      uri: this.serializeUri(uri),
    };
  }

  protected serializeUri(uri: URI): string {
    return uri.withoutFragment().toString();
  }
}

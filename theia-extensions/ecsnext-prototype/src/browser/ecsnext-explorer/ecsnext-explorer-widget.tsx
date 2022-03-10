import { injectable, inject, postConstruct, interfaces, Container } from '@theia/core/shared/inversify';
import { codicon, ViewContainer, BaseWidget, PanelLayout, Tree, TreeImpl } from '@theia/core/lib/browser';
import {
  createTreeContainer,
  defaultTreeProps,
  TreeProps,
  TreeWidget as TheiaTreeWidget,
} from '@theia/core/lib/browser/tree';

import { ECSNextProjectViewsWidget } from './sub-widgets/ecsnext-project-view-widget';
import { ECSNextProjectUserWidget, ECSNextProjectUserWidgetOptions } from './sub-widgets/ecsnext-project-user-widget';
import { ECSNextProjectModelTreeWidget, TreeContextMenu } from './sub-widgets/model/ecsnext-project-model-widget';
import { ModelTreeNodeFactory } from './sub-widgets/model/model-model';

export const ECSNextExplorerWidgetOptions = Symbol('ECSNextExplorerWidgetOptions');
export interface ECSNextExplorerWidgetOptions {
  baseUrl?: string;
}

export const TREE_PROPS = {
  ...defaultTreeProps,
  contextMenuPath: TreeContextMenu.CONTEXT_MENU,
  multiSelect: false,
  search: false,
} as TreeProps;

const createModelTreeWidget = (parent: interfaces.Container): ECSNextProjectModelTreeWidget => {
  const treeContainer = createTreeContainer(parent);

  treeContainer.unbind(TreeImpl);
  treeContainer.bind(ModelTreeNodeFactory).toSelf();
  treeContainer.rebind(Tree).toService(ModelTreeNodeFactory);

  treeContainer.unbind(TheiaTreeWidget);
  treeContainer.bind(ECSNextProjectModelTreeWidget).toSelf();
  treeContainer.rebind(TreeProps).toConstantValue(TREE_PROPS);
  return treeContainer.get(ECSNextProjectModelTreeWidget);
};

@injectable()
export class ECSNextExplorerWidget extends BaseWidget {
  static LABEL = 'ECSNext prototype';
  static ID = 'ecsnext-explorer';

  protected viewContainer!: ViewContainer;

  @inject(ViewContainer.Factory) protected readonly viewContainerFactory!: ViewContainer.Factory;
  @inject(ECSNextExplorerWidgetOptions) protected readonly options: ECSNextExplorerWidgetOptions;
  @inject(ECSNextProjectViewsWidget) protected readonly projectViewsWidget!: ECSNextProjectViewsWidget;
  @inject(ECSNextProjectUserWidget) protected readonly projectUserWidget!: ECSNextProjectUserWidget;
  @inject(ECSNextProjectModelTreeWidget) protected readonly projectModelTreeWidget!: ECSNextProjectModelTreeWidget;

  static createWidget(parent: interfaces.Container, opt: ECSNextExplorerWidgetOptions): ECSNextExplorerWidget {
    return ECSNextExplorerWidget.createContainer(parent, opt).get(ECSNextExplorerWidget);
  }

  static createContainer(parent: interfaces.Container, opt: ECSNextExplorerWidgetOptions): Container {
    const child = new Container({ defaultScope: 'Singleton' });
    child.parent = parent;

    child.bind(ECSNextProjectViewsWidget).toSelf();

    // child.bind(ECSNextProjectModelsWidgetOptions).toConstantValue(opt);
    child.bind(ECSNextProjectModelTreeWidget).toDynamicValue((ctx) => createModelTreeWidget(ctx.container));

    child.bind(ECSNextProjectUserWidget).toSelf();
    child.bind(ECSNextProjectUserWidgetOptions).toConstantValue(opt);

    child.bind(ECSNextExplorerWidgetOptions).toConstantValue(opt);
    child.bind(ECSNextExplorerWidget).toSelf().inSingletonScope();

    return child;
  }

  @postConstruct()
  init(): void {
    this.id = ECSNextExplorerWidget.ID;
    this.title.label = ECSNextExplorerWidget.LABEL;
    this.title.caption = ECSNextExplorerWidget.LABEL;
    this.title.iconClass = codicon('file-submodule');
    this.title.closable = true;
    this.viewContainer = this.viewContainerFactory({
      id: this.id,
    });
    this.viewContainer.addWidget(this.projectViewsWidget);
    this.viewContainer.addWidget(this.projectModelTreeWidget);
    this.viewContainer.addWidget(this.projectUserWidget);
    this.toDispose.push(this.viewContainer);

    const layout = (this.layout = new PanelLayout());
    layout.addWidget(this.viewContainer);
    this.node.tabIndex = 0;

    // signalManager().on(Signals.OPENED_TRACES_UPDATED, this.onUpdateSignal);
    this.update();
  }
}

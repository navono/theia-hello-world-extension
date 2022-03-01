import { injectable, inject, postConstruct, interfaces, Container } from '@theia/core/shared/inversify';
import { codicon, ViewContainer, BaseWidget, PanelLayout } from '@theia/core/lib/browser';

import { ECSNextProjectViewsWidget } from './sub-widgets/ecsnext-project-view-widget';
import { ECSNextProjectModelsWidget } from './sub-widgets/ecsnext-project-model-widget';

@injectable()
export class ECSNextExplorerWidget extends BaseWidget {
  static LABEL = 'ECSNext prototype';
  static ID = 'ecsnext-explorer';

  protected viewContainer!: ViewContainer;

  @inject(ECSNextProjectViewsWidget) protected readonly projectViewsWidget!: ECSNextProjectViewsWidget;
  @inject(ECSNextProjectModelsWidget) protected readonly projectModelsWidget!: ECSNextProjectModelsWidget;

  @inject(ViewContainer.Factory) protected readonly viewContainerFactory!: ViewContainer.Factory;

  static createWidget(parent: interfaces.Container): ECSNextExplorerWidget {
    return ECSNextExplorerWidget.createContainer(parent).get(ECSNextExplorerWidget);
  }

  static createContainer(parent: interfaces.Container): Container {
    const child = new Container({ defaultScope: 'Singleton' });
    child.parent = parent;
    child.bind(ECSNextProjectViewsWidget).toSelf();
    child.bind(ECSNextProjectModelsWidget).toSelf();
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
    this.viewContainer.addWidget(this.projectModelsWidget);
    this.toDispose.push(this.viewContainer);

    const layout = (this.layout = new PanelLayout());
    layout.addWidget(this.viewContainer);
    this.node.tabIndex = 0;
    // signalManager().on(Signals.OPENED_TRACES_UPDATED, this.onUpdateSignal);
    this.update();
  }
}

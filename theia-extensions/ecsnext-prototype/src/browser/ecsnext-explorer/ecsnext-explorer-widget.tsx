import { injectable, inject, postConstruct, interfaces, Container } from '@theia/core/shared/inversify';
import { codicon, ViewContainer, BaseWidget, PanelLayout } from '@theia/core/lib/browser';

import { ECSNextProjectViewsWidget } from './sub-widgets/ecsnext-project-view-widget';
import { ECSNextProjectUserWidget, ECSNextProjectUserWidgetOptions } from './sub-widgets/ecsnext-project-user-widget';
import {
  ECSNextProjectModelsWidget,
  ECSNextProjectModelsWidgetOptions,
} from './sub-widgets/ecsnext-project-model-widget';

export const ECSNextExplorerWidgetOptions = Symbol('ECSNextExplorerWidgetOptions');
export interface ECSNextExplorerWidgetOptions {
  baseUrl?: string;
}

@injectable()
export class ECSNextExplorerWidget extends BaseWidget {
  static LABEL = 'ECSNext prototype';
  static ID = 'ecsnext-explorer';

  protected viewContainer!: ViewContainer;

  @inject(ViewContainer.Factory) protected readonly viewContainerFactory!: ViewContainer.Factory;
  @inject(ECSNextExplorerWidgetOptions) protected readonly options: ECSNextExplorerWidgetOptions;
  @inject(ECSNextProjectViewsWidget) protected readonly projectViewsWidget!: ECSNextProjectViewsWidget;
  @inject(ECSNextProjectUserWidget) protected readonly projectUserWidget!: ECSNextProjectUserWidget;
  @inject(ECSNextProjectModelsWidget) protected readonly projectModelsWidget!: ECSNextProjectModelsWidget;

  static createWidget(parent: interfaces.Container, opt: ECSNextExplorerWidgetOptions): ECSNextExplorerWidget {
    return ECSNextExplorerWidget.createContainer(parent, opt).get(ECSNextExplorerWidget);
  }

  static createContainer(parent: interfaces.Container, opt: ECSNextExplorerWidgetOptions): Container {
    const child = new Container({ defaultScope: 'Singleton' });
    child.parent = parent;

    child.bind(ECSNextProjectViewsWidget).toSelf();
    child.bind(ECSNextProjectModelsWidgetOptions).toConstantValue(opt);

    child.bind(ECSNextProjectUserWidget).toSelf();
    child.bind(ECSNextProjectUserWidgetOptions).toConstantValue(opt);

    child.bind(ECSNextProjectModelsWidget).toSelf();
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
    this.viewContainer.addWidget(this.projectUserWidget);
    this.viewContainer.addWidget(this.projectModelsWidget);
    this.toDispose.push(this.viewContainer);

    const layout = (this.layout = new PanelLayout());
    layout.addWidget(this.viewContainer);
    this.node.tabIndex = 0;

    // signalManager().on(Signals.OPENED_TRACES_UPDATED, this.onUpdateSignal);
    this.update();
  }
}

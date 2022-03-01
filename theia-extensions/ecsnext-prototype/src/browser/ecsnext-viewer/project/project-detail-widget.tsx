import { inject, injectable, interfaces, Container } from '@theia/core/shared/inversify';
import { DefaultResourceProvider } from '@theia/core/lib/common';
import { Title, Widget } from '@theia/core/lib/browser';
import { EditorPreferences } from '@theia/editor/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { ResourceTreeEditorWidget, MasterTreeWidget, DetailFormWidget, TreeEditor } from 'tree-view';
import { createBasicTreeContainer, NavigatableTreeEditorOptions } from 'tree-view';

import { TreeModelService, TreeNodeFactory } from './tree';

@injectable()
export class ProjectDetailWidget extends ResourceTreeEditorWidget {
  constructor(
    @inject(MasterTreeWidget)
    readonly treeWidget: MasterTreeWidget,
    @inject(DetailFormWidget)
    readonly formWidget: DetailFormWidget,
    @inject(WorkspaceService)
    readonly workspaceService: WorkspaceService,
    @inject(NavigatableTreeEditorOptions)
    protected readonly options: NavigatableTreeEditorOptions,
    @inject(DefaultResourceProvider)
    protected provider: DefaultResourceProvider,
    @inject(TreeEditor.NodeFactory)
    protected readonly nodeFactory: TreeEditor.NodeFactory,
    @inject(EditorPreferences)
    protected readonly editorPreferences: EditorPreferences
  ) {
    super(
      treeWidget,
      formWidget,
      workspaceService,
      ProjectDetailWidget.WIDGET_ID,
      options,
      provider,
      nodeFactory,
      editorPreferences
    );
  }

  static createWidget(parent: interfaces.Container): ProjectDetailWidget {
    return ProjectDetailWidget.createContainer(parent).get(ProjectDetailWidget);
  }

  static createContainer(parent: interfaces.Container): interfaces.Container {
    // const child = new Container({ defaultScope: 'Singleton' });
    // child.parent = parent;

    const treeContainer = createBasicTreeContainer(parent, ProjectDetailWidget, TreeModelService, TreeNodeFactory);
    // Bind options
    // const uri = new URI(options.uri);
    // treeContainer.bind(NavigatableTreeEditorOptions).toConstantValue({ uri });
    return treeContainer;
  }

  protected getTypeProperty() {
    return 'typeId';
  }

  protected configureTitle(title: Title<Widget>): void {
    super.configureTitle(title);
    title.iconClass = 'fa fa-coffee dark-purple';
  }
}

export namespace ProjectDetailWidget {
  export const WIDGET_ID = 'tree-editor-example-tree-editor';
  export const EDITOR_ID = 'tree-editor-example.tree.editor';
}

// import * as React from '@theia/core/shared/react';
// import { injectable, postConstruct } from '@theia/core/shared/inversify';
// import { ReactWidget } from '@theia/core/lib/browser';

// @injectable()
// export class ProjectDetailWidget extends ReactWidget {
//   static ID = 'ecsnext-project-detial-widget';

//   static LABEL = 'Project Detail';

//   @postConstruct()
//   async init(): Promise<void> {
//     this.id = ProjectDetailWidget.ID;
//     this.title.label = ProjectDetailWidget.LABEL;
//     // this._experimentManager = this.tspClientProvider.getExperimentManager();
//     // this.tspClientProvider.addTspClientChangeListener(() => {
//     //   this._experimentManager = this.tspClientProvider.getExperimentManager();
//     // });
//     this.update();
//   }

//   render(): React.ReactNode {
//     return <div>This is project detail page</div>;
//   }
// }

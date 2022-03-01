/********************************************************************************
 * Copyright (c) 2019-2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
import { DefaultResourceProvider, Resource } from '@theia/core/lib/common';
import { EditorPreferences } from '@theia/editor/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { postConstruct } from '@theia/core/shared/inversify';

import { DetailFormWidget } from '../detail-form-widget';
import { TreeEditor } from '../interfaces';
import { AddCommandProperty, MasterTreeWidget } from '../master-tree-widget';
import { NavigatableTreeEditorOptions, NavigatableTreeEditorWidget } from '../navigatable-tree-editor-widget';

export abstract class ResourceTreeEditorWidget extends NavigatableTreeEditorWidget {
  protected resource: Resource | undefined;
  protected data: any;

  constructor(
    protected readonly treeWidget: MasterTreeWidget,
    protected readonly formWidget: DetailFormWidget,
    protected readonly workspaceService: WorkspaceService,
    readonly widget_id: string,
    protected readonly options: NavigatableTreeEditorOptions,
    protected readonly provider: DefaultResourceProvider,
    protected readonly nodeFactory: TreeEditor.NodeFactory,
    protected readonly editorPreferences: EditorPreferences
  ) {
    super(treeWidget, formWidget, workspaceService, widget_id, options);
  }

  @postConstruct()
  protected init(): void {
    super.init();
    const uri = this.options.uri;
    this.provider.get(uri).then(
      (resource) => {
        this.resource = resource;
        this.load();
      },
      (_) => console.error(`Could not create ressource for uri ${uri}`)
    );

    this.autoSave = this.editorPreferences['editor.autoSave'];
    this.editorPreferences.onPreferenceChanged((ev) => {
      if (ev.preferenceName === 'editor.autoSave') {
        this.autoSave = ev.newValue === 'on' ? 'on' : 'off';
      }
    });
    this.onDirtyChanged((ev) => {
      if (this.autoSave === 'on' && this.dirty) {
        this.save();
      }
    });
  }

  /**
   * @return the property that contains data objects' type identifier.
   */
  protected abstract getTypeProperty(): string;

  public save(): void {
    if (!this.resource) {
      return;
    }

    const content = JSON.stringify(this.data);
    (this.resource as any).saveContents(content).then(
      () => this.setDirty(false),
      (error: any) => console.error(`Ressource ${this.uri} could not be saved.`, error)
    );
  }

  protected async load(): Promise<void> {
    let content = undefined;
    let error = false;
    try {
      content = await (this.resource as any).readContents();
    } catch (e) {
      console.error(`Loading ${(this.resource as any).uri} failed.`, e);
      error = true;
    }

    const json = JSON.parse(content);
    this.data = json;
    const treeData: TreeEditor.TreeData = {
      error,
      data: json,
    };
    this.treeWidget.setData(treeData);
  }

  protected async deleteNode(node: Readonly<TreeEditor.Node>): Promise<void> {
    if (node.parent && TreeEditor.Node.is(node.parent)) {
      const propertyData = node.parent.jsonforms.data[node.jsonforms.property];
      if (Array.isArray(propertyData)) {
        propertyData.splice(Number(node.jsonforms.index), 1);
        // eslint-disable-next-line no-null/no-null
      } else if (propertyData !== null && typeof propertyData === 'object') {
        propertyData[node.jsonforms.index || ''] = undefined;
      } else {
        console.error(
          `Could not delete node's data from its parent's property ${node.jsonforms.property}. Property data:`,
          propertyData
        );
        return;
      }

      // Data was changed in place but need to trigger tree updates.
      await this.treeWidget.updateDataForSubtree(node.parent, node.parent.jsonforms.data);
      this.handleChanged();
    }
  }

  protected async addNode({ node, type, property }: AddCommandProperty): Promise<void> {
    // Create an empty object that only contains its type identifier
    const newData: { [k: string]: any } = {};
    newData[this.getTypeProperty()] = type;

    // TODO handle children not being stored in an array

    if (!node.jsonforms.data[property]) {
      node.jsonforms.data[property] = [];
    }
    node.jsonforms.data[property].push(newData);
    await this.treeWidget.updateDataForSubtree(node, node.jsonforms.data);
    this.handleChanged();
  }

  protected async handleFormUpdate(data: any, node: TreeEditor.Node): Promise<void> {
    await this.treeWidget.updateDataForSubtree(node, data);
    this.handleChanged();
  }

  /**
   * Called when a change occurred. Handle based on the autoSave flag.
   */
  protected handleChanged(): void {
    if (this.autoSave === 'on') {
      this.save();
    } else {
      this.setDirty(true);
    }
  }
}

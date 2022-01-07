/* eslint-disable @typescript-eslint/no-redeclare */
import * as React from '@theia/core/shared/react';
import * as ReactDOM from '@theia/core/shared/react-dom';
// import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
import { LabelProvider } from '@theia/core/lib/browser/label-provider';

import URI from '@theia/core/lib/common/uri';
import { Disposable } from '@theia/core';
import { JsonschemaFormView } from './Jsonschema-form-view';
import { BaseWidget } from '@theia/core/lib/browser/widgets';

export const JsonschemaFormWidgetOptions = Symbol('JsonschemaFormWidgetOptions');
export interface JsonschemaFormWidgetOptions {
  uri: string;
}

@injectable()
export class JsonschemaFormWidget extends BaseWidget {
  static id = 'jsonschema-form-widget';

  @inject(JsonschemaFormWidgetOptions)
  protected readonly options: JsonschemaFormWidgetOptions;

  @inject(LabelProvider) protected readonly labelProvider: LabelProvider;

  @postConstruct()
  protected async init(): Promise<void> {
    const { uri } = this.options;
    this.id = JsonschemaFormWidget.id + ':' + uri;
    this.title.label = this.labelProvider.getName(new URI(uri));
    this.title.closable = true;

    this.node.style.padding = '0px 15px';
    this.node.style.color = 'var(--theia-ui-font-color1)';
    this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.node)));
    this.update();
    ReactDOM.render(<JsonschemaFormView />, this.node);
  }
}

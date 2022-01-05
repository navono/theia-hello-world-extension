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

  // @inject(CommandService)
  // protected readonly commands: CommandService;

  // protected sayHello: HTMLButtonElement;

  // @postConstruct()
  // protected async init(): Promise<void> {
  //   const { uri } = this.options;
  //   this.id = JsonschemaFormWidget.id + ':' + uri;
  //   this.title.label = 'Form ' + new URI(uri).displayName;
  //   this.title.closable = true;

  //   this.sayHello = document.createElement('button');
  //   this.sayHello.textContent = JsonschemaFormCommand.label;
  //   this.node.appendChild(this.sayHello);
  // }

  // protected onActivateRequest(message: Message): void {
  //   super.onActivateRequest(message);
  //   this.sayHello.focus();
  // }

  // protected onBeforeAttach(message: Message): void {
  //   super.onBeforeAttach(message);
  //   this.addEventListener(this.sayHello, 'click', () => this.commands.executeCommand(JsonschemaFormCommand.id));
  // }

  @postConstruct()
  protected async init(): Promise<void> {
    const { uri } = this.options;
    this.id = JsonschemaFormWidget.id + ':' + uri;
    // this.title.label = 'Form ' + new URI(uri).displayName;
    this.title.label = this.labelProvider.getName(new URI(uri));
    this.title.closable = true;

    this.node.style.padding = '0px 15px';
    this.node.style.color = 'var(--theia-ui-font-color1)';
    this.toDispose.push(Disposable.create(() => ReactDOM.unmountComponentAtNode(this.node)));
    this.update();
    ReactDOM.render(<JsonschemaFormView />, this.node);
  }

  // protected render(): React.ReactNode {
  //   return <div></div>;
  // }

  //   protected render(): React.ReactNode {
  //     const header = `This is a sample widget which simply calls the messageService
  //     in order to display an info message to end users.`;
  //     return (<div id='widget-container'>
  //         <AlertMessage type='INFO' header={header} />
  //         <h2>Test</h2>
  //         <button className='theia-button secondary' title='Display Message' onClick={_a => this.displayMessage()}>Display Message</button>
  //         <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr max-content'}}>
  //             <div style={{verticalAlign: "center"}}>
  //                 My Field:
  //             </div>
  //             <input type="text"/>
  //             <button>Browser...</button>
  //         </div>
  //     </div>);
  // }

  //   protected displayMessage(): void {
  //       this.messageService.info('Congratulations: TestWidget Widget Successfully Created!');
  //   }
}

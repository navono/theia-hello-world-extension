import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';

@injectable()
export class EcsnextPrototypeWidget extends ReactWidget {
  static readonly ID = 'ecsnext-prototype:widget';
  static readonly LABEL = 'ECSNext';

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = EcsnextPrototypeWidget.ID;
    this.title.label = EcsnextPrototypeWidget.LABEL;
    this.title.caption = EcsnextPrototypeWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
    this.update();
  }

  render(): React.ReactElement {
    const header = `This is a sample widget which simply calls the messageService
        in order to display an info message to end users.`;
    return (
      <div id="widget-container">
        <AlertMessage type="INFO" header={header} />
        <button className="theia-button secondary" title="Display Message" onClick={(_a) => this.displayMessage()}>
          Display Message
        </button>
      </div>
    );
  }

  protected displayMessage(): void {
    this.messageService.info('Congratulations: EcsnextPrototype Widget Successfully Created!');
  }
}

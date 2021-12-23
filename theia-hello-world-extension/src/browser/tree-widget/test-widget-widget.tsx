import * as React from 'react';
import { injectable, postConstruct, inject } from 'inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';

@injectable()
export class TestWidgetWidget extends ReactWidget {

    static readonly ID = 'test-widget:widget';
    static readonly LABEL = 'TestWidget Widget';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = TestWidgetWidget.ID;
        this.title.label = TestWidgetWidget.LABEL;
        this.title.caption = TestWidgetWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    protected render(): React.ReactNode {
        const header = `This is a sample widget which simply calls the messageService
        in order to display an info message to end users.`;
        return <div id='widget-container'>
            <AlertMessage type='INFO' header={header} />
            <h2>Test</h2>
            <button className='theia-button secondary' title='Display Message' onClick={_a => this.displayMessage()}>Display Message</button>
            <div style={{display: 'grid', gridTemplateColumns: 'max-content 1fr max-content'}}>
                <div style={{verticalAlign: "center"}}>
                    My Field:
                </div>
                <input type="text"/>
                <button>Browser...</button>
            </div>
        </div>
    }

    protected displayMessage(): void {
        this.messageService.info('Congratulations: TestWidget Widget Successfully Created!');
    }

}

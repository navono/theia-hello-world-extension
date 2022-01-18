import { inject, injectable } from 'inversify';
import { Command, CommandContribution, CommandRegistry, MessageService } from '@theia/core';
import { ApplicationShell } from '@theia/core/lib/browser/shell/application-shell';
import { WebViewWidget } from './web-view-widget';
import { FocusTracker, Widget } from '@theia/core/lib/browser';

/**
 * View commands to show hide widgets in the side bar
 */
export namespace ViewCommands {
  const VIEW_CATEGORY = 'View';

  export const SHOW_WEB_VIEW: Command = {
    id: 'WebView.show',
    category: VIEW_CATEGORY,
    label: 'Web : Show View',
  };

  export const SUBSCRIBE_TO_ACTIVE_CHANGED: Command = {
    id: 'WebView.subscribe',
    category: VIEW_CATEGORY,
    label: 'Web : Subscribe To Activechanged',
  };
}

/**
 * Command contribution
 */
@injectable()
export class ViewCommandContribution implements CommandContribution {
  protected viewCount = 0;

  @inject(ApplicationShell)
  protected readonly applicationShell: ApplicationShell | any;

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(ViewCommands.SHOW_WEB_VIEW, {
      execute: () => this.openWebView(),
    });

    commands.registerCommand(ViewCommands.SUBSCRIBE_TO_ACTIVE_CHANGED, {
      execute: () => this.subscribeToActivechanged(),
    });
  }

  protected openWebView() {
    this.viewCount++;
    const title = `WebView${this.viewCount}`;

    // Open web view on the center area
    const webViewWidget = new WebViewWidget();
    webViewWidget.initialize(title, 'https://www.google.com/webhp?igu=1', true);

    this.applicationShell.addWidget(webViewWidget, { area: 'main' });
  }

  protected subscribeToActivechanged() {
    //////////////////////////////////////
    // Subscribe to Active changed signal
    //////////////////////////////////////
    this.applicationShell.activeChanged.connect(this.onApplicationShellActiveChanged, this);
  }

  /**
   * Handle active tab changed event
   * @param sender
   * @param args
   */
  private onApplicationShellActiveChanged(sender: ApplicationShell, args: FocusTracker.IChangedArgs<Widget>): void {
    if (args) {
      const message = `Active Tab Changed: ${args.oldValue?.title.label}, ${args.newValue?.title.label}`;
      this.messageService.info(message);
    }
  }
}

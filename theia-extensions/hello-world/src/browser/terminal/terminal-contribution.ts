import {
  Command,
  CommandContribution,
  CommandRegistry,
  MAIN_MENU_BAR,
  MenuContribution,
  MenuModelRegistry,
} from '@theia/core';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

const terminalCommand: Command = { id: 'my-terminal.command', label: 'Print to Terminal' };

@injectable()
export class MyTerminalCommandsContribution implements CommandContribution {
  @inject(TerminalService) private readonly terminalService: TerminalService;

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(terminalCommand, {
      execute: async () =>
        this.terminalService
          .newTerminal({
            title: 'My Terminal',
            // shellPath: 'C:\\Program Files (x86)\\Gow\\bin\\bash.exe',
            // shellArgs: ["echo 'test'"],
            // destroyTermOnClose: false,
          })
          .then((terminalWidget) => {
            terminalWidget.start().then((number) => {
              // this.terminalService.activateTerminal(terminalWidget);
              this.terminalService.getByTerminalId(number)?.activate();

              console.info(`terminal number ${number} ${terminalWidget}`);
              terminalWidget.sendText("echo -e 'Hello\\vWorld'\n");
            });
          }),
    });
  }
}

const MY_MAIN_MENU = [...MAIN_MENU_BAR, '10_mymenu'];
@injectable()
class MyTerminalMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerSubmenu(MY_MAIN_MENU, 'X');
    menus.registerMenuAction(MY_MAIN_MENU, { commandId: terminalCommand.id });
  }
}

export const bindTerminal = (bind: interfaces.Bind) => {
  // bind menu entry and command to execute command on terminal
  bind(MenuContribution).to(MyTerminalMenuContribution).inSingletonScope();
  bind(CommandContribution).to(MyTerminalCommandsContribution).inSingletonScope();
};

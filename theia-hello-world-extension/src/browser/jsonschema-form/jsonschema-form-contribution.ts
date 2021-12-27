import { injectable, inject, interfaces } from '@theia/core/shared/inversify';
import {
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  MessageService,
} from '@theia/core/lib/common';
import { CommonMenus } from '@theia/core/lib/browser';

const JsonschemaFormCommand = {
  id: 'JsonschemaForm.command',
  label: 'Shows a message',
};

@injectable()
class JsonschemaFormCommandContribution implements CommandContribution {
  constructor(@inject(MessageService) private readonly messageService: MessageService) {}

  registerCommands(command: CommandRegistry): void {
    command.registerCommand(JsonschemaFormCommand, {
      execute: () => this.messageService.info('Hello World from JSON-schema!'),
    });
  }
}

@injectable()
class JsonschemaFormMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(CommonMenus.EDIT_FIND, {
      commandId: JsonschemaFormCommand.id,
      label: 'Say Hello from json-schema',
    });
  }
}

export const bindJsonSchema = (bind: interfaces.Bind) => {
  bind(CommandContribution).to(JsonschemaFormCommandContribution).inSingletonScope();
  bind(MenuContribution).to(JsonschemaFormMenuContribution).inSingletonScope();
};

import { CommandRegistry, CommandContribution } from '@theia/core';
import { injectable } from '@theia/core/shared/inversify';
import {
  WidgetOpenerOptions,
  WidgetOpenHandler,
  KeybindingRegistry,
  KeybindingContribution,
} from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';

import { ECSNextViewerWidget, ECSNextViewerWidgetOptions } from './ecsnext-viewer-widget';
import { OpenProjectCommand } from './ecsnext-viewer-command';

interface ECSNextViewerWidgetOpenerOptions extends WidgetOpenerOptions {
  projectUUID: string;
}

@injectable()
export class ECSNextProjectViewerContribution
  extends WidgetOpenHandler<ECSNextViewerWidget>
  implements CommandContribution, KeybindingContribution
{
  readonly id = ECSNextViewerWidget.ID;
  readonly label = 'ECS Viewer';

  protected createWidgetOptions(uri: URI, options?: ECSNextViewerWidgetOpenerOptions): ECSNextViewerWidgetOptions {
    return {
      projectURI: uri.path.toString(),
      projectUUID: options?.projectUUID,
    };
  }

  registerKeybindings(_keybindings: KeybindingRegistry): void {
    // keybindings.registerKeybinding({
    //   keybinding: 'ctrlcmd+f1',
    //   command: KeyboardShortcutsCommand.id,
    // });
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(OpenProjectCommand, {
      execute: () => this.launchServer(),
    });
  }

  protected async launchServer(): Promise<void> {
    Promise.resolve();
  }

  canHandle(_uri: URI): number {
    return 100;
  }
}

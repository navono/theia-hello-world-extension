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
import { ProjectViewerCommand } from './ecsnext-viewer-command';

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
    registry.registerCommand(ProjectViewerCommand, {
      execute: (options: ECSNextViewerWidgetOpenerOptions) => this.openProjectView(options),
    });
  }

  async open(uri: URI, options?: ECSNextViewerWidgetOpenerOptions): Promise<ECSNextViewerWidget> {
    return super.open(uri, options);
  }

  protected openProjectView(options: ECSNextViewerWidgetOpenerOptions): void {
    this.open(new URI(''), options);
  }

  canHandle(_uri: URI): number {
    return 100;
  }
}

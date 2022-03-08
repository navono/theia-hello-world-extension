/* eslint-disable @typescript-eslint/no-namespace */
import { Command, MenuPath } from '@theia/core';

export namespace ExplorerMenus {
  export const PREFERENCE_EDITOR_CONTEXT_MENU: MenuPath = ['explorer-opened-project-traces-context-menu'];
}
export namespace ExplorerCommands {
  export const OPEN_TRACE: Command = {
    id: 'trace-explorer:open-trace',
  };

  export const CLOSE_TRACE: Command = {
    id: 'trace-explorer:close-trace',
    label: 'Close Trace',
  };

  export const REMOVE_TRACE: Command = {
    id: 'trace-explorer:remove-trace',
    label: 'Remove Trace',
  };
}

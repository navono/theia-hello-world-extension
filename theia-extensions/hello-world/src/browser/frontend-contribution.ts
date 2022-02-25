import { MenuContribution, MenuModelRegistry } from '@theia/core';
import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { injectable } from '@theia/core/shared/inversify';
import { MAIN_MENU_BAR } from '@theia/core';
// import { MonacoMenus } from '@theia/monaco/lib/browser/monaco-menu';
import { EditorMainMenu } from '@theia/editor/lib/browser';
import { TerminalMenus } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { CommonMenus } from '@theia/core/lib/browser/common-frontend-contribution';

@injectable()
export class HelloWorldFrontendContribution
  implements FrontendApplicationContribution, TabBarToolbarContribution, MenuContribution
{
  onStart(app: FrontendApplication): void {
    app.shell.leftPanelHandler.removeBottomMenu('settings-menu');
  }

  registerToolbarItems(registry: TabBarToolbarRegistry): void {
    // registry.registerItem({
    //   id: BoardsToolBarItem.TOOLBAR_ID,
    //   render: () => (
    //     <BoardsToolBarItem
    //       key="boardsToolbarItem"
    //       commands={this.commandRegistry}
    //       boardsServiceClient={this.boardsServiceClientImpl}
    //     />
    //   ),
    //   isVisible: (widget) =>
    //     ArduinoToolbar.is(widget) && widget.side === 'left',
    //   priority: 7,
    // });
    registry.registerItem({
      id: 'toggle-serial-monitor',
      command: 'serial-monitor:toggle-toolbar',
      // tooltip: nls.localize('arduino/common/serialMonitor', 'Serial Monitor'),
      tooltip: 'Serial Monitor',
    });
  }

  // registerCommands(commands: CommandRegistry): void {
  //   commands.registerCommand('', {
  //     execute: async (uri: URI) => {
  //       this.openSketchFiles(uri);
  //     },
  //   });
  // }

  registerMenus(menus: MenuModelRegistry): void {
    const menuId = (menuPath: string[]): string => {
      const index = menuPath.length - 1;
      return menuPath[index];
    };
    // menus.getMenu(MAIN_MENU_BAR).removeNode(menuId(MonacoMenus.SELECTION));
    menus.getMenu(MAIN_MENU_BAR).removeNode(menuId(EditorMainMenu.GO));
    menus.getMenu(MAIN_MENU_BAR).removeNode(menuId(TerminalMenus.TERMINAL));
    menus.getMenu(MAIN_MENU_BAR).removeNode(menuId(CommonMenus.VIEW));
  }
}

import { injectable } from '@theia/core/shared/inversify';
import { MAIN_MENU_BAR } from '@theia/core';
import { MonacoMenus } from '@theia/monaco/lib/browser/monaco-menu';
import { EditorMainMenu } from '@theia/editor/lib/browser';
import { TerminalMenus } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { DebugMenus } from '@theia/debug/lib/browser/debug-frontend-application-contribution';
// import { CommonMenus } from '@theia/core/lib/browser/common-frontend-contribution';
import { MenuModelRegistry } from '@theia/core/lib/common/menu';
import { DebugFrontendApplicationContribution as TheiaDebugFrontendApplicationContribution } from '@theia/debug/lib/browser/debug-frontend-application-contribution';

@injectable()
export class DebugFrontendApplicationContribution extends TheiaDebugFrontendApplicationContribution {
  async initializeLayout(): Promise<void> {
    // NOOP
  }

  registerMenus(registry: MenuModelRegistry): void {
    super.registerMenus(registry);

    const menuId = (menuPath: string[]): string => {
      const index = menuPath.length - 1;
      return menuPath[index];
    };

    // TODO. this should do in ApplicationShellContribution
    registry.getMenu(MAIN_MENU_BAR).removeNode(menuId(MonacoMenus.SELECTION));
    registry.getMenu(MAIN_MENU_BAR).removeNode(menuId(EditorMainMenu.GO));
    registry.getMenu(MAIN_MENU_BAR).removeNode(menuId(DebugMenus.DEBUG));
    registry.getMenu(MAIN_MENU_BAR).removeNode(menuId(TerminalMenus.TERMINAL));
  }
}

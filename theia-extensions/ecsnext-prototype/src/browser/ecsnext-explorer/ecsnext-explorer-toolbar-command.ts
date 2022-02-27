import { Command, MenuPath } from '@theia/core';

export namespace ECSNextToolbarCommands {
  export const OPEN_TRACE: Command = {
    id: 'ecsnext.viewer.openTrace',
    label: 'Create Project',
    iconClass: 'fa fa-folder-open-o fa-lg',
  };
}

export namespace ECSNextToolbarMenus {
  export const MARKER_CATEGORIES_MENU: MenuPath = ['trace-viewer-marker-categories-menu'];
  export const MARKER_SETS_MENU: MenuPath = ['trace-viewer-marker-sets-menu'];
}

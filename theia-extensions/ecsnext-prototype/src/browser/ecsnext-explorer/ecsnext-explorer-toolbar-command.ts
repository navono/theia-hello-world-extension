import { Command, MenuPath } from '@theia/core';
import { codicon } from '@theia/core/lib/browser';

export namespace ECSNextToolbarCommands {
  export const CREAT_PROJECT: Command = {
    id: 'ecsnext.viewer.createProject',
    label: 'Create Project',
    iconClass: codicon('add'),
  };
}

export namespace ECSNextToolbarMenus {
  export const MARKER_CATEGORIES_MENU: MenuPath = ['trace-viewer-marker-categories-menu'];
  export const MARKER_SETS_MENU: MenuPath = ['trace-viewer-marker-sets-menu'];
}

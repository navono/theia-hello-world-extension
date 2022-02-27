import { Command, MenuPath } from '@theia/core';

export namespace ECSNextProjectMenus {
  export const PREFERENCE_EDITOR_CONTEXT_MENU: MenuPath = ['ecsnext-explorer-project-context-menu'];
}

export namespace ECSNextProjectCommands {
  export const CREATE_PROJECT: Command = {
    id: 'project:create-project',
    label: 'Create Project',
  };

  export const DELETE_PROJECT: Command = {
    id: 'project:delete-project',
    label: 'Delete Project',
  };
}

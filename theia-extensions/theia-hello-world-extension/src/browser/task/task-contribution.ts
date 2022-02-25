import {
  Command,
  CommandContribution,
  CommandRegistry,
  MAIN_MENU_BAR,
  MenuContribution,
  MenuModelRegistry,
} from '@theia/core';
import { TaskContribution, TaskProviderRegistry, TaskService } from '@theia/task/lib/browser';
import { TaskConfiguration } from '@theia/task/lib/common/task-protocol';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

const myCreateTask: TaskConfiguration = {
  label: 'My Create Task',
  type: 'process',
  cwd: '${workspaceFolder}',
  command: 'touch',
  args: ['dummy.my'],
  _scope: '',
};

const myDeleteTask: TaskConfiguration = {
  label: 'My Delete Task',
  type: 'process',
  cwd: '${workspaceFolder}',
  command: 'rm',
  args: ['dummy.my'],
  _scope: '',
};

const taskCommand: Command = { id: 'my-task.command', label: 'Run ' + myCreateTask.label };

@injectable()
class MyTasksContribution implements TaskContribution {
  registerProviders(providers: TaskProviderRegistry) {
    providers.register('process', {
      provideTasks: () => new Promise((resolve) => resolve([myCreateTask, myDeleteTask])),
    });
  }
}

@injectable()
class MyTaskCommandsContribution implements CommandContribution {
  @inject(TaskService)
  private readonly taskService: TaskService;

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(taskCommand, { execute: () => this.taskService.runTask(myCreateTask) });
  }
}

const MY_MAIN_MENU = [...MAIN_MENU_BAR, '9_mymenu'];
@injectable()
class MyTaskMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(MY_MAIN_MENU, { commandId: taskCommand.id });
  }
}

export const bindTask = (bind: interfaces.Bind) => {
  // bind task contribution (register task)
  bind(TaskContribution).to(MyTasksContribution);
  // bind menu entry and command to trigger task
  bind(MenuContribution).to(MyTaskMenuContribution);
  bind(CommandContribution).to(MyTaskCommandsContribution);
};

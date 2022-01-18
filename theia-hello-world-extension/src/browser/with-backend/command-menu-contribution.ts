import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { Command, CommandContribution, CommandRegistry } from '@theia/core/lib/common';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';
import { HelloBackendWithClientService, HelloBackendService } from '../../common/protocol';
import { BackendClient, HELLO_BACKEND_PATH, HELLO_BACKEND_WITH_CLIENT_PATH } from '../../common/protocol';

const SayHelloViaBackendCommandWithCallBack: Command = {
  id: 'sayHelloOnBackendWithCallBack.command',
  label: 'Say hello on the backend with a callback to the client',
};

const SayHelloViaBackendCommand: Command = {
  id: 'sayHelloOnBackend.command',
  label: 'Say hello on the backend',
};

@injectable()
class BackendExampleCommandContribution implements CommandContribution {
  constructor(
    @inject(HelloBackendWithClientService)
    private readonly helloBackendWithClientService: HelloBackendWithClientService,
    @inject(HelloBackendService) private readonly helloBackendService: HelloBackendService
  ) {}

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SayHelloViaBackendCommandWithCallBack, {
      execute: () => {
        console.info('command via backend with callback');
        this.helloBackendWithClientService.greet().then((r) => {
          console.error(r);
        });
      },
    });
    commands.registerCommand(SayHelloViaBackendCommand, {
      execute: () => {
        console.info('command via backend');
        this.helloBackendService.sayHelloTo('World').then((r) => console.info(r));
      },
    });
  }
}

@injectable()
class BackendClientImpl implements BackendClient {
  getName(): Promise<string> {
    return new Promise((resolve) => resolve('Client'));
  }
}

export const bindCommandWithBackendMenu = (bind: interfaces.Bind) => {
  bind(CommandContribution).to(BackendExampleCommandContribution).inSingletonScope();
  bind(BackendClient).to(BackendClientImpl).inSingletonScope();

  bind(HelloBackendService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      console.error('connection', connection);
      return connection.createProxy<HelloBackendService>(HELLO_BACKEND_PATH);
    })
    .inSingletonScope();

  bind(HelloBackendWithClientService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      const backendClient: BackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<HelloBackendWithClientService>(HELLO_BACKEND_WITH_CLIENT_PATH, backendClient);
    })
    .inSingletonScope();
};

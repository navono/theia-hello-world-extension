import { injectable, inject } from 'inversify';
import { CommandRegistry, CommandContribution, MessageService } from '@theia/core';
import { WidgetOpenerOptions, WidgetOpenHandler } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { ViewerWidget, ViewerWidgetOptions } from './viewer-widget';
import { FileDialogService, OpenFileDialogProps } from '@theia/filesystem/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { OpenTraceCommand, StartServerCommand, StopServerCommand, TraceViewerCommand } from './viewer-commands';
// import { PortBusy, TraceServerConfigService } from '../../common/trace-server-config';
import { PreferenceService } from '@theia/core/lib/browser';
import { timeout } from '@theia/core/lib/common/promise-util';
// import { TRACE_PATH, TRACE_PORT } from '../trace-server-preference';
// import { TspClient } from 'tsp-typescript-client/lib/protocol/tsp-client';
// import { TspClientProvider } from '../tsp-client-provider-impl';
// import { TspClientResponse } from 'tsp-typescript-client/lib/protocol/tsp-client-response';
// import { HealthStatus } from 'tsp-typescript-client/lib/models/health';

interface ViewerWidgetOpenerOptions extends WidgetOpenerOptions {
  traceUUID: string;
}

@injectable()
export class ViewerContribution extends WidgetOpenHandler<ViewerWidget> implements CommandContribution {
  // private tspClient: TspClient;

  // private constructor(@inject(TspClientProvider) private tspClientProvider: TspClientProvider) {
  private constructor() {
    super();
    // this.tspClient = this.tspClientProvider.getTspClient();
    // this.tspClientProvider.addTspClientChangeListener((tspClient) => (this.tspClient = tspClient));
  }

  @inject(FileDialogService)
  protected readonly fileDialogService!: FileDialogService;

  @inject(WorkspaceService)
  protected readonly workspaceService!: WorkspaceService;

  @inject(PreferenceService) protected readonly preferenceService: PreferenceService;

  // @inject(TraceServerConfigService) protected readonly traceServerConfigService: TraceServerConfigService;

  @inject(MessageService) protected readonly messageService: MessageService;

  readonly id = ViewerWidget.ID;

  readonly label = 'Trace Viewer';

  // protected get path(): string | undefined {
  //   return this.preferenceService.get(TRACE_PATH);
  // }

  // protected get port(): number | undefined {
  //   return this.preferenceService.get(TRACE_PORT);
  // }

  protected createWidgetOptions(uri: URI, options?: ViewerWidgetOpenerOptions): ViewerWidgetOptions {
    return {
      traceURI: uri.path.toString(),
      traceUUID: options?.traceUUID,
    };
  }

  // protected async launchTraceServer(): Promise<void> {
  //   try {
  //     const healthResponse = await this.tspClient.checkHealth();
  //     if ((healthResponse as TspClientResponse<HealthStatus>).getModel()?.status === 'UP') {
  //       this.openDialog();
  //     }
  //   } catch (e) {
  //     this.messageService
  //       .showProgress({
  //         text: '',
  //       })
  //       .then(async (progress) => {
  //         progress.report({ message: 'Launching trace server... ', work: { done: 10, total: 100 } });
  //         try {
  //           const resolve = await this.traceServerConfigService.startTraceServer(this.path, this.port);
  //           if (resolve === 'success') {
  //             progress.report({
  //               message: `Trace server started on port: ${this.port}.`,
  //               work: { done: 100, total: 100 },
  //             });
  //             progress.cancel();
  //             this.openDialog();
  //           }
  //         } catch (err) {
  //           // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //           if (PortBusy.is(err as any)) {
  //             this.messageService.error(`Error opening serial port ${this.port}. (Port busy)`);
  //           } else {
  //             this.messageService.error(
  //               'Failed to start the trace server: no such file or directory. Please make sure that the path is correct in Trace Viewer settings and retry'
  //             );
  //           }
  //           progress.cancel();
  //         }
  //       });
  //   }
  // }

  public async openDialog(): Promise<void> {
    const props: OpenFileDialogProps = {
      title: 'Open Trace',
      // Only support selecting folders, both folders and file doesn't work in Electron (issue #227)
      canSelectFolders: true,
      canSelectFiles: false,
    };
    const root = this.workspaceService.tryGetRoots()[0];
    const fileURI = await this.fileDialogService.showOpenDialog(props, root);
    if (fileURI) {
      await this.open(fileURI);
    }
  }

  public async open(traceURI: URI, traceUUID?: ViewerWidgetOpenerOptions): Promise<ViewerWidget> {
    const widget = super.open(traceURI, traceUUID);
    console.error('Viewer Contribution open', traceURI, traceUUID);
    return widget;
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(OpenTraceCommand, {
      execute: async () => {
        console.error('OpenTraceCommand');

        // await this.launchTraceServer();
        await this.openDialog();
      },
    });

    registry.registerCommand(TraceViewerCommand, {
      execute: async (traceUUID) => {
        await this.open(new URI(''), traceUUID);
      },
    });

    registry.registerCommand(StartServerCommand, {
      execute: async () => {
        console.error('StartServerCommand');

        // try {
        //   await this.traceServerConfigService.startTraceServer(this.path, this.port);
        //   this.messageService.info(`Trace server started successfully on port: ${this.port}.`);
        // } catch (err) {
        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   if (PortBusy.is(err as any)) {
        //     this.messageService.error(`Error opening serial port ${this.port}. (Port busy)`);
        //   } else {
        //     this.messageService.error(
        //       'Failed to start the trace server: no such file or directory. Please make sure that the path is correct in Trace Viewer settings and retry'
        //     );
        //   }
        // }
      },
    });

    registry.registerCommand(StopServerCommand, {
      execute: async () => {
        console.error('StopServerCommand');

        // try {
        //   await this.traceServerConfigService.stopTraceServer();
        //   this.messageService.info(`Trace server terminated successfully on port: ${this.port}.`);
        // } catch (err) {
        //   this.messageService.error(`Failed to stop the trace server on port: ${this.port}.`);
        // }
      },
    });
  }

  canHandle(_uri: URI): number {
    console.error('canHandle', _uri);

    return 100;
  }
}

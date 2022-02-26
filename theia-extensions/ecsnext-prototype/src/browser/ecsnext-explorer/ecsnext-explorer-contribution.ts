import { injectable, inject } from '@theia/core/shared/inversify';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';
import { SelectionService } from '@theia/core';

import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

import { ECSNextPreferences, SERVER_IP, SERVER_ARGS, SERVER_PORT } from '../server/ecsnext-server-preference';
import { ECSNextExplorerWidget } from './ecsnext-explorer-widget';

@injectable()
export class ECSNextExplorerContribution
  extends AbstractViewContribution<ECSNextExplorerWidget>
  implements FrontendApplicationContribution
{
  @inject(ECSNextPreferences) protected serverPreferences: ECSNextPreferences;
  @inject(SelectionService) selectionService: SelectionService;

  // private readonly toDisposeOnClose = new DisposableCollection();

  // protected readonly onProjectsLoadedEmitter = new Emitter<void>();

  constructor() {
    super({
      widgetId: ECSNextExplorerWidget.ID,
      widgetName: ECSNextExplorerWidget.LABEL,
      defaultWidgetOptions: {
        area: 'left',
      },
      toggleCommandId: 'ecs-next:toggle',
    });

    // this.toDisposeOnClose.push(this.onProjectsLoadedEmitter);
  }

  onStart(_app: FrontendApplication): void {
    // this.toDisposeOnClose.push(this.workspace.onDidSaveTextDocument!((e) => this.updateEditor()));
    // this.toDisposeOnClose.push(this.editorManager.onCurrentEditorChanged((e) => this.updateEditor()));
    // this.toDisposeOnClose.push(
    //   this.selectionService.onSelectionChanged((selection) => this.updateSelectedNodes(selection))
    // );
    // this.fetchAndSetModel(uri);

    // return fetch('urdf/model?fileName=' + encodeURI(uri))
    // .then(res => res.json())
    // .then(res => res as RobotDescription)
    // .then(model => this.resolvePreviewWIdget()?.initModel(model));

    fetch(`${this.baseUrl}/api/projects`)
      .then((res) => res.json())
      .then((projects) => {
        console.log(projects);
        signalManager().fireProjectsLoadedSignel(projects);
      });
  }

  onStop(_app: FrontendApplication): void {
    // this.toDisposeOnClose.dispose();
  }

  async initializeLayout(_app: FrontendApplication): Promise<void> {
    await this.openView({ activate: true });
  }

  protected get baseUrl(): string | undefined {
    return `${this.serverPreferences[SERVER_IP]}:${this.serverPreferences[SERVER_PORT]}`;
  }

  protected get args(): string | undefined {
    return this.serverPreferences[SERVER_ARGS];
  }
}

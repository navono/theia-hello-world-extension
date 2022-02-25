import { ReactWidget } from '@theia/core/lib/browser';
import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { ThemeService } from '@theia/core/lib/browser/theming';

@injectable()
export class ECSNextViewerWidget extends ReactWidget {
  static ID = 'ecsnext-viewer';

  static LABEL = 'ECSNext Viewer';

  protected backgroundTheme: string;

  // protected explorerWidget: ECSNextExplorerWidget;

  @postConstruct()
  async init(): Promise<void> {
    this.id = 'ecsnext-viewer';
    this.title.label = 'ECSNext: ' + 'project name';
    this.addClass('ecsnext-viewer-open');
    this.backgroundTheme = ThemeService.get().getCurrentTheme().type;
    ThemeService.get().onDidColorThemeChange(() => this.updateBackgroundTheme());
  }

  protected updateBackgroundTheme(): void {
    const currentThemeType = ThemeService.get().getCurrentTheme().type;
    signalManager().fireThemeChangedSignal(currentThemeType);
  }
}

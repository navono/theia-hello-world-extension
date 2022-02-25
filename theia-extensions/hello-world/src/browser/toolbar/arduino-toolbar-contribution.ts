import { FrontendApplicationContribution, FrontendApplication, Widget } from '@theia/core/lib/browser';
import { injectable, inject } from '@theia/core/shared/inversify';
import { TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { CommandRegistry } from '@theia/core';
import { LabelParser } from '@theia/core/lib/browser/label-parser';
import { PreferenceService } from '@theia/core/lib/browser/preferences/preference-service';

import { ArduinoToolbar } from './arduino-toolbar';
/* eslint-disable */
import '../../../src/browser/toolbar/style/index.css';

export class ArduinoToolbarContainer extends Widget {
  protected toolbars: ArduinoToolbar[];

  constructor(...toolbars: ArduinoToolbar[]) {
    super();
    this.id = 'arduino-toolbar-container';
    this.toolbars = toolbars;
  }

  onAfterAttach() {
    for (const toolbar of this.toolbars) {
      Widget.attach(toolbar, this.node);
    }
  }
}

@injectable()
export class ArduinoToolbarContribution implements FrontendApplicationContribution {
  @inject(PreferenceService)
  protected readonly preferenceService: PreferenceService;

  protected arduinoToolbarContainer: ArduinoToolbarContainer;

  constructor(
    @inject(TabBarToolbarRegistry)
    protected tabBarToolBarRegistry: TabBarToolbarRegistry,
    @inject(CommandRegistry) protected commandRegistry: CommandRegistry,
    @inject(LabelParser) protected labelParser: LabelParser
  ) {
    const leftToolbarWidget = new ArduinoToolbar(tabBarToolBarRegistry, commandRegistry, labelParser, 'left');
    this.arduinoToolbarContainer = new ArduinoToolbarContainer(leftToolbarWidget);

    // const rightToolbarWidget = new ArduinoToolbar(tabBarToolBarRegistry, commandRegistry, labelParser, 'right');
    // this.arduinoToolbarContainer = new ArduinoToolbarContainer(leftToolbarWidget, rightToolbarWidget);
  }

  onDidInitializeLayout(app: FrontendApplication) {
    this.preferenceService.ready.then(() => {
      app.shell.topPanel.addWidget(this.arduinoToolbarContainer);
    });
  }

  // onStart(app: FrontendApplication) {
  //   app.shell.topPanel.addWidget(this.arduinoToolbarContainer);
  //   // app.shell.addWidget(this.arduinoToolbarContainer, {
  //   //   area: 'top',
  //   // });
  // }
}

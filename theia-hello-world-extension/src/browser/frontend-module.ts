import { ContainerModule } from '@theia/core/shared/inversify';

import { bindDynamicLabelProvider } from './label/sample-dynamic-label-provider-command-contribution';
import { bindSampleMenu } from './menu/sample-menu-contribution';
import { bindSampleUnclosableView } from './view/sample-unclosable-view-contribution';
import { bindTreeWidget } from './tree-widget/frontend-module';
import { bindMarkdownResource } from './markdown/markdonw-contribution';
import { bindCommandWithBackendMenu } from './with-backend/command-menu-contribution';
import { bindEditorWidget } from './editor-for-custom-suffix-file/editor-example-frontend-module';
import { bindTerminal } from './terminal/terminal-contribution';
import { bindJsonSchema } from './jsonschema-form/jsonschema-form-contribution';
import { bindTreeEditor } from './tree-editor/tree-example-frontend-module';
// import { bindHideTopMenu } from './top-menu/custom-application-shell';
import { bindSampleOutputChannelWithSeverity } from './output/sample-output-channel-with-severity';
import { bindExplorerAndView } from './explorer-view/frontend-module';
import { bindTestServerWidget } from './test-server-widget/serverevent-frontend-module';

import { OutlineViewContribution } from '@theia/outline-view/lib/browser/outline-view-contribution';

// import { MenuContribution } from '@theia/core/lib/common';

// import { WorkspacePreferenceContribution } from '@theia/workspace/lib/browser';
// import { PreferenceSchema } from '@theia/core/lib/browser/preferences';

/* eslint-disable */
import '../../src/browser/style/branding.css';

// creating your own localization contribution for German, Italian and simplified Chinese

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  console.log('ContainerModule');
  
  bindDynamicLabelProvider(bind);
  bindSampleUnclosableView(bind);
  bindSampleMenu(bind);
  bindTreeWidget(bind);
  bindMarkdownResource(bind);
  bindCommandWithBackendMenu(bind);
  bindEditorWidget(bind);
  bindTerminal(bind);
  bindJsonSchema(bind);
  bindTreeEditor(bind);
  // bindHideTopMenu(bind, rebind);
  bindSampleOutputChannelWithSeverity(bind);

  // 注销右侧 outline 功能
  rebind(OutlineViewContribution).toConstantValue({
    registerCommands: () => { },
    registerMenus: () => { },
    registerKeybindings: () => { },
    registerToolbarItems: () => { }
  } as any);

  bindExplorerAndView(bind);

  bindTestServerWidget(bind);

  // rebind(MenuContribution).toConstantValue({
  //   registerCommands: () => { },
  //   registerMenus: () => { },
  //   registerKeybindings: () => { },
  //   registerToolbarItems: () => { }
  // } as any);

  // rebind(WorkspacePreferenceContribution).toConstantValue({
  //   schema: <PreferenceSchema>{
  //       type: 'object',
  //       properties: {}
  //   }
  // });

});

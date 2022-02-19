import { ContainerModule } from '@theia/core/shared/inversify';
import { MenuContribution } from '@theia/core/lib/common';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { OutlineViewContribution } from '@theia/outline-view/lib/browser/outline-view-contribution';
// import {
//   WorkspaceFrontendContribution as TheiaWorkspaceFrontendContribution,
//   FileMenuContribution as TheiaFileMenuContribution,
//   // WorkspaceCommandContribution as TheiaWorkspaceCommandContribution,
// } from '@theia/workspace/lib/browser';

import { HelloWorldFrontendContribution } from './frontend-contribution';
import { bindDynamicLabelProvider } from './label/sample-dynamic-label-provider-command-contribution';
import { bindSampleMenu } from './menu/sample-menu-contribution';
import { bindSampleUnclosableView } from './view/sample-unclosable-view-contribution';
import { bindTreeWidget } from './tree-widget/frontend-module';
import { bindMarkdownResource } from './markdown/markdonw-contribution';
import { bindCommandWithBackendMenu } from './with-backend/command-menu-contribution';
import { bindEditorWidget } from './editor-for-custom-suffix-file/editor-example-frontend-module';
// import { bindTerminal } from './terminal/terminal-contribution';
import { bindJsonSchema } from './jsonschema-form/jsonschema-form-contribution';
import { bindTreeEditor } from './tree-editor/tree-example-frontend-module';
// import { bindHideTopMenu } from './top-menu/custom-application-shell';
import { bindSampleOutputChannelWithSeverity } from './output/sample-output-channel-with-severity';
import { bindExplorerAndView } from './explorer-view/frontend-module';
import { bindToolBarContainer } from './toolbar/toolbar-frontend-module';
import { bindTestToolBar } from './toolbar/test-toolbar';
import { bind3dViewerContainer } from './3d-viewer/theia-3d-view-frontend-module';

// import {
//   WorkspaceFrontendContribution,
//   ArduinoFileMenuContribution,
// } from './theia/workspace/workspace-frontend-contribution';

// import { WorkspacePreferenceContribution } from '@theia/workspace/lib/browser';
// import { PreferenceSchema } from '@theia/core/lib/browser/preferences';

/* eslint-disable */
import '../../src/browser/style/branding.css';

// creating your own localization contribution for German, Italian and simplified Chinese

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  console.log('ContainerModule');

  bind(HelloWorldFrontendContribution).toSelf().inSingletonScope();
  
  // bind(CommandContribution).toService(HelloWorldFrontendContribution);
  bind(MenuContribution).toService(HelloWorldFrontendContribution);
  bind(TabBarToolbarContribution).toService(HelloWorldFrontendContribution);
  bind(FrontendApplicationContribution).toService(HelloWorldFrontendContribution);
  // bind(ColorContribution).toService(HelloWorldFrontendContribution);

  bindDynamicLabelProvider(bind);
  bindSampleUnclosableView(bind);
  bindSampleMenu(bind);
  bindTreeWidget(bind);
  bindMarkdownResource(bind);
  bindCommandWithBackendMenu(bind);
  bindEditorWidget(bind);
  // bindTerminal(bind);
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

  bindToolBarContainer(bind);
  bindTestToolBar(bind);

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

  // rebind(TheiaWorkspaceFrontendContribution)
  // .to(WorkspaceFrontendContribution)
  // .inSingletonScope();
  // rebind(TheiaFileMenuContribution)
  //   .to(ArduinoFileMenuContribution)
  //   .inSingletonScope();

  bind3dViewerContainer(bind);
});

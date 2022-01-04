import { ContainerModule } from '@theia/core/shared/inversify';
import { bindDynamicLabelProvider } from './label/sample-dynamic-label-provider-command-contribution';
import { bindSampleMenu } from './menu/sample-menu-contribution';
import { bindSampleUnclosableView } from './view/sample-unclosable-view-contribution';
import { bindTreeWidget } from './tree-widget/test-widget-contribution';
import { bindMarkdownResource } from './markdown/markdonw-contribution';
import { bindCommandWithBackendMenu } from './with-backend/command-menu-contribution';
import { bindEditorWidget } from './editor-for-custom-suffix-file/editor-example-frontend-module';
import { bindTerminal } from './terminal/terminal-contribution';
import { bindJsonSchema } from './jsonschema-form/jsonschema-form-contribution';
import { bindTreeEditor } from './tree-editor/tree-example-frontend-module';

import { OutlineViewContribution } from '@theia/outline-view/lib/browser/outline-view-contribution';

/* eslint-disable */
import '../../src/browser/style/branding.css';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
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

  // 注销右侧 outline 功能
  rebind(OutlineViewContribution).toConstantValue({
    registerCommands: () => { },
    registerMenus: () => { },
    registerKeybindings: () => { },
    registerToolbarItems: () => { }
} as any);
});

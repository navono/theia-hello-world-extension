import { ContainerModule } from '@theia/core/shared/inversify';
import { bindDynamicLabelProvider } from './label/sample-dynamic-label-provider-command-contribution';
import { bindSampleMenu } from './menu/sample-menu-contribution';
import { bindSampleUnclosableView } from './view/sample-unclosable-view-contribution';

import '../../src/browser/style/branding.css';

export default new ContainerModule(bind => {
  bindDynamicLabelProvider(bind);
  bindSampleUnclosableView(bind);
  bindSampleMenu(bind);
});
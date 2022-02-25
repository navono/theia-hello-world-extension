import '../../../../src/browser/style/browser-menu.css';
import { interfaces } from '@theia/core/shared/inversify';
// import { ContainerModule } from '@theia/core/shared/inversify';
import {
  BrowserMenuBarContribution,
  BrowserMainMenuFactory as TheiaBrowserMainMenuFactory,
} from '@theia/core/lib/browser/menu/browser-menu-plugin';

import { MainMenuManager } from '../../../common/main-menu-manager';
import { ArduinoMenuContribution } from './browser-menu-plugin';
import { BrowserMainMenuFactory } from './browser-main-menu-factory';

// export default new ContainerModule((bind, unbind, isBound, rebind) => {
//   console.log('theia core ContainerModule');

//   bind(BrowserMainMenuFactory).toSelf().inSingletonScope();
//   bind(MainMenuManager).toService(BrowserMainMenuFactory);
//   rebind(TheiaBrowserMainMenuFactory).toService(BrowserMainMenuFactory);
//   rebind(BrowserMenuBarContribution).to(ArduinoMenuContribution).inSingletonScope();
// });

export const bindMenuManager = (bind: interfaces.Bind, rebind: interfaces.Bind) => {
  console.log('theia core bindMenuManager');

  bind(BrowserMainMenuFactory).toSelf().inSingletonScope();
  bind(MainMenuManager).toService(BrowserMainMenuFactory);
  rebind(TheiaBrowserMainMenuFactory).toService(BrowserMainMenuFactory);
  rebind(BrowserMenuBarContribution).to(ArduinoMenuContribution).inSingletonScope();
};

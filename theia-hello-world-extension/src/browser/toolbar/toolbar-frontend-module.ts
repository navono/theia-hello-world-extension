import { interfaces } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { ArduinoToolbarContribution } from './arduino-toolbar-contribution';

export const bindSampleToolBar = (bind: interfaces.Bind) => {
  bind(ArduinoToolbarContribution).toSelf().inSingletonScope();
  bind(FrontendApplicationContribution).toService(ArduinoToolbarContribution);
};

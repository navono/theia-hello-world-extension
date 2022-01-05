import { OpenHandler, WidgetFactory, LabelProviderContribution } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';
import { MyOpenHandler } from './my-openhandler';
import { MyWidgetFactory } from './my-widget-factory';
import { CustomLabelProviderContribution, CustomTreeLabelProviderContribution } from './label-provider-example';

/* eslint-disable */
import '../../../src/browser/editor-for-custom-suffix-file/style/example.css';

export const bindEditorWidget = (bind: interfaces.Bind) => {
  // bind open handler
  bind(OpenHandler).to(MyOpenHandler);
  //bind widget factory
  bind(WidgetFactory).to(MyWidgetFactory);

  // label binding   
  bind(CustomLabelProviderContribution).toSelf().inSingletonScope();
  bind(CustomTreeLabelProviderContribution).toSelf().inSingletonScope();
  bind(LabelProviderContribution).toService(CustomLabelProviderContribution);
  bind(LabelProviderContribution).toService(CustomTreeLabelProviderContribution);
};

import { OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import { interfaces } from '@theia/core/shared/inversify';
import { MyOpenHandler } from './my-openhandler';
import { MyWidgetFactory } from './my-widget-factory';

/* eslint-disable */
import './style/example.css';

export const bindEditorWidget = (bind: interfaces.Bind) => {
  // bind open handler
  bind(OpenHandler).to(MyOpenHandler);
  //bind widget factory
  bind(WidgetFactory).to(MyWidgetFactory);
};

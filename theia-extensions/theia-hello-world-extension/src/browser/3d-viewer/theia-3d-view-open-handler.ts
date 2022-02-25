import { injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { WidgetOpenHandler, WidgetOpenerOptions } from '@theia/core/lib/browser';
import { Theia3dViewWidget } from './theia-3d-view-widget';

@injectable()
export class Theia3dViewOpenHandler extends WidgetOpenHandler<Theia3dViewWidget> {
  readonly id = Theia3dViewWidget.ID;

  readonly label = '3D Viewer';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canHandle(uri: URI, _options: WidgetOpenerOptions) {
    return uri.path.ext.endsWith('.obj') ? 1000 : -1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createWidgetOptions(uri: URI, options: WidgetOpenerOptions) {
    return {
      uri: uri.toString(),
    };
  }
}

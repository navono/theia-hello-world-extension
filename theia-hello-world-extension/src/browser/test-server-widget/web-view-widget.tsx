import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import * as React from '@theia/core/shared/react';
import { injectable } from '@theia/core/shared/inversify';

/**
 * Base Web view widget that opens and shows the specified url
 */
@injectable()
export class WebViewWidget extends ReactWidget {
  // Url of the webpage to be opened
  url = '';

  public initialize(title: string, url: string, closable: boolean) {
    this.id = 'web-view-' + title;
    this.url = url;
    this.title.label = title;
    this.title.caption = title;
    this.title.closable = closable;

    this.update();
  }

  /**
   * Content to render in the UI
   */
  public render(): React.ReactNode {
    return (
      <React.Fragment>
        <div className="web-view-content">
          <div className="web-view-content-inner">
            <iframe src={this.url}></iframe>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

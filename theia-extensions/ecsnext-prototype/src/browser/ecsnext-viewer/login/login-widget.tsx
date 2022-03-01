import * as React from '@theia/core/shared/react';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser';

@injectable()
export class LoginWidget extends ReactWidget {
  static ID = 'ecsnext-project-login-widget';

  static LABEL = 'Project Login';

  @postConstruct()
  async init(): Promise<void> {
    this.id = LoginWidget.ID;
    this.title.label = LoginWidget.LABEL;
    // this._experimentManager = this.tspClientProvider.getExperimentManager();
    // this.tspClientProvider.addTspClientChangeListener(() => {
    //   this._experimentManager = this.tspClientProvider.getExperimentManager();
    // });
    this.update();
  }

  render(): React.ReactNode {
    return <div>This is project login page</div>;
  }
}

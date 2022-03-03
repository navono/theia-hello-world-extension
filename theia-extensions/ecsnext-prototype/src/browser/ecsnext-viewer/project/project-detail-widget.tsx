import * as React from '@theia/core/shared/react';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser';

@injectable()
export class ProjectDetailWidget extends ReactWidget {
  static ID = 'ecsnext-project-detial-widget';

  // static LABEL = 'Project Detail';

  @postConstruct()
  async init(): Promise<void> {
    this.id = ProjectDetailWidget.ID;
    // this.title.label = ProjectDetailWidget.LABEL;
    this.update();
  }

  render(): React.ReactNode {
    return <div>This is project detail page</div>;
  }
}

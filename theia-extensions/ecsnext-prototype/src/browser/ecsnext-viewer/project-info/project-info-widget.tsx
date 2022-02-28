import * as React from '@theia/core/shared/react';
import { ReactWidget } from '@theia/core/lib/browser';
import { injectable, inject } from '@theia/core/shared/inversify';

export const ProjectInfoWidgetOptions = Symbol('ProjectInfoWidgetOptions');
export interface ProjectInfoWidgetOptions {
  projectId?: string;
}

@injectable()
export class ProjectInfoWidget extends ReactWidget {
  static ID = 'project-login-widget';
  static LABEL = 'Project Login';

  private constructor() {
    super();
  }

  @inject(ProjectInfoWidgetOptions) protected readonly options: ProjectInfoWidgetOptions;

  render(): React.ReactNode {
    return (
      <div>
        <p>project info</p>
      </div>
    );
  }
}

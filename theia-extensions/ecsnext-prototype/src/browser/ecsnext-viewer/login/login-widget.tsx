import * as React from '@theia/core/shared/react';
import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Button from '@mui/material/Button';
import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

import schema from './schema.json';
import uiSchema from './uischema.json';

@injectable()
export class LoginWidget extends ReactWidget {
  static ID = 'ecsnext-project-login-widget';

  static LABEL = 'Project Login';

  private _data: any = {};
  private _projectId: string;

  @postConstruct()
  async init(): Promise<void> {
    this.id = LoginWidget.ID;
    this.title.label = LoginWidget.LABEL;
    this.update();
  }

  public set projectId(id: string) {
    this._projectId = id;
  }

  private updateData = (data: any) => {
    this._data = data;
  };

  private onSubmit = () => {
    fetch(`http://localhost:4000/api/projects/${this._projectId}/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user: { username: this._data.username, password: this._data.password } }),
    })
      .then((res) => res.json())
      .then((rsp) => {
        localStorage.setItem(`${this._projectId}-jwt`, rsp.user.token);
        signalManager().fireProjectLoginSignal(this._projectId, rsp.user);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render(): React.ReactNode {
    return (
      <div className="fr-wrapper" style={{ padding: '0px 12px' }}>
        <JsonForms
          schema={schema}
          uischema={uiSchema}
          data={this._data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ errors, data: newData }) => this.updateData(newData)}
        ></JsonForms>
        <Button color="primary" onClick={this.onSubmit}>
          登录
        </Button>
      </div>
    );
  }
}

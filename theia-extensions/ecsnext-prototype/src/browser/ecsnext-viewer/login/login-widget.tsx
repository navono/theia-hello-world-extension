import * as React from '@theia/core/shared/react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Button from '@mui/material/Button';
import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

import schema from './schema.json';
import uiSchema from './uischema.json';

export interface LoginProps {
  project: any;
}

export const Login = (props: LoginProps) => {
  const [data, setData] = React.useState({} as any);

  const onSubmit = () => {
    fetch(`http://localhost:4000/api/projects/${props.project._id}/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user: { username: data.username, password: data.password } }),
    })
      .then((res) => res.json())
      .then((rsp) => {
        localStorage.setItem(`${props.project._id}-jwt`, rsp.user.token);
        signalManager().fireProjectLoginSignal(props.project, rsp.user);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="fr-wrapper" style={{ padding: '0px 12px' }}>
      <JsonForms
        schema={schema}
        uischema={uiSchema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ errors, data: newData }) => setData(newData)}
      ></JsonForms>
      <Button color="primary" onClick={onSubmit}>
        登录
      </Button>
    </div>
  );
};

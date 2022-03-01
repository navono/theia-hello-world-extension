import * as React from '@theia/core/shared/react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import Button from '@mui/material/Button';
import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

// import 'antd/dist/antd.css';
// import '../../../../src/browser/ecsnext-viewer/login/index.css';
import schema from './schema.json';
import uiSchema from './uischema.json';

export interface LoginFormProps {
  projectId: string;
}

export const LoginForm = (props: LoginFormProps) => {
  const [data, setData] = React.useState<any>({});

  const onSubmit = () => {
    const { projectId } = props;

    fetch(`http://localhost:4000/api/projects/${projectId}/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user: { username: data.username, password: data.password } }),
    })
      .then((res) => res.json())
      .then((rsp) => {
        localStorage.setItem(`${projectId}-jwt`, rsp.user.token);
        signalManager().fireProjectLoginSignal(projectId, rsp.user);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // const onFormDataChange = (e: IChangeEvent<any>) => {
  //   this.setState({ formData: e.formData });
  // };

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

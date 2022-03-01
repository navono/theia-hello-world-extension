import * as React from '@theia/core/shared/react';
import { Button } from 'antd';
import { withTheme, ISubmitEvent, IChangeEvent } from '@rjsf/core';
import { Theme as AntDTheme } from '@rjsf/antd';

import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';
import SCHEMA from './schema';

import 'antd/dist/antd.css';
import '../../../../src/browser/ecsnext-viewer/login/index.css';

const Form = withTheme(AntDTheme);

export interface LoginFormProps {
  projectId: string;
}
export class LoginForm extends React.Component<LoginFormProps, any> {
  constructor(props: LoginFormProps) {
    super(props);

    // initialize state with Simple data sample
    const { schema, uiSchema, formData } = SCHEMA;

    this.state = {
      schema,
      uiSchema,
      formData,
    };
  }

  onSubmit = (e: ISubmitEvent<any>) => {
    const { projectId } = this.props;
    const { formData } = e;

    fetch(`http://localhost:4000/api/projects/${projectId}/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user: { username: formData.username, password: formData.password } }),
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

  onFormDataChange = (e: IChangeEvent<any>) => {
    this.setState({ formData: e.formData });
  };

  render() {
    const { formData } = this.state;

    return (
      <div className="fr-wrapper" style={{ padding: '0px 12px' }}>
        <Form
          schema={SCHEMA.schema}
          uiSchema={SCHEMA.uiSchema}
          formData={formData}
          onChange={this.onFormDataChange}
          onSubmit={this.onSubmit}
        >
          <React.Fragment />
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form>
      </div>
    );
  }
}

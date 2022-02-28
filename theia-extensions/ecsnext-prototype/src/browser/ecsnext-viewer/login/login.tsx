import * as React from '@theia/core/shared/react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { signalManager } from 'ecsnext-base/lib/signals/signal-manager';

import 'antd/dist/antd.css';
import '../../../../src/browser/ecsnext-viewer/login/index.css';

export interface NormalLoginFormProps {
  projectId: string;
}

export const Login = (props: NormalLoginFormProps) => {
  const onFinish = (values: any) => {
    fetch(`http://localhost:4000/api/projects/${props.projectId}/login`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user: { username: values.username, password: values.password } }),
    })
      .then((res) => res.json())
      .then((rsp) => {
        localStorage.setItem(`${props.projectId}-jwt`, rsp.user.token);
        signalManager().fireProjectLoginSignal(props.projectId, rsp.user);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="">register now!</a>
      </Form.Item>
    </Form>
  );
};

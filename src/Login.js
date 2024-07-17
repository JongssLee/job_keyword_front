import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';


const Login = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/token', new URLSearchParams({
        username: values.username,
        password: values.password
      }));
      setToken(response.data.access_token);
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      message.error('Error logging in');
    }
  };

  return (
    <Layout>
      <Card title="Login" style={{ maxWidth: '400px', margin: 'auto' }}>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default Login;

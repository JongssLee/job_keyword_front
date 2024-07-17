import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';


const Signup = () => {
  const handleSignup = async (values) => {
    try {
      await axios.post('http://localhost:8000/users/', values);
      message.success('User created successfully');
    } catch (error) {
      message.error('Error creating user');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <Form layout="vertical" onFinish={handleSignup}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="full_name" label="Full Name">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Sign Up</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;

// Login.tsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { login } from '../services/authService'; // Replace with your actual API function
import { useNavigate   } from 'react-router-dom'; // Assuming you use React Router for navigation

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate ();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      setLoading(false);
      // Handle successful login
      console.log('Login successful!', response);
      // Redirect to Events page
      navigate('/events');
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
      <Form onFinish={onFinish}>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input placeholder="email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

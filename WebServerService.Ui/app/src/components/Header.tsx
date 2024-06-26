// Header.tsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">
          <Link to="/events">Events</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/user">User</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/roles">Roles</Link>
        </Menu.Item>
        <Menu.Item key="4">Notification</Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;

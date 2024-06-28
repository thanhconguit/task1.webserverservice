// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import { startSignalRConnection, stopSignalRConnection } from '../../services/signalRService';
import NotificationDropdown from './NotificationDropdown';
import { Notification } from '../../types';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [highlightedNotification, setHighlightedNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleReceiveNotification = (notification: Notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      setNotificationCount((prevCount) => prevCount + 1);
      setHighlightedNotification(notification.id); // Highlight the newly added notification
    };

    startSignalRConnection(handleReceiveNotification);

    return () => {
      stopSignalRConnection();
    };
  }, []);

  const clearNotificationCount = () => {
    setNotificationCount(0);
  };

  return (
    <Header>
      <div className="logo" />
      <div className={styles.appHeader}>
        <div className={styles.wFull}>
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
          </Menu>
        </div>
        <div className={styles.notificationIcon}>
          <NotificationDropdown
            notifications={notifications}
            notificationCount={notificationCount}
            clearNotificationCount={clearNotificationCount}
            highlightedNotification={highlightedNotification}
          />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;

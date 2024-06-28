// src/components/NotificationDropdown.tsx
import React, { useEffect, useState } from 'react';
import { Badge, Dropdown, Menu } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Notification } from '../../types';
import styles from './Header.module.scss';

interface NotificationDropdownProps {
  notifications: Notification[];
  notificationCount: number;
  clearNotificationCount: () => void;
  highlightedNotification: string | null;
}
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, notificationCount, clearNotificationCount, highlightedNotification}) => {

  const clearHighlightedNotification = (visible: boolean) => {
    if (visible) {
      clearNotificationCount();
    }
  };
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the format as needed
  };
  const menu = (
    <Menu className={styles.notificationMenu}>
      {notifications.length === 0 ? (
        <Menu.Item key="0">No new notifications</Menu.Item>
      ) : (
        notifications.map((notification) => (
          <Menu.Item
            key={notification.id}
            className={highlightedNotification === notification.id ? styles.highlight : ''}
          >
            <div>
              <div>New event received: {notification.data}</div>
              <div style={{ fontSize: '0.8em', color: 'gray' }}>{formatDate(notification.timestamp)}</div>
            </div>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} onOpenChange={clearHighlightedNotification}>
      <Badge size="small" count={notificationCount}>
        <BellOutlined />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
// src/services/signalRService.ts
import * as signalR from '@microsoft/signalr';
import { Notification } from '../types';

let connection: signalR.HubConnection;

export const startSignalRConnection = (handleReceiveNotification: (notification: Notification) => void) => {
    connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44339/notificationHub')
      .configureLogging(signalR.LogLevel.Information)
      .build();
  
    connection.start()
      .then(() => {
        console.log('Connected to SignalR hub');
        connection.on('ReceiveNotification', (notification: Notification) => {
          handleReceiveNotification(notification);
        });
      })
      .catch(error => {
        console.error('Error connecting to SignalR hub', error);
      });
  };

export const stopSignalRConnection = () => {
  if (connection) {
    connection.stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(error => console.error('Error stopping SignalR connection', error));
  }
};

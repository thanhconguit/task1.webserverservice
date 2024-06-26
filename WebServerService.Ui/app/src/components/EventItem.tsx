import React from 'react';
import { List, Button } from 'antd';

interface Event {
  id: string;
  data: string;
  timestamp: string;
  isProcessed: boolean;
}

interface EventItemProps {
  event: Event;
  onProcess: (eventId: string) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onProcess }) => {
  return (
    <List.Item
      actions={[
        <Button
          type="primary"
          disabled={event.isProcessed}
          onClick={() => onProcess(event.id)}
        >
          Mark as Processed
        </Button>,
      ]}
    >
      <List.Item.Meta
        title={`Event ID: ${event.id}`}
        description={`Data: ${event.data}, Timestamp: ${event.timestamp}`}
      />
    </List.Item>
  );
};

export default EventItem;

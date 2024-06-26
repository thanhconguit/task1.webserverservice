// pages/Events.tsx
import React, { useState, useEffect } from 'react';
import CommonTable from '../components/CommonTable';
import { getEvents, markEventProcessed } from '../services/eventService';
import { QueryParams, Event } from '../types'; 
import { Button, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

const Events: React.FC = () => {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchEvents = async (query: QueryParams) => {
    const data = await getEvents(query.PageIndex, query.PageSize, query.SortedField, query.SortedType, query.Filters);
    return { data: data.events, total: data.totalRecords }; 
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const initialData = await fetchEvents({ PageIndex: 1, PageSize: 10 });
        setData(initialData.data);
      } catch (error) {
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);
  const handleProcess = async (eventId: string) => {
    try {
      await markEventProcessed(eventId);
      message.success('Event marked as processed');
      // Optionally, trigger a data refresh here
      const updatedData = data.map((event) =>
        event.id === eventId ? { ...event, isProcessed: true } : event
      );
      setData(updatedData);
    } catch (error) {
      message.error('Failed to mark event as processed');
    }
  };

  const columns: ColumnsType<Event> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Processed',
      dataIndex: 'isProcessed',
      key: 'isProcessed',
      render: (isProcessed, record) => (
        <Button
          type="primary"
          disabled={record.isProcessed}
          onClick={() => handleProcess(record.id)}
        >
          {record.isProcessed ? 'Processed' : 'Mark as Processed'}
        </Button>
      ),
    },
  ];


  return <CommonTable fetchData={fetchEvents} columns={columns} />;
};

export default Events;

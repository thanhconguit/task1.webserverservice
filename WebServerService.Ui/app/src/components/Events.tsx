// pages/Events.tsx
import React, {useRef, useState, useEffect } from 'react';
import CommonTable from '../components/CommonTable';
import { getEvents, markEventProcessed } from '../services/eventService';
import { QueryParams, Event, FilterCriterion } from '../types'; 
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { message, Input, Space, Button, Table } from 'antd';
import { isNullOrEmptyOrWhitespace } from '../utilities';

const Events: React.FC = () => {
  const [data, setData] = useState<Event[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<FilterCriterion[]>([]);
  const [sortedField, setSortedField] = useState<string>('');
  const [sortedType, setSortedType] = useState<number>(0);
  const fetchEvents = async (query: QueryParams) => {
    const data = await getEvents(query.PageIndex, query.PageSize, query.SortedField, query.SortedType, query.Filters);
    return { data: data.events, total: data.totalRecords }; 
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string,
  ) => {
    console.log(selectedKeys,dataIndex);
    if(!isNullOrEmptyOrWhitespace(selectedKeys[0]))
      {
        const newFilters: FilterCriterion[] = [
          { Column: dataIndex, Value: selectedKeys[0] },
        ];
        setFilters(newFilters);
    }
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<Event> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
        record
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (sorter.field && sorter.order) {
      setSortedField(sorter.field);
      setSortedType(sorter.order === 'descend' ?  1 : 0);
      fetchEvents({
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        SortedField: sorter.field,
        SortedType: sorter.order,
        Filters: filters
      }).then(({ data, total }) => {
        setData(data);
        setTotal(total);
      });
    }
  }
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const { data, total } = await fetchEvents({
          PageIndex: pagination.current,
          PageSize: pagination.pageSize,
          SortedField: sortedField,
          SortedType: sortedType,
          Filters: filters,
        });
       
        setData(data);
        setTotal(total);
      } catch (error) {
        message.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [pagination, filters, sortedField]);

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
      ...getColumnSearchProps('id')
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      ...getColumnSearchProps('data'),

    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      ...getColumnSearchProps('timestamp'),
    },
    {
      title: 'Processed',
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

  return <><Table columns={columns} 
  dataSource={data}
  rowKey="id"
  loading={loading}
  pagination={{ total, current: pagination.current, pageSize: pagination.pageSize }} 
  onChange={handleTableChange}/></>;
};

export default Events;

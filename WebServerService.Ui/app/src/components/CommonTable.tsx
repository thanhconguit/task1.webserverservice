import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, message } from 'antd';
import type { InputRef, TableColumnType, TableColumnsType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { FilterCriterion, QueryParams } from '../types'; 
import { isNullOrEmptyOrWhitespace } from '../utilities';

interface CommonTableProps<T> {
  fetchData: (query: QueryParams) => Promise<{ data: T[], total: number }>;
  columns: TableColumnsType<T>;
}

const CommonTable = <T extends object>({ fetchData, columns }: CommonTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>(''); // Initialize with empty string
  const searchInput = useRef<InputRef>(null);
  const [filters, setFilters] = useState<FilterCriterion[]>([]);
  const [sortedField, setSortedField] = useState<string>('');
  const [sortedType, setSortedType] = useState<number>(0);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const { data, total } = await fetchData({
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
  }, [pagination]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });

    if (sorter.field && sorter.order) {
      fetchData({
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        SortedField: sorter.field,
        SortedType: sorter.order,
      }).then(({ data, total }) => {
        setData(data);
        setTotal(total);
      });
    }
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

  const getColumnSearchProps = (column: TableColumnType<T>): TableColumnType<T> => ({
    ...column,
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput as React.Ref<InputRef>}
          placeholder={`Search ${column.title}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, column.dataIndex as string)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, column.dataIndex as string)}
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
              setSearchedColumn(column.dataIndex as string);
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
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      (record[column.dataIndex as keyof T] as string)
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => (searchInput.current as InputRef)?.focus?.(), 100);
    }
    },
    render: (text) =>
      searchedColumn === column.dataIndex ? (
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

  const enhancedColumns = columns.map((col) => {
    if ('dataIndex' in col) {
      // col is of type TableColumnType<T>
      return {
        ...col,
        ...getColumnSearchProps(col as TableColumnType<T>),
      };
    } else {
      // col is of type ColumnGroupType<T>
      // Handle column groups if necessary
      return col;
    }
  });
  console.log(enhancedColumns);
  console.log(data);

  return (
    <Table
      columns={enhancedColumns as TableColumnsType<T>}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{ total, current: pagination.current, pageSize: pagination.pageSize }}
      onChange={handleTableChange}
    />
  );
};

export default CommonTable;

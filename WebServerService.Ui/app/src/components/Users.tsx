// pages/Events.tsx
import React, { useRef, useState, useEffect } from 'react';
import { addUser, deleteUser, editUser, getUsers } from '../services/userService';
import { CreatOrUpdateUser, FilterCriterion, QueryParams, Role, User } from '../types'; 
import { Button, Flex, Form, Input, InputRef, Modal, Select, Space, TableColumnType, message } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { capitalizeFirstLetter, isNullOrEmptyOrWhitespace } from '../utilities';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { getAllRoles } from '../services/roleSerivce';

const Users: React.FC = () => { 
  const [data, setData] = useState<User[]>([]);
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<CreatOrUpdateUser | undefined>(); // State to manage selected user for edit/delete
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchUsers = async (query: QueryParams) => {
    const data = await getUsers(query.PageIndex, query.PageSize, query.SortedField, query.SortedType, query.Filters);
    return { data: data.users, total: data.totalRecords }; 
  };
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const rolesData = await getAllRoles(); // Implement getAllRoles function in roleService
      setRoles(rolesData.roles);
    } catch (error) {
      console.error('Failed to fetch roles', error);
      // Handle error as per your application's requirement
    }
  };

  // Function to handle edit action
  const handleEdit = (user: User) => {
    const updatedUser: CreatOrUpdateUser = {
      id: user.id,
      userName: user.userName,
      surName: user.surName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      assignedRole: user.assignedRole,
    };
    setSelectedUser(updatedUser);
    form.setFieldsValue(updatedUser); // Set the form fields to the selected user's data
    setEditModalVisible(true);
  };

  const handleFetchUsers = ()=>{
    fetchUsers({  // Refresh user list after delete
      PageIndex: pagination.current,
      PageSize: pagination.pageSize,
      SortedField: sortedField,
      SortedType: sortedType,
      Filters: filters,
    }).then(({ data, total }) => {
      setData(data);
      setTotal(total);
    }); 
  }

  // Function to submit edited user data to API
  const handleEditSubmit = async (values: CreatOrUpdateUser) => {
    try {
      const updatedUser: CreatOrUpdateUser = {
        ...values,
        id: selectedUser?.id, // Set the id from selectedUser
      };      
      await editUser(updatedUser); 
      message.success('User updated successfully');
      setEditModalVisible(false);
      handleFetchUsers(); // Refresh user list after edit
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  // Function to delete user via API
  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser?.id || ''); 
      message.success('User deleted successfully');
      setDeleteModalVisible(false);
      handleFetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      message.error('Failed to delete user');
    }
  };
  // Function to handle delete action
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };
  const handleRoleChange = (value: string, option: any) => {
    form.setFieldsValue({
      assignedRole: {
        roleName: option.children,
        roleId: value,
      },
    });

    setRoleId(value);
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: string,
  ) => {
    console.log(dataIndex, selectedKeys);
    if(!isNullOrEmptyOrWhitespace(selectedKeys[0]))
      {
        const listFilter: FilterCriterion[] = [...filters.filter(f => f.Column === capitalizeFirstLetter(dataIndex)),
          { Column: capitalizeFirstLetter(dataIndex), Value: selectedKeys[0] },
        ];
        setFilters(listFilter);
    }
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (column: string, clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
    setFilters(filters.filter(f => f.Column !== column));
  };

  const getColumnSearchProps = (dataIndex: string): TableColumnType<User> => ({
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
            onClick={() => clearFilters && handleReset(capitalizeFirstLetter(dataIndex), clearFilters)}
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
    console.log(filters);
    if (sorter.field && sorter.order) {
      setSortedField(capitalizeFirstLetter(sorter.field));
      setSortedType(sorter.order === 'descend' ?  1 : 0);
    }
  }

    
  const handleAddUser = () => {
    form.resetFields(); // Reset form fields
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const createUserDto: CreatOrUpdateUser = {
        userName: values.userName,
        surName: values.surName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        assignedRole: {
          roleName: roles.find(role => role.id === roleId)?.name || '',
          roleId: roleId,
        },
      };
  
      await addUser(createUserDto);
      message.success('User added successfully');
      handleCancel();
      // Refresh the table data
      fetchUsers({
        PageIndex: pagination.current,
        PageSize: pagination.pageSize,
        SortedField: sortedField,
        SortedType: sortedType,
        Filters: filters,
      }).then(({ data, total }) => {
        setData(data);
        setTotal(total);
      });
    } catch (error) {
      message.error('Failed to add user');
    }
  };
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const { data, total } = await fetchUsers({
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

  const columns: ColumnsType<User> = [
    {
      title: 'UserName',
      dataIndex: 'userName',
      key: 'userName',
      ...getColumnSearchProps('userName'),
      sorter: (a, b) => a.userName.length - b.userName.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'SurName',
      dataIndex: 'surName',
      key: 'surName',
      ...getColumnSearchProps('surName'),
      sorter: (a, b) => a.surName?.length - b.surName?.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'PhoneNumber',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ...getColumnSearchProps('phoneNumber'),
      sorter: (a, b) => a.phoneNumber?.length - b.phoneNumber?.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Role',
      key: 'assignedRole',
      ...getColumnSearchProps('assignedRole'),
      render: (text, record) => (
        <span>{record.assignedRole.roleName}</span>
      ),    
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: User) => (
        <span>
          <Flex wrap gap="small">
            <Button type="primary"  onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Button type="primary" danger onClick={() => handleDelete(record)}>
              Delete
            </Button>
          </Flex>
        </span>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={handleAddUser} style={{ margin: 16 }}>
        Add New User
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ total, current: pagination.current, pageSize: pagination.pageSize }}
        onChange={handleTableChange}
      />
      <Modal
        title="Add New User"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="userName"
            label="User Name"
            rules={[{ required: true, message: 'Please input the user name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="surName"
            label="Surname"
            rules={[{ required: true, message: 'Please input the surname!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Select
              placeholder="Select a role"
              onChange={handleRoleChange}
            >
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={selectedUser}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item
            name="userName"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="surName"
            label="Surname"
            rules={[{ required: true, message: 'Please input the surname!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input the email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['assignedRole', 'roleId']}
            label="Role"
            rules={[{ required: true, message: 'Please select the role!' }]}
          >
            <Select onChange={handleRoleChange} placeholder="Select a role">
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name={['assignedRole', 'roleName']} hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
      >
        <p>Are you sure you want to delete this user?</p>
        <Button danger onClick={handleDeleteConfirm}>
          Confirm Delete
        </Button>
      </Modal>
    </>
  );
};
export default Users;

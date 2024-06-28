// pages/Roles.tsx
import React, { useState, useEffect } from 'react';
import { getRoles, addRole, editRole, deleteRole } from '../services/roleSerivce';
import { Role } from '../types';
import { Button, Flex, Form, Input, Modal, Table, message } from 'antd';
import { ColumnsType } from 'antd/es/table';

const Roles: React.FC = () => {
  const [data, setData] = useState<Role[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [form] = Form.useForm();

  const fetchRoles = async (pageIndex: number, pageSize: number) => {
    const data = await getRoles(pageIndex, pageSize);
    return { data: data.roles, total: data.totalRecords };
  };

  useEffect(() => {
    fetchTableData();
  }, [pagination]);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const { data, total } = await fetchRoles(pagination.current, pagination.pageSize);
      setData(data);
      setTotal(total);
    } catch (error) {
      message.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    form.setFieldsValue(role);
    setEditModalVisible(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditModalVisible(false);
    setDeleteModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addRole(values);
      message.success('Role added successfully');
      handleCancel();
      fetchTableData();
    } catch (error) {
      message.error('Failed to add role');
    }
  };

  const handleEditSubmit = async (values: Role) => {
    try {
      const updatedRole: Role = {
        ...values,
        id: selectedRole?.id,
      };
      await editRole(updatedRole);
      message.success('Role updated successfully');
      setEditModalVisible(false);
      fetchTableData();
    } catch (error) {
      message.error('Failed to update role');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRole(selectedRole?.id || '');
      message.success('Role deleted successfully');
      setDeleteModalVisible(false);
      fetchTableData();
    } catch (error) {
      message.error('Failed to delete role');
    }
  };

  const columns: ColumnsType<Role> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Role) => (
        <span>
            <Flex wrap gap="small">          
                <Button type="primary" onClick={() => handleEdit(record)}>
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
      <Button type="primary" onClick={handleAddRole} style={{ margin: 16 }}>
        Add New Role
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ total, current: pagination.current, pageSize: pagination.pageSize }}
        onChange={(pagination) => setPagination({
          ...pagination,
          current: pagination.current || 0,
          pageSize: pagination.pageSize || 10,
        })}
      />
      <Modal
        title="Add New Role"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please input the role name!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Role"
        open={editModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          initialValues={selectedRole}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please input the role name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <p>Are you sure you want to delete this role?</p>
        <Button danger onClick={handleDeleteConfirm}>
          Confirm Delete
        </Button>
      </Modal>
    </>
  );
};

export default Roles;

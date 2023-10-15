import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import SupervisorService from "../services/supervisor_service";

const Supervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSupervisor, setEditingSupervisor] = useState(null);

  const supervisorService = SupervisorService.getInstance();
  const { Option } = Select;
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => showDeleteConfirm(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const supervisorsData = await supervisorService.getSupervisors();
      setSupervisors(supervisorsData);
    } catch (error) {
      console.error("Error fetching supervisors:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingSupervisor(null);
    setModalVisible(true);
  };

  const handleEdit = (supervisor) => {
    form.setFieldsValue(supervisor);
    setEditingSupervisor(supervisor);
    setModalVisible(true);
  };

  const showDeleteConfirm = (supervisorId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this supervisor?",
      icon: "exclamation-circle",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(supervisorId),
    });
  };

  const handleDelete = async (supervisorId) => {
    try {
      await supervisorService.deleteSupervisor(supervisorId);
      fetchData();
    } catch (error) {
      console.error("Error deleting supervisor:", error.message);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSupervisor) {
        await supervisorService.updateSupervisor(editingSupervisor.id, values);
      } else {
        await supervisorService.createSupervisor(values);
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Supervisor
      </Button>
      <Table dataSource={supervisors} columns={columns} rowKey="id" />

      <Modal
        title={editingSupervisor ? "Edit Supervisor" : "Add Supervisor"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="accountStatus"
            label="Account Status"
            rules={[{ required: true, message: "Please enter account status" }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="contactNumber"
            label="Contact Number"
            rules={[{ required: true, message: "Please enter contact number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nic"
            label="NIC"
            rules={[{ required: true, message: "Please enter NIC" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Supervisors;

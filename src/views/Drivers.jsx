import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import DriverService from "../services/driver_service";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDriver, setEditingDriver] = useState(null);

  const driverService = DriverService.getInstance();

  const { Option } = Select;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
    },
    {
      title: "Base City",
      dataIndex: "baseCity",
      key: "baseCity",
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
      const driversData = await driverService.getDrivers();
      setDrivers(driversData);
    } catch (error) {
      console.error("Error fetching drivers:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingDriver(null);
    setModalVisible(true);
  };

  const handleEdit = (driver) => {
    form.setFieldsValue(driver);
    setEditingDriver(driver);
    setModalVisible(true);
  };

  const showDeleteConfirm = (driverId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this driver?",
      icon: "exclamation-circle",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(driverId),
    });
  };

  const handleDelete = async (driverId) => {
    try {
      await driverService.deleteDriver(driverId);
      fetchData();
    } catch (error) {
      console.error("Error deleting driver:", error.message);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingDriver) {
        await driverService.updateDriver(editingDriver.id, values);
      } else {
        await driverService.createDriver(values);
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
        Add Driver
      </Button>
      <Table dataSource={drivers} columns={columns} rowKey="id" />

      <Modal
        title={editingDriver ? "Edit Driver" : "Add Driver"}
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
            name="nic"
            label="NIC"
            rules={[{ required: true, message: "Please enter NIC" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="accountStatus"
            label="Account Status"
            rules={[
              { required: true, message: "Please select account status" },
            ]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="baseCity"
            label="Base City"
            rules={[{ required: true, message: "Please enter base city" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Drivers;

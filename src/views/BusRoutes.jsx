import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import RouteService from "../services/route_service";

const BusRoutes = () => {
  const [routes, setBusRoutes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoute, setEditingRoute] = useState(null);

  const routeService = RouteService.getInstance();

  const columns = [
    {
      title: "Route Number",
      dataIndex: "routeNumber",
      key: "routeNumber",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      const routesData = await routeService.getBusRoutes();
      setBusRoutes(routesData);
    } catch (error) {
      console.error("Error fetching routes:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingRoute(null);
    setModalVisible(true);
  };

  const handleEdit = (route) => {
    form.setFieldsValue(route);
    setEditingRoute(route);
    setModalVisible(true);
  };

  const showDeleteConfirm = (routeId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this route?",
      icon: "exclamation-circle",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(routeId),
    });
  };

  const handleDelete = async (routeId) => {
    try {
      await routeService.deleteRoute(routeId);
      fetchData();
    } catch (error) {
      console.error("Error deleting route:", error.message);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRoute) {
        await routeService.updateRoute(editingRoute.id, values);
      } else {
        await routeService.createRoute(values);
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

  const validateRouteNumber = async (_, value) => {
    if (value && !(await routeService.isRouteNumberUnique(value))) {
      return Promise.reject("Route number must be unique");
    }
    return Promise.resolve();
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Route
      </Button>
      <Table dataSource={routes} columns={columns} rowKey="id" />

      <Modal
        title={editingRoute ? "Edit Route" : "Add Route"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="routeNumber"
            label="Route Number"
            rules={[
              { required: true, message: "Please enter route number" },
              !editingRoute && { validator: validateRouteNumber },
            ]}
          >
            <Input disabled={editingRoute} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BusRoutes;

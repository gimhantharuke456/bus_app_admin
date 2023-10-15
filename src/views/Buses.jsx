import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import BusService from "../services/bus_service";
import RouteService from "../services/route_service";
import DriverService from "../services/driver_service";
import QrCode from "react-qr-code";
import QRCode from "react-qr-code";
const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBus, setEditingBus] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const busService = BusService.getInstance();
  const routeService = RouteService.getInstance();
  const driverService = DriverService.getInstance();

  const { Option } = Select;

  const columns = [
    {
      title: "Route Number",
      dataIndex: "routeNumber",
      key: "routeNumber",
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
    },
    {
      title: "Number of Seats",
      dataIndex: "numSeats",
      key: "numSeats",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "QR Code",
      render: (_, record) => (
        <QrCode id="qrcode" value={`Bus ID: ${record.id}`} size={50} />
      ),
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
  const handleDownloadQrCode = (busId) => {
    // Create a virtual link element
    const link = document.createElement("a");

    // Set link's attributes
    link.download = `qrcode_bus_${busId}.png`;
    link.href = createQrCodeDataURL(`Bus ID: ${busId}`);

    // Dispatch a click event to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the DOM
    document.body.removeChild(link);
  };
  const createQrCodeDataURL = (data) => {
    // Create a temporary canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 150;
    canvas.height = 150;

    // Draw the QR Code onto the canvas
    QRCode.toCanvas(canvas, data, { errorCorrectionLevel: "H" });

    // Return the data URL of the canvas
    return canvas.toDataURL("image/png");
  };

  const fetchData = async () => {
    try {
      const busesData = await busService.getBuses();
      const routesData = await routeService.getBusRoutes();
      const driversData = await driverService.getDrivers();

      setBuses(busesData);
      setRoutes(routesData);
      setDrivers(driversData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingBus(null);
    setModalVisible(true);
  };

  const handleEdit = (bus) => {
    form.setFieldsValue(bus);
    setEditingBus(bus);
    setModalVisible(true);
  };

  const showDeleteConfirm = (busId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this bus?",
      icon: "exclamation-circle",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(busId),
    });
  };

  const handleDelete = async (busId) => {
    try {
      await busService.deleteBus(busId);
      fetchData();
    } catch (error) {
      console.error("Error deleting bus:", error.message);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBus) {
        await busService.updateBus(editingBus.id, values);
      } else {
        await busService.createBus(values);
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
        Add Bus
      </Button>
      <Table dataSource={buses} columns={columns} rowKey="id" />

      <Modal
        title={editingBus ? "Edit Bus" : "Add Bus"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="routeNumber" label="Route Number">
            <Select>
              {routes.map((route) => (
                <Option key={route.id} value={route.routeNumber}>
                  {route.routeNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="driver" label="Driver">
            <Select>
              {drivers.map((driver) => (
                <Option key={driver.id} value={driver.name}>
                  {driver.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="numSeats" label="Number of Seats">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option key={"On Dipo"} value={"On Dipo"} />
              <Option key={"On Road"} value={"On Road"} />
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Buses;

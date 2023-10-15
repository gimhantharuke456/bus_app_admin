import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import ScheduleService from "../services/schedule_service";
import BusService from "../services/bus_service";
import RouteService from "../services/route_service";
import moment from "moment";

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [busOptions, setBusOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);

  const scheduleService = ScheduleService.getInstance();
  const busService = BusService.getInstance();
  const routeService = RouteService.getInstance();

  const { Option } = Select;

  const columns = [
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Bus ID",
      dataIndex: "busId",
      key: "busId",
    },
    {
      title: "Route ID",
      dataIndex: "routeId",
      key: "routeId",
    },
    {
      title: "Route Number",
      dataIndex: "routeNumber",
      key: "routeNumber",
    },
    {
      title: "Route Name",
      dataIndex: "routeName",
      key: "routeName",
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
      const schedulesData = await scheduleService.getSchedules();
      const busesData = await busService.getBuses();
      const routesData = await routeService.getBusRoutes();

      setSchedules(schedulesData);
      setBusOptions(busesData);
      setRouteOptions(routesData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingSchedule(null);
    setModalVisible(true);
  };

  const handleEdit = (schedule) => {
    schedule.date = moment(schedule.date, "YYYY-MM-DD");
    schedule.time = moment(schedule.time, "HH:mm:ss");
    form.setFieldsValue(schedule);
    setEditingSchedule(schedule);
    setModalVisible(true);
  };

  const showDeleteConfirm = (scheduleId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this schedule?",
      icon: "exclamation-circle",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(scheduleId),
    });
  };

  const handleDelete = async (scheduleId) => {
    try {
      await scheduleService.deleteSchedule(scheduleId);
      fetchData();
    } catch (error) {
      console.error("Error deleting schedule:", error.message);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      values.time = values.time.format("HH:mm:ss");

      values.date = values.date.format("YYYY-MM-DD");

      if (editingSchedule) {
        await scheduleService.updateSchedule(editingSchedule.id, values);
      } else {
        await scheduleService.createSchedule(values);
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

  const handleRouteChange = async (routeId) => {
    try {
      const route = await routeService.getRouteById(routeId);
      if (route) {
        form.setFieldsValue({
          routeNumber: route.routeNumber,
          routeName: route.name,
        });
      }
    } catch (error) {
      console.error("Error fetching route details:", error.message);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Schedule
      </Button>
      <Table dataSource={schedules} columns={columns} rowKey="id" />

      <Modal
        title={editingSchedule ? "Edit Schedule" : "Add Schedule"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.routeId) {
              handleRouteChange(changedValues.routeId);
            }
          }}
        >
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please enter time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="busId"
            label="Bus ID"
            rules={[{ required: true, message: "Please enter Bus ID" }]}
          >
            <Select>
              {busOptions.map((bus) => (
                <Option key={bus.id} value={bus.id}>
                  {bus.id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="routeId"
            label="Route ID"
            rules={[{ required: true, message: "Please select Route ID" }]}
          >
            <Select onChange={(value) => handleRouteChange(value)}>
              {routeOptions.map((route) => (
                <Option key={route.id} value={route.id}>
                  {route.id}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="routeNumber"
            label="Route Number"
            rules={[{ required: true, message: "Please enter Route Number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="routeName"
            label="Route Name"
            rules={[{ required: true, message: "Please enter Route Name" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedules;

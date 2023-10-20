import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CarOutlined,
  SolutionOutlined,
  ScheduleOutlined,
  LogoutOutlined,
  ReloadOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import AuthService from "../services/auth_service";
import { useSnapshot } from "valtio";
import state from "../store";
import Users from "./Users";
import Travellers from "./Travellers";
import Drivers from "./Drivers";
import Buses from "./Buses";
import Supervisors from "./Supervisors";
import BusRoutes from "./BusRoutes";
import Schedules from "./Schedules";
import CrowdedStates from "./CrowdedStates";
import Reservations from "./Reservations";
const { Header, Content, Sider } = Layout;
const authService = AuthService.getInstance();
const Dashboard = () => {
  const snap = useSnapshot(state);
  const handleLogout = () => {
    try {
      authService.signout();
    } catch (err) {}
  };

  const onDasBoardItemClicked = (index) => {
    state.activeIndex = index;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="vertical"
          theme="dark"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(1);
            }}
            key="1"
            icon={<UserOutlined />}
          >
            Users
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(3);
            }}
            key="3"
            icon={<CarOutlined />}
          >
            Drivers
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(4);
            }}
            key="4"
            icon={<SolutionOutlined />}
          >
            Buses
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(5);
            }}
            key="5"
            icon={<ScheduleOutlined />}
          >
            Supervisors
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(6);
            }}
            key="6"
            icon={<ReloadOutlined />}
          >
            Routes
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(7);
            }}
            key="7"
            icon={<ScheduleOutlined />}
          >
            Schedules
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(8);
            }}
            key="8"
            icon={<PercentageOutlined />}
          >
            Crowded Status
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDasBoardItemClicked(9);
            }}
            key="9"
            icon={<PercentageOutlined />}
          >
            Reservations
          </Menu.Item>
          <Menu.Item key="10" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0, background: "#fff" }}
        ></Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            {snap.activeIndex == 1 && <Users />}
            {snap.activeIndex == 9 && <Reservations />}
            {snap.activeIndex == 3 && <Drivers />}
            {snap.activeIndex == 4 && <Buses />}
            {snap.activeIndex == 5 && <Supervisors />}
            {snap.activeIndex == 6 && <BusRoutes />}
            {snap.activeIndex == 7 && <Schedules />}
            {snap.activeIndex == 8 && <CrowdedStates />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

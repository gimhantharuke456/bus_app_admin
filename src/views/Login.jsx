import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth_service";
const { Title } = Typography;
const authService = AuthService.getInstance();
// Define Yup validation schema
const validateschema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await authService.loginUser(values.email, values.password);
      navigate("/");
    } catch (error) {
      message.error(`Login failed ${error}`);
    }
  };

  return (
    <Card style={{ width: 400, margin: "auto", marginTop: 100 }}>
      <Title level={2} style={{ textAlign: "center" }}>
        Admin Login
      </Title>
      <Form
        name="loginForm"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateschema={validateschema}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Invalid email address" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginForm;

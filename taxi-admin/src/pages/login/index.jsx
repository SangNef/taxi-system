import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "~/api/auth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login(values);
  
      if (response.code === 0 && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError(response.message || "An error occurred during login.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 rounded-lg shadow-lg w-full max-w-xl bg-[#00000022] border border-gray-800">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-white">Sign in</h2>

      {error && <p className="text-red-500 mb-6"> {error}</p>}

      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          label={<span style={{ color: "white" }}>Email</span>}
          name="email"
          rules={[
            {
              required: true,
              message: "Email is required.",
            },
            {
              type: "email",
              message: "Please enter a valid email address.",
            },
          ]}
        >
          <Input placeholder="your@email.com" />
        </Form.Item>

        <Form.Item
          label={<span style={{ color: "white" }}>Password</span>}
          name="password"
          rules={[{ required: true, message: "Password is required." }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        <a href="#" className="text-sm mb-4 block text-right text-gray-200">
          Forgot your password?
        </a>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

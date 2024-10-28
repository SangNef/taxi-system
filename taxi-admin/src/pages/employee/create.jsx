import { Modal, Form, Input, Button } from "antd";
import React, { useState } from "react";

const Create = ({ isVisible, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate(values); // Pass the new employee data to the parent component
      form.resetFields(); // Reset the form fields after submission
      onClose(); // Close the modal
    });
  };

  return (
    <Modal
      title="Create New Employee"
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="employeeId"
          label="Employee ID"
          rules={[{ required: true, message: "Please enter Employee ID" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the employee's name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="position"
          label="Position"
          rules={[{ required: true, message: "Please enter the employee's position" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="department"
          label="Department"
          rules={[{ required: true, message: "Please enter the employee's department" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="contact" label="Contact">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;

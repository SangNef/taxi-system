import { Modal, Button, Form, Input } from "antd";
import React, { useState } from "react";

const Create = ({ isVisible, onClose, onCreate }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Create New Trip"
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tripId"
          label="Trip ID"
          rules={[{ required: true, message: "Please input the Trip ID!" }]}
        >
          <Input placeholder="Enter Trip ID" />
        </Form.Item>
        <Form.Item
          name="driverName"
          label="Driver Name"
          rules={[{ required: true, message: "Please input the Driver Name!" }]}
        >
          <Input placeholder="Enter Driver Name" />
        </Form.Item>
        <Form.Item
          name="startLocation"
          label="Start Location"
          rules={[{ required: true, message: "Please input the Start Location!" }]}
        >
          <Input placeholder="Enter Start Location" />
        </Form.Item>
        <Form.Item
          name="endLocation"
          label="End Location"
          rules={[{ required: true, message: "Please input the End Location!" }]}
        >
          <Input placeholder="Enter End Location" />
        </Form.Item>
        <Form.Item
          name="distance"
          label="Distance (km)"
          rules={[{ required: true, message: "Please input the distance!" }]}
        >
          <Input placeholder="Enter Distance" type="number" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please input the Status!" }]}
        >
          <Input placeholder="Enter Status" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;

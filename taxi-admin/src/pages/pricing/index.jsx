import { Table, Button } from "antd";
import React, { useState } from "react";

const Pricing = () => {
  const [pricingData, setPricingData] = useState([
    {
      key: "1",
      provinceName: "New York",
      price: 100,
    },
    {
      key: "2",
      provinceName: "California",
      price: 200,
    },
    {
      key: "3",
      provinceName: "Texas",
      price: 150,
    },
    {
      key: "4",
      provinceName: "Florida",
      price: 120,
    },
    {
      key: "5",
      provinceName: "Illinois",
      price: 180,
    },
  ]);

  // Handle edit button click (here, you could open a modal to edit the row, for simplicity we'll log the action)
  const handleEdit = (record) => {
    console.log("Edit record:", record);
    // You can trigger a modal to edit the price here
  };

  // Define columns for the pricing table
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "stt",
      render: (text, record, index) => index + 1, // STT as row index starting from 1
    },
    {
      title: "Province Name",
      dataIndex: "provinceName",
      key: "provinceName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`, // Format price with a dollar sign and two decimal places
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="px-5 py-12">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-white mb-6">Pricing List</h2>
      </div>
      <div className="bg-[#222E3C] rounded-lg p-5">
        <Table
          dataSource={pricingData}
          columns={columns}
          pagination={true}
          className="transparent-table"
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
};

export default Pricing;

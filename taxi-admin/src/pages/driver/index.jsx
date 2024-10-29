import { Table } from "antd";
import React from "react";

const Driver = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`${
            status === "Active"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <div className="flex gap-4">
            <button className="text-blue-500">Edit</button>
            <button className="text-red-500">Delete</button>
          </div>
        ),
    }
  ];

  const drivers = [
    {
      key: "1",
      id: "DRV001",
      name: "John Doe",
      phoneNumber: "123-456-7890",
      licenseNumber: "ABC123456",
      vehicleType: "Truck",
      status: "Active",
    },
    {
      key: "2",
      id: "DRV002",
      name: "Jane Smith",
      phoneNumber: "987-654-3210",
      licenseNumber: "XYZ987654",
      vehicleType: "Sedan",
      status: "Inactive",
    },
    {
      key: "3",
      id: "DRV003",
      name: "Alex Johnson",
      phoneNumber: "555-789-1234",
      licenseNumber: "LMN654321",
      vehicleType: "SUV",
      status: "Active",
    },
    {
      key: "4",
      id: "DRV004",
      name: "Emily Davis",
      phoneNumber: "222-333-4444",
      licenseNumber: "QRS123987",
      vehicleType: "Van",
      status: "Active",
    },
    {
      key: "5",
      id: "DRV005",
      name: "Michael Brown",
      phoneNumber: "444-555-6666",
      licenseNumber: "GHI789123",
      vehicleType: "Truck",
      status: "Inactive",
    },
  ];

  return (
    <div className="px-5 py-12">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-white mb-6">Drivers list</h2>
      </div>
      <div className="bg-[#222E3C] rounded-lg p-5">
        <Table
          dataSource={drivers} 
          columns={columns} 
          pagination={true} 
          className="transparent-table"
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
};

export default Driver;

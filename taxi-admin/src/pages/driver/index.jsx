import { Button, Popconfirm, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import { getDrivers } from "~/api/driver";

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await getDrivers();
      setDrivers(response.data.$values);
      console.log(response.data.values);
    } catch (error) {
      console.error(error);
      notification.error({ message: "Failed to load drivers" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    document.title = "Admin | Drivers";
  }, []);

  const handleBanDriver = (driverId) => {
    console.log(`Banning driver with ID: ${driverId}`);
  };

  const handleUnbanDriver = (driverId) => {
    console.log(`Unbanning driver with ID: ${driverId}`);
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      render: (text, record) => (
        <span>{record.taxies?.seat ? `${record.taxies.seat} seats` : "N/A"}</span>
      ),
    },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      render: (commission) => <span>{commission}%</span>,
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <span className={`${isActive ? "text-green-500" : "text-red-500"}`}>
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isDelete",
      key: "isDelete",
      render: (isDelete) => (
        <span className={`${isDelete ? "text-red-500" : "text-green-500"}`}>
          {isDelete ? "Banned" : "Online"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title={record.isDelete ? "Are you sure you want to unban this driver?" : "Are you sure you want to ban this driver?"}
          onConfirm={() => {
            if (record.isDelete) {
              handleUnbanDriver(record.id);
            } else {
              handleBanDriver(record.id);
            }
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger={record.isDelete}>
            {record.isDelete ? "Unban" : "Ban"}
          </Button>
        </Popconfirm>
      ),
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
          loading={loading}
          className="transparent-table"
          style={{ background: "transparent" }}
        />
      </div>
    </div>
  );
};

export default Driver;

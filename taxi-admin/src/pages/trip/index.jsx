import { Button, Table } from "antd";
import React, { useState } from "react";
import Create from "./create";

const Trip = () => {
  // State to handle modal visibility and trip data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [trips, setTrips] = useState([
    {
      key: "1",
      tripId: "TRP001",
      driverName: "John Doe",
      startLocation: "New York",
      endLocation: "Los Angeles",
      startLocationDetails: "123, Broadway St, New York, NY 10001",
      endLocationDetails: "456, Hollywood Blvd, Los Angeles, CA 90028",
      distance: 4500,
      status: "Completed",
    },
    {
      key: "2",
      tripId: "TRP002",
      driverName: "Jane Smith",
      startLocation: "Chicago",
      endLocation: "Houston",
      startLocationDetails: "789, Lakeshore Dr, Chicago, IL 60611",
      endLocationDetails: "101, Main St, Houston, TX 77002",
      distance: 1500,
      status: "In Progress",
    },
    {
      key: "3",
      tripId: "TRP003",
      driverName: "Alex Johnson",
      startLocation: "Miami",
      endLocation: "Atlanta",
      startLocationDetails: "202, Ocean Dr, Miami, FL 33139",
      endLocationDetails: "303, Peachtree St, Atlanta, GA 30303",
      distance: 600,
      status: "Cancelled",
    },
    {
      key: "4",
      tripId: "TRP004",
      driverName: "Emily Davis",
      startLocation: "San Francisco",
      endLocation: "Las Vegas",
      startLocationDetails: "404, Market St, San Francisco, CA 94103",
      endLocationDetails: "505, Fremont St, Las Vegas, NV 89101",
      distance: 900,
      status: "Completed",
    },
    {
      key: "5",
      tripId: "TRP005",
      driverName: "Michael Brown",
      startLocation: "Seattle",
      endLocation: "Denver",
      startLocationDetails: "606, Pike St, Seattle, WA 98101",
      endLocationDetails: "707, Colfax Ave, Denver, CO 80204",
      distance: 2000,
      status: "In Progress",
    },
  ]);

  // Define columns for the trips table
  const columns = [
    {
      title: "Trip ID",
      dataIndex: "tripId",
      key: "tripId",
    },
    {
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      title: "Start Location",
      dataIndex: "startLocation",
      key: "startLocation",
    },
    {
      title: "End Location",
      dataIndex: "endLocation",
      key: "endLocation",
    },
    {
      title: "Distance (km)",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`${
            status === "Completed"
              ? "text-green-500"
              : status === "In Progress"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  // Functions to handle modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (newTrip) => {
    // Assign a new key and add the new trip to the list
    setTrips([...trips, { key: trips.length + 1, ...newTrip }]);
  };

  return (
    <div className="px-5 py-12">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-white mb-6">Trips list</h2>
        <Button type="primary" onClick={showModal}>
          Create new
        </Button>
      </div>
      <div className="bg-[#222E3C] rounded-lg p-5">
        <Table
          dataSource={trips}
          columns={columns}
          pagination={true}
          className="transparent-table"
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={[
                  { title: 'Detail', dataIndex: 'detail', key: 'detail' },
                  { title: 'Value', dataIndex: 'value', key: 'value' },
                ]}
                dataSource={[
                  { key: 1, detail: 'Start Location Details', value: record.startLocationDetails },
                  { key: 2, detail: 'End Location Details', value: record.endLocationDetails },
                ]}
                pagination={false}
                showHeader={false}
                style={{ background: 'transparent' }}
              />
            ),
            rowExpandable: (record) => record.startLocationDetails || record.endLocationDetails,
          }}
          style={{ background: "transparent" }}
        />
      </div>
      {/* Modal for creating new trips */}
      <Create
        isVisible={isModalVisible}
        onClose={handleCancel}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default Trip;

import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import Create from "./create";
import { getBookings } from "~/api/booking";

const Trip = () => {
  // State to handle modal visibility and trip data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookings, setBookings] = useState([]);
  // Define columns for the trips table

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data || response);
    } catch (error) {
      console.error(error);
    }
  };

  // Functions to handle modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = (newTrip) => {
    // Assign a new key and add the new trip to the list
    // setTrips([...trips, { key: trips.length + 1, ...newTrip }]);
  };

  useEffect(() => {
    fetchBookings();
    document.title = "Admin | Trips";
  }, []);

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Driver",
      dataIndex: "driver",
      key: "driver",
    },
    {
      title: "Passenger",
      dataIndex: "passenger",
      key: "passenger",
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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" danger>
          Delete
        </Button> 
      ),
    }
  ];

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
          dataSource={bookings}
          columns={columns}
          pagination={true}
          className="transparent-table"
          expandable={{
            expandedRowRender: (record) => (
              <Table
                columns={[
                  { title: "Detail", dataIndex: "detail", key: "detail" },
                  { title: "Value", dataIndex: "value", key: "value" },
                ]}
                dataSource={[
                  { key: 1, detail: "Start Location Details", value: record.startLocationDetails },
                  { key: 2, detail: "End Location Details", value: record.endLocationDetails },
                ]}
                pagination={false}
                showHeader={false}
                style={{ background: "transparent" }}
              />
            ),
            rowExpandable: (record) => record.startLocationDetails || record.endLocationDetails,
          }}
          style={{ background: "transparent" }}
        />
      </div>
      {/* Modal for creating new trips */}
      <Create isVisible={isModalVisible} onClose={handleCancel} onCreate={handleCreate} />
    </div>
  );
};

export default Trip;

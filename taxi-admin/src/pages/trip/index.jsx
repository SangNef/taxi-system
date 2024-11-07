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
      setBookings(response.data);
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
      title: "Seat",
      dataIndex: "passengerCount",
      key: "passengerCount",
    },
    {
      title: "Start Location",
      dataIndex: "startLocation",
      key: "startLocation",
      render: (text, record) => (<p>{record.arivalDetails.pickUpDetails.province.provinceName}</p>)
    },
    {
      title: "End Location",
      dataIndex: "endLocation",
      key: "endLocation",
      render: (text, record) => (<p>{record.arivalDetails.dropOffDetails.province.provinceName}</p>)
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text, record) => (<p>{new Date(record.startAt).toLocaleDateString()}</p>)
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusLabels = {
          1: "Created",
          2: "Driver Accepted",
          3: "In Trip",
          4: "Completed",
          5: "Cancelled"
        };
    
        // Define CSS classes for each status
        const statusStyles = {
          1: "text-blue-500 bg-blue-100 px-2 py-1 rounded",      // Created - blue
          2: "text-orange-500 bg-orange-100 px-2 py-1 rounded",  // Driver Accepted - orange
          3: "text-yellow-500 bg-yellow-100 px-2 py-1 rounded",  // In Trip - yellow
          4: "text-green-500 bg-green-100 px-2 py-1 rounded",    // Completed - green
          5: "text-red-500 bg-red-100 px-2 py-1 rounded"         // Cancelled - red
        };
    
        return (
          <span className={statusStyles[status] || "text-gray-500 bg-gray-100 px-2 py-1 rounded"}>
            {statusLabels[status] || "Unknown"}
          </span>
        );
      }
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
          className="transparent-table !bg-transparent"
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

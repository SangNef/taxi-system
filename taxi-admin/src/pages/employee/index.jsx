import { Table, Button } from "antd";
import React, { useState } from "react";
import Create from "./create"; // Import the Create component

const Employee = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState([
    {
      key: "1",
      employeeId: "EMP001",
      name: "John Doe",
      position: "Driver",
      department: "Logistics",
      address: "123, Main St, New York, NY 10001",
      contact: "john.doe@email.com",
    },
    {
      key: "2",
      employeeId: "EMP002",
      name: "Jane Smith",
      position: "HR Manager",
      department: "Human Resources",
      address: "456, Elm St, Chicago, IL 60611",
      contact: "jane.smith@email.com",
    },
  ]);

  // Define columns for the employee table
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
  ];

  // Functions to handle modal visibility
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle new employee creation
  const handleCreate = (newEmployee) => {
    // Assign a new key and add the new employee to the list
    setEmployees([...employees, { key: employees.length + 1, ...newEmployee }]);
  };

  return (
    <div className="px-5 py-12">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold text-white mb-6">Employee List</h2>
        <Button type="primary" onClick={showModal}>
          Add Employee
        </Button>
      </div>
      <div className="bg-[#222E3C] rounded-lg p-5">
        <Table
          dataSource={employees}
          columns={columns}
          pagination={true}
          className="transparent-table"
          style={{ background: "transparent" }}
        />
      </div>
      {/* Modal for creating new employee */}
      <Create isVisible={isModalVisible} onClose={handleCancel} onCreate={handleCreate} />
    </div>
  );
};

export default Employee;

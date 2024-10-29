import React, { useState } from "react";
import Header from "~/components/header";
import Sidebar from "~/components/sidebar";

const AdminLayout = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to control sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
  };

  return (
    <div className="flex min-h-screen">
      {isSidebarVisible && <Sidebar />} {/* Show sidebar based on state */}
      <div className="flex-1 flex flex-col bg-gray-200 min-h-screen">
        <Header toggleSidebar={toggleSidebar} className="mb-4" /> {/* Pass toggle function to Header */}
        <main className="flex flex-col h-full w-full bg-[#19222D]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

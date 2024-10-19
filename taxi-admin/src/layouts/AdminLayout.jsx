import React from "react";
import Header from "~/components/header";
import Sidebar from "~/components/sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:block" /> {/* Sidebar is hidden on small screens */}
      <div className="flex-1 flex flex-col bg-gray-200 min-h-screen">
        <Header className="mb-4" />
        <main className="p-4 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

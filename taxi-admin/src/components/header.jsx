import React from "react";
import { Layout, Breadcrumb, Dropdown } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Bars3Icon, BellIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const { Header } = Layout;

const HeaderComponent = ({ toggleSidebar }) => { // Accept toggleSidebar as prop
  const navigate = useNavigate();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userMenu = (
    <div className="p-2 z-auto">
      <button onClick={handleSignOut} className="block px-4 py-2 text-gray-800">
        Sign Out
      </button>
    </div>
  );

  return (
    <header className="flex justify-between items-center px-6 py-2 bg-[#19222D] shadow-md">
      <div className="flex items-center space-x-4">
        {/* Menu icon with toggle functionality */}
        <Bars3Icon className="h-8 w-8 text-gray-200 cursor-pointer" onClick={toggleSidebar} />

        <Breadcrumb
          className="text-base custom-breadcrumb"
          separator={<span className="text-gray-200">/</span>}
        >
          <Breadcrumb.Item>
            <Link to="/" className="!text-gray-200 capitalize">Home</Link>
          </Breadcrumb.Item>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            return (
              <Breadcrumb.Item key={to}>
                <Link to={to} className="!text-gray-200 capitalize">{value}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>

      <div className="flex items-center space-x-6">
        <BellIcon className="h-8 w-8 text-gray-200 cursor-pointer" />
        <GlobeAltIcon className="h-8 w-8 text-gray-200 cursor-pointer" />
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <div className="cursor-pointer">
            {/* <UserAvatar isAgent={true} /> */}
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default HeaderComponent;

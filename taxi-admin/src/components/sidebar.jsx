import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChartBarIcon, UserGroupIcon, TruckIcon, BriefcaseIcon, CurrencyDollarIcon, ChatBubbleLeftIcon, Cog6ToothIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", icon: <ChartBarIcon className="h-6 w-6" />, link: "/" },
    { name: "Drivers", icon: <UserGroupIcon className="h-6 w-6" />, link: "/drivers" },
    { name: "Trips", icon: <TruckIcon className="h-6 w-6" />, link: "/trips" },
    { name: "Employees", icon: <BriefcaseIcon className="h-6 w-6" />, link: "/employees" },
    { name: "Pricings", icon: <CurrencyDollarIcon className="h-6 w-6" />, link: "/pricings" },
    { name: "Feedbacks", icon: <ChatBubbleLeftIcon className="h-6 w-6" />, link: "/feedbacks" },
    { name: "Configs", icon: <Cog6ToothIcon className="h-6 w-6" />, link: "/configs" },
    { name: "Services", icon: <WrenchScrewdriverIcon className="h-6 w-6" />, link: "/services" },
  ];

  const activeClass =
    "border-l-2 border-l-[#3B7DDD] bg-gradient-to-r from-[rgba(59,125,221,0.1)] to-[hsla(0,0%,100%,0)] !text-gray-200";

  return (
    <div className="min-h-screen bg-[#222E3C] shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0"> {/* Make sure to add necessary transition and transform classes */}
      <div className="w-[264px] px-6">
        <h2 className="py-4 font-bold text-white text-2xl">LiveChat</h2>
      </div>
      <div className="px-6 py-3">
        {/* <UserAvatar isAgent /> */}
      </div>
      <ul className="space-y-4 w-full mt-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`flex items-center space-x-4 py-2 px-6 cursor-pointer font-[400] text-gray-400 hover:text-gray-200 duration-300 ${
              location.pathname === item.link ? activeClass : ""
            }`}
          >
            <Link to={item.link} className="flex items-center w-full h-full space-x-4">
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

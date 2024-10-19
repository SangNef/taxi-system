import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const menu = [
        {
            name: "Dashboard",
            link: "/",
        },
        {
            name: "Drivers",
            link: "/drivers",
        },
        {
            name: "Bookings",
            link: "/bookings",
        },
        {
            name: "Price list",
            link: "/price-list",
        },
        {
            name: "Feedbacks",
            link: "/feedbacks",
        },
        {
            name: "Settings",
            link: "/settings",
        },
        {
            name: "Configs",
            link: "/configs",
        }
    ]
  return (
    <div className="bg-white w-72 shadow">
      <div className="flex items-center px-6 flex-shrink-0 py-10">
        <h2 className="font-bold leading-7 text-3xl text-gray-900">Taxi - Admin</h2>
      </div>
      <ul className="flex-1 px-6 space-y-2 overflow-hidden hover:overflow-auto w-full">
        {menu.map((item) => (
          <li key={item.name} className="w-full hover:bg-pink-50 duration-150 py-2 hover:px-2 group">
            <Link
              to={item.link}
              className="block w-full leading-5 font-normal no-underline text-gray-500 group-hover:text-[#FF6281] rounded-md"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

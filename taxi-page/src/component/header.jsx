import React, { useState } from "react";
import { PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";
import Form from "./form";

const Header = () => {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSelectedSlug = (slug) => {
    setSelectedSlug(slug);
    setShowForm(true);
  };

  const menus = [
    {
      name: "Xe ghép",
      slug: "#xe-ghep",
    },
    {
      name: "Bao xe",
      slug: "#bao-xe",
    },
    {
      name: "Đi sân bay",
      slug: "#di-san-bay",
    },
    {
      name: "Đi tỉnh",
      slug: "#di-tinh",
    },
    {
      name: "Tra cứu",
      slug: "#tra-cuu",
    },
  ];

  return (
    <>
      {showForm && <Form slug={selectedSlug} onClose={() => setShowForm(false)} />}
      <div className="w-full">
        <div className="max-w-6xl mx-auto py-2 flex justify-between">
          <img src={logo} alt="logo" className="w-20 h-auto object-cover" />
          <div className="flex items-center space-x-4">
            <a href="tel:0123456789" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <PhoneIcon className="h-5 w-5" />
              <span>0123456789</span>
            </a>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <GlobeAltIcon className="h-5 w-5" />
              <span>VN</span>
            </button>
          </div>
        </div>
        <nav className="w-full flex justify-end px-[20%] bg-[#FF9900] h-20 items-center">
          <ul className="flex gap-10">
            {menus.map((menu, index) => (
              <li
                key={index}
                className="text-lg font-semibold hover:text-white cursor-pointer border-b-2 border-transparent hover:border-white duration-300"
                onClick={() => handleSelectedSlug(menu.slug)}
              >
                <a href={menu.slug} className="text-white">
                  {menu.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;

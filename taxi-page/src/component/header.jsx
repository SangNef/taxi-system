import React, { useState } from "react";
import { PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";
import Form from "./form";
import { useTranslation } from "react-i18next";
import { Dropdown, Menu } from "antd";

import viFlag from "../assets/vi-flag.png";
import enFlag from "../assets/en-flag.png";

const Header = () => {
  const [selectedSlug, setSelectedSlug] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { t, i18n } = useTranslation();

  const handleSelectedSlug = (slug) => {
    setSelectedSlug(slug);
    setShowForm(true);
  };

  const handleLanguageChange = ({ key }) => {
    i18n.changeLanguage(key);
    localStorage.setItem("language", key);
  };

  const languageMenu = (
    <Menu onClick={handleLanguageChange}>
      <Menu.Item key="vi">
        <img src={viFlag} alt="Vietnamese flag" className="inline w-6 h-6 mr-2 object-cover rounded-full" />
        Tiếng Việt
      </Menu.Item>
      <Menu.Item key="en">
        <img src={enFlag} alt="English flag" className="inline w-6 h-6 mr-2 object-cover rounded-full" />
        English
      </Menu.Item>
    </Menu>
  );

  const menus = [
    {
      name: t("header.1"),
      slug: "#xe-ghep",
    },
    {
      name: t("header.2"),
      slug: "#bao-xe",
    },
    {
      name: t("header.3"),
      slug: "#di-san-bay",
    },
    {
      name: t("header.4"),
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
            <Dropdown overlay={languageMenu} trigger={['click']}>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
                <GlobeAltIcon className="h-5 w-5" />
                <span>{i18n.language.toUpperCase()}</span>
              </button>
            </Dropdown>
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

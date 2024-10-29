import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Form = ({ slug, onClose }) => {
  // Khởi tạo các state cho form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(1);  // Giá trị mặc định là 1
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Ngày hiện tại

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg md:max-h-[560px] p-6 rounded-lg shadow-lg overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Tạo Chuyến Đi</h2>
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="name" className="block text-sm text-gray-600">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="phone" className="block text-sm text-gray-600">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="count" className="block text-sm text-gray-600">
              Số ghế
            </label>
            <input
              type="number"
              id="count"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              value={count}
              min="1"
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
          <div className="w-full">
            <label htmlFor="date" className="block text-sm text-gray-600">
              Ngày đi
            </label>
            <input
              type="date"
              id="date"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              min={date} // Ngày tối thiểu là ngày hiện tại
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;

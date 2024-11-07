import React, { useState, useCallback } from "react";
import Select from "react-select";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { searchLocation } from "~/api/booking";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Form = ({ slug, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [count, setCount] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [pickupOptions, setPickupOptions] = useState([]);
  const [dropoffOptions, setDropoffOptions] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);

  // State for detailed location inputs
  const [pickupDetails, setPickupDetails] = useState("");
  const [dropoffDetails, setDropoffDetails] = useState("");

  const handleSearchLocation = async (inputValue, setOptions) => {
    try {
      const response = await searchLocation(inputValue);
      setOptions(
        response.data.map((location) => ({
          label: `${location.wardName} - ${location.district.districtName} - ${location.province.provinceName}`,
          value: location.wardId,
        }))
      );
    } catch (error) {
      console.error("Error searching locations:", error);
    }
  };

  const handleCreateBooking = async () => {
    try {
      const response = await createBooking({
        name,
        phone,
        count,
        date,
        pickup: pickup.value,
        pickupDetails,
        dropoff: dropoff.value,
        dropoffDetails,
        slug,
      });
      console.log("Booking created:", response);
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const debounceSearch = useCallback(
    debounce((inputValue, setOptions) => handleSearchLocation(inputValue, setOptions), 500),
    []
  );

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

        {/* Name and Phone Inputs */}
        <div className="flex justify-between gap-4 mb-4">
          <div className="w-full">
            <label htmlFor="name" className="block text-sm text-gray-600">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              placeholder="Họ và tên..."
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
              placeholder="Số điện thoại..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Count and Date Inputs */}
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
              min={date}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Pickup and Dropoff Location Select Inputs */}
        <div className="w-full mb-4">
          <label className="block text-sm text-gray-600">Điểm đón</label>
          <Select
            placeholder="Chọn điểm đón"
            value={pickup}
            onChange={setPickup}
            onInputChange={(inputValue) => debounceSearch(inputValue, setPickupOptions)}
            options={pickupOptions}
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "40px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
          <input
            type="text"
            placeholder="Chi tiết điểm đón..."
            className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none"
            value={pickupDetails}
            onChange={(e) => setPickupDetails(e.target.value)}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block text-sm text-gray-600">Điểm trả</label>
          <Select
            placeholder="Chọn điểm trả"
            value={dropoff}
            onChange={setDropoff}
            onInputChange={(inputValue) => debounceSearch(inputValue, setDropoffOptions)}
            options={dropoffOptions}
            className="w-full"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "40px",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
          />
          <input
            type="text"
            placeholder="Chi tiết điểm trả..."
            className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none"
            value={dropoffDetails}
            onChange={(e) => setDropoffDetails(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Form;

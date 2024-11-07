import React, { useState, useCallback } from "react";
import { Input, Select, Button } from "antd";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createBooking, searchBooking, searchLocation } from "~/api/booking";

// Custom debounce function
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
  const [pickupDetails, setPickupDetails] = useState("");
  const [dropoffDetails, setDropoffDetails] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);

  const handleSearchLocation = async (inputValue, setOptions) => {
    try {
      const response = await searchLocation(inputValue);
      setOptions(
        response.data.$values.map((location) => ({
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
        startTime: date,
        pickUpAddress: pickupDetails,
        dropOffAddress: dropoffDetails,
        pickUpId: pickup,
        dropOffId: dropoff,
        hasFull: slug === "#bao-xe" ? true : false,
      });
      console.log("Booking created:", response);
      onClose();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleSearchBooking = async () => {
    try {
      const response = await searchBooking(code);
      console.log(response)
      setResult(response);
    } catch (error) {
      console.error("Error searching booking:", error);
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
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          {slug === "#tra-cuu" ? "Tra Cứu" : "Tạo Chuyến Đi"}
        </h2>

        {slug === "#tra-cuu" ? (
          <div>
            <div className="w-full mb-4">
              <label htmlFor="code" className="block text-sm text-gray-600">
                Mã chuyến đi
              </label>
              <Input
                id="code"
                placeholder="Nhập mã chuyến đi..."
                value={code} // Bind `code` state
                onChange={(e) => setCode(e.target.value)} // Update `code` state
              />
            </div>
            <div className="flex justify-center">
              <Button type="primary" className="w-full mt-4" onClick={handleSearchBooking}>
                Tra cứu
              </Button>
            </div>
            {result && (
              <div className="mt-4">
                {result.code === 2 ? (
                  <p className="text-red-500">{result.message}</p>
                ) : (
                  <div>
                    <p><strong>Mã chuyến đi:</strong> {result.data.code}</p>
                    <p><strong>Ngày đi:</strong> {result.data.startAt}</p>
                    <p><strong>Số ghế:</strong> {result.data.count}</p>
                    <p><strong>Khách hàng:</strong> {result.data.customer.name} - {result.data.customer.phone}</p>
                    <p><strong>Điểm đón:</strong> {result.data.arivalDetails.pickUpDetails.wardName} - {result.data.arivalDetails.pickUpDetails.district.districtName} - {result.data.arivalDetails.pickUpDetails.province.provinceName}</p>
                    <p><strong>Điểm trả:</strong> {result.data.arivalDetails.dropOffDetails.wardName} - {result.data.arivalDetails.dropOffDetails.district.districtName} - {result.data.arivalDetails.dropOffDetails.province.provinceName}</p>
                    <p className="text-yellow-500">{result.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Name and Phone Inputs */}
            <div className="flex justify-between gap-4 mb-4">
              <div className="w-full">
                <label htmlFor="name" className="block text-sm text-gray-600">
                  Họ và tên
                </label>
                <Input id="name" placeholder="Họ và tên..." value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="w-full">
                <label htmlFor="phone" className="block text-sm text-gray-600">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  placeholder="Số điện thoại..."
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
                <Input type="number" id="count" value={count} min="1" onChange={(e) => setCount(e.target.value)} />
              </div>
              <div className="w-full">
                <label htmlFor="date" className="block text-sm text-gray-600">
                  Ngày đi
                </label>
                <Input type="date" id="date" value={date} min={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            {/* Pickup and Dropoff Location Select Inputs */}
            <div className="w-full mb-4">
              <label className="block text-sm text-gray-600">Điểm đón</label>
              <Select
                showSearch
                placeholder="Chọn điểm đón"
                value={pickup}
                onChange={setPickup}
                onSearch={(inputValue) => debounceSearch(inputValue, setPickupOptions)}
                options={pickupOptions}
                filterOption={false}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="Chi tiết điểm đón..."
                value={pickupDetails}
                onChange={(e) => setPickupDetails(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-sm text-gray-600">Điểm trả</label>
              <Select
                showSearch
                placeholder="Chọn điểm trả"
                value={dropoff}
                onChange={setDropoff}
                onSearch={(inputValue) => debounceSearch(inputValue, setDropoffOptions)}
                options={dropoffOptions}
                filterOption={false}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="Chi tiết điểm trả..."
                value={dropoffDetails}
                onChange={(e) => setDropoffDetails(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex justify-center">
              <Button type="primary" onClick={handleCreateBooking} className="w-full mt-4">
                Xác nhận
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;

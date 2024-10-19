import React from "react";

const Header = () => {
  return (
    <div className="w-full bg-white shadow flex justify-between px-6 py-1">
      <div>{/* bread crumb */}</div>
      <div className="flex items-center gap-4 no-underline">
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium text-black">Admin</p>
          <span className="text-xs font-medium text-gray-600">super_admin</span>
        </div>
        <img src="https://res.cloudinary.com/dx2o9ki2g/image/upload/v1724044210/qr7b7mjuwjnobdzag6hf.jpg"
                alt="admin" class="h-12 w-12 rounded-full"></img>
      </div>
    </div>
  );
};

export default Header;

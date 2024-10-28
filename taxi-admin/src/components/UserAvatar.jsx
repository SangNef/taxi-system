import { Avatar } from "antd";
import React from "react";
import defaultAdmin from "~/assets/default-admin.jpg";
// import { useUser } from "~/context/UserContext";

const UserAvatar = ({ isAgent, username }) => {
  // const { user } = useUser();

  if (!isAgent) {
    return (
      <Avatar size="large" style={{ cursor: "pointer", marginLeft: 8, fontSize: '20px' }}>
      {username ? username.charAt(0).toUpperCase() : "?"}
    </Avatar>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <img src={defaultAdmin} className="w-10 h-10 object-cover rounded-md" alt="Admin Avatar" />
      <div>
        <h3 className="text-white font-semibold text-base">{user?.name}</h3>
        <p className="text-gray-200 text-sm">Agent</p>
      </div>
    </div>
  );
};

export default UserAvatar;

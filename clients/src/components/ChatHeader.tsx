import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

interface Props {
  user: any;
}

function ChatHeader({ user }: Props) {
  const [cookies, setCookie, removeCookie] = useCookies([
    "UserId",
    "AuthToken",
  ]);

  const handleLogout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    window.location.reload();
  };

  return (
    <div className="flex p-5 items-center justify-between bg-gradient-to-br from-pink-500 to-orange-500/80 backdrop-blur-lg rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 rounded-full overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={user.images[0]}
            alt={"photo of " + user.first_name}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{user.first_name}</h3>
          <p className="text-sm text-gray-300">{user.bio}</p>
        </div>
      </div>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
}

export default ChatHeader;

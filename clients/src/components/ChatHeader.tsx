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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex p-5 items-center justify-between bg-gradient-to-br from-[#fe3072] to-[#ff5940]/80 backdrop-blur-[7px]">
      <div className="">
        <div className="max-w-[150px] h-[150px] rounded-full overflow-hidden ">
          <img
            className="shadow-lg"
            src={user.images[0]}
            alt={"photo of " + user.first_name}
          />
        </div>
        <h3 className="text-white capitalize font-bold py-2">
          {"photo of " + user.first_name}
        </h3>
      </div>
      <i
        className="text-white font-semibold rounded-md border border-white/50 py-2 px-4 active:translate-y-[1px] cursor-pointer"
        onClick={handleLogout}
      >
        Log Out
      </i>
    </div>
  );
}

export default ChatHeader;

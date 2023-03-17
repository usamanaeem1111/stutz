import { FaHome, FaUser, FaBell, FaEnvelope, FaHeart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import MessageDropdown from "./MessageDropdown";
import { useSelector } from "react-redux";
import { RootState } from "../store";

function NavigationLinks() {
  const location = useLocation();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const isActive = (path: any) => {
    if (path === "/") {
      return location.pathname === "/";
    } else {
      return location.pathname.startsWith(path);
    }
  };

  return (
    <div className="flex items-center  w-full justify-between">
      <MessageDropdown messages={notifications} />
      <Link
        to="/"
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
          isActive("/")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FaHome className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Home</span>
      </Link>

      <Link
        to="/myprofile"
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
          isActive("/myprofile")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FaUser className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">My Profile</span>
      </Link>

      <Link
        to="/dashboard"
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
          isActive("/dashboard")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FaEnvelope className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Messages</span>
      </Link>

      <Link
        to="/"
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
          isActive("/matches")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FaHeart className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Matches</span>
      </Link>
    </div>
  );
}

export default NavigationLinks;

import { FaHome, FaUser, FaBell, FaEnvelope, FaHeart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function NavigationLinks() {
  const location = useLocation();
  const isActive = (path: any) => {
    if (path === "/") {
      return location.pathname === "/";
    } else {
      return location.pathname.startsWith(path);
    }
  };

  return (
    <div className="sticky bottom-0 z-[999] backdrop-blur-[7px] bg-white/50 flex items-center justify-between mt-3 bg-white ">
      <Link
        to="/"
        className={`flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors duration-200 mx-1 p-1 ${
          isActive("/") ? "text-gray-900" : ""
        }`}
      >
        <FaHome className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Home</span>
      </Link>

      <Link
        to="/myprofile"
        className={`flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors duration-200 mx-1 p-1 ${
          isActive("/myprofile") ? "text-gray-900 bg-gray-500" : ""
        }`}
      >
        <FaUser className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">My Profile</span>
      </Link>

      <Link
        to="/"
        className={`flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors duration-200 mx-1 p-1 ${
          isActive("/notifications") ? "text-gray-900" : ""
        }`}
      >
        <FaBell className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Notifications</span>
      </Link>

      <Link
        to="/dashboard"
        className={`flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors duration-200 mx-1 p-1 ${
          isActive("/dashboard") ? "text-gray-900" : ""
        }`}
      >
        <FaEnvelope className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Messages</span>
      </Link>

      <Link
        to="/"
        className={`flex flex-col items-center text-gray-500 hover:text-gray-900 transition-colors duration-200 mx-1 p-1 ${
          isActive("/matches") ? "text-gray-900" : ""
        }`}
      >
        <FaHeart className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Matches</span>
      </Link>
    </div>
  );
}

export default NavigationLinks;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaHeart,
  FaHandshake,
} from "react-icons/fa";
import MessageDropdown from "./MessageDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { RootState } from "../store";
import { userActions } from "../store/reducers/user/user.reducer";

function NavigationLinks() {
  const location = useLocation();
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  console.log(notifications);
  const user = useSelector((state: RootState) => state.user.user);
  const [matchNotification, setMatchNotification] = useState(true);
  const [notificationRemoved, setNotificationRemoved] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: any) => {
    if (path === "/") {
      return location.pathname === "/";
    } else {
      return location.pathname.startsWith(path);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  // {process.env.REACT_APP_BASE_URL}
  const markAllNotificationsAsRead = () => {
    console.log(
      "send request to the api to mark all the notifications as read"
    );
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className={`${
        !user && "hidden"
      } flex items-center w-full justify-between`}
    >
      <div onClick={toggleDropdown}>
        <FaBell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="h-3 w-3 bg-[red] rounded-full absolute right-2 top-2"></span>
        )}
      </div>
      {user?.notification && dropdownOpen && (
        <NotificationDropdown
          notifications={user?.notification}
          markAllNotificationsAsRead={markAllNotificationsAsRead}
        />
      )}

      <Link
        to="/"
        className={`flex flex-col items-center transition-colors duration-200 mx-1 p-2 ${
          isActive("/")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-[#100307] hover:text-gray-900"
        }`}
      >
        <FaHome className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">בית</span>
      </Link>

      <Link
        to="/myprofile"
        className={`flex flex-col items-center transition-colors duration-200 mx-1 p-2 ${
          isActive("/myprofile")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-[#100307] hover:text-gray-900"
        }`}
      >
        <FaUser className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">הפרופיל שלי</span>
      </Link>

      <Link
        to="/dashboard"
        className={`flex flex-col items-center transition-colors duration-200 mx-1 p-2 ${
          isActive("/dashboard")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-[#100307] hover:text-gray-900"
        }`}
      >
        <FaEnvelope className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">הודעות</span>
      </Link>

      <div
        onClick={() => {
          setMatchNotification(true);
        }}
        className={`flex flex-col items-center transition-colors duration-200 mx-1 p-2 cursor-pointer rounded-md active:translate-y-[1px] hover:bg-white/80 hover:backdrop-blur-[7px] ${
          isActive("/matches")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-[#100307] hover:text-gray-900"
        }`}
      >
        <FaHeart className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">התאמות</span>{" "}
        {matchNotification && (
          <span className="h-3 w-3 bg-[red] rounded-full"></span>
        )}
      </div>
    </div>
  );
}

export default NavigationLinks;

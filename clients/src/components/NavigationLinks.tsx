import {
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaHeart,
  FaHandshake,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import MessageDropdown from "./MessageDropdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import axios from "axios";
import { userActions } from "../store/reducers/user/user.reducer";
import { useState } from "react";

function NavigationLinks() {
  const location = useLocation();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const user = useSelector((state: RootState) => state.user.user);
  const [alert, setAlert] = useState(true);

  const dispatch = useDispatch();

  const handleNotificationsClick = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/users/${user?.user_id}/notifications`
      );
      dispatch(userActions.updateUser(response.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const isActive = (path: any) => {
    if (path === "/") {
      return location.pathname === "/";
    } else {
      return location.pathname.startsWith(path);
    }
  };

  return (
    <div
      className={`${
        !user && "hidden"
      } flex items-center  w-full justify-between`}
    >
      {/* notification link */}
      <MessageDropdown messages={notifications} />

      <Link
        to="/"
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
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
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
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
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 ${
          isActive("/dashboard")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-[#100307] hover:text-gray-900"
        }`}
      >
        <FaEnvelope className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">הודעות</span>
      </Link>

      <div
        onClick={handleNotificationsClick}
        className={`flex flex-col items-center  transition-colors duration-200 mx-1 p-2 cursor-pointer rounded-md active:translate-y-[1px] hover:bg-white/80 hover:backdrop-blur-[7px] ${
          isActive("/matches")
            ? "text-[#fe316e] bg-white shadow-lg md:shadow-none active:translate-y-[1px] rounded-lg "
            : "text-[#100307] hover:text-gray-900"
        }`}
      >
        <FaHeart className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">התאמות</span>{" "}
        {user && user.notification && (
          <span className="h-6 w-6 bg-[red] rounded-full"></span>
        )}
      </div>
    </div>
  );
}

export default NavigationLinks;

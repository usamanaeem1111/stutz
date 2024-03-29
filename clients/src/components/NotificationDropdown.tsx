import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface NotificationDropdownProps {
  notifications: any[];
  markAllNotificationsAsRead: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  markAllNotificationsAsRead,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  const handleNotificationClick = (id: number) => {
    console.log(`mark notification ${id} as read`);
  };

  const handleClearNotificationsClick = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/user/${user?.user_id}/notification`
      );
      if (response.status === 200) {
        console.log("Notifications cleared successfully");
        markAllNotificationsAsRead();
      } else {
        console.error("Failed to clear notifications");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifications = notifications
    .filter((notification) => !notification.read)
    .slice(0, 5);

  return (
    <div className=" mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-md z-50 text-black">
      <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
        <h2 className="text-lg font-medium">Notifications</h2>
        <button
          onClick={handleClearNotificationsClick}
          className="text-xs text-blue-600 hover:underline focus:outline-none"
        >
          Clear notifications
        </button>
      </div>
      <ul>
        {notifications.length > 0 ? (
          unreadNotifications.map((notification, index) => (
            <li
              key={String(index) + notification.matched_id}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleNotificationClick(notification.matched_id)}
            >
              <div className="rounded-full bg-blue-500 h-6 w-6 flex items-center justify-center mr-2">
                <span className="text-white text-sm">{notification.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  match {notification.matched_id}
                </p>
                <p className="text-xs text-gray-500">{notification.date}</p>
              </div>
            </li>
          ))
        ) : (
          <p className="p-4 text-gray-500">No notifications yet</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;

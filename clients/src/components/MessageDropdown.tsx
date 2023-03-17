import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../store/reducers/notification/notification.reducer";
import { RootState } from "../store";
import { FaHome, FaUser, FaBell, FaEnvelope, FaHeart } from "react-icons/fa";

interface ChatMessage {
  timestamp: string;
  from_userId: string;
  to_userId?: string;
  message?: string;
  currentUser?: boolean;
}
interface Notification extends Omit<ChatMessage, "timestamp"> {}
interface Props {
  messages: Notification[];
}

interface Option {
  label: string;
  value: string;
  count: number;
}

const MessageDropdown: React.FC<Props> = ({ messages }) => {
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );
  const dispatch = useDispatch();

  const options: Option[] = messages.reduce((acc, curr) => {
    const index = acc.findIndex((option) => option.value === curr.from_userId);
    if (index === -1) {
      acc.push({
        label: curr.from_userId,
        value: curr.from_userId,
        count: 1,
      });
    } else {
      acc[index].count++;
    }
    return acc;
  }, [] as Option[]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleClick = (optionValue: string) => {
    setSelectedOption(optionValue);
    setShowDropdown(false);
  };

  return (
    <div className="z-[99] relative">
      <button
        type="button"
        className="flex flex-col items-center relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaBell className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Notifications</span>
        {options.length > 0 && notifications.length > 0 && (
          <span className="absolute  ml-2 inline-block bg-[#FE316E] text-white text-xs rounded-full px-2 py-1">
            {/* {options.reduce((total, option) => total + option.count, 0)} */}
            {notifications.length}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="fixed w-full  rounded-md rounded-tl-none shadow-lg bg-white ring-1 ring-black ring-opacity-5 md:max-w-[350px]">
          <div className="py-1">
            <div className="text-gray-700 px-4 py-3 font-medium border-b border-gray-200">
              Recent notifications
            </div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  dispatch(removeNotification(notification.id));
                  handleClick(notification.id.toString());
                }}
              >
                <div className="font-medium text-gray-900">
                  New Message From : {notification.from_userId}{" "}
                  {notification.message}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="px-4 py-2">
                <div className="text-gray-500 text-sm">
                  You have no new notifications
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;

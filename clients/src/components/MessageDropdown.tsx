import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNotifications,
  removeNotification,
} from "../store/reducers/notification/notification.reducer";
import { RootState } from "../store";

interface ChatMessage {
  timestamp: string;
  from_userId: string;
  to_userId: string;
  message: string;
  currentUser: boolean;
}

interface Props {
  messages: ChatMessage[];
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

  const counts: { [key: string]: number } = {};
  messages.forEach((message) => {
    const userId = message.from_userId;
    if (counts[userId]) {
      counts[userId]++;
    } else {
      counts[userId] = 1;
    }
  });

  const options: Option[] = Object.keys(counts).map((userId) => ({
    label: userId,
    value: userId,
    count: counts[userId],
  }));

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleClick = (optionValue: string) => {
    setSelectedOption(optionValue);
    setShowDropdown(false);
    dispatch(clearNotifications());
  };

  return (
    <div className="relative z-50">
      <button
        type="button"
        className="relative flex items-center bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span>Notifications</span>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center bg-[#FE316E] text-white text-xs rounded-full w-5 h-5">
            {notifications.length}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="absolute top-full  mt-2 w-80 bg-white shadow-md border rounded-lg overflow-hidden">
          <div className="px-4 py-3 font-medium border-b border-gray-200 text-gray-700">
            Recent notifications
          </div>
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                handleClick(option.value);
              }}
            >
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={`https://i.pravatar.cc/100?u=${option.value}`}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-800">
                  ({option.count}) New Messages from {option.label}
                </div>
              </div>
            </div>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-2 text-gray-500 text-sm">
              You have no new notifications
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../store/reducers/notification/notification.reducer";
import { RootState } from "../store";
import { FaBell } from "react-icons/fa";

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

  const handleClick = (optionValue: string) => {
    setShowDropdown(false);
  };

  return (
    <div className="z-[99] relative">
      <button
        type="button"
        className={`${
          showDropdown && "bg-[#00ffb5] text-black/50 "
        } flex flex-col items-center relative p-2 rounded-lg`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaBell className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1">Notifications</span>
        {options.length > 0 && notifications.length > 0 && (
          <span className="absolute h-4 w-4 flex items-center justify-center top-0 right-0 bg-[#FE316E] text-white text-xs rounded-full px-2 py-1">
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
                className=" py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  dispatch(removeNotification(notification.id));
                  handleClick(notification.id.toString());
                }}
              >
                <div className="grid grid-cols-3 items-center font-medium text-gray-900 border-b border-black/05 px-4 py-2">
                  <div className="col-span-2">{notification.message}</div>
                  <img
                    width={36}
                    height={36}
                    src={notification.profileImage}
                    alt="notification.profileImage"
                    className=""
                  />
                  <div>{notification.first_name}</div>
                  <div className="rounded-full overflow-hidden w-[30px] h-[30px] justify-self-end"></div>
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

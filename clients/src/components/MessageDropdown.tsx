import React, { useState } from "react";

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
    <div className="relative z-[99]">
      <button
        type="button"
        className="flex items-center bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span>Notifications</span>
        {options.length > 0 && (
          <span className="ml-2 inline-block bg-[#FE316E] text-white text-xs rounded-full px-2 py-1">
            {options.reduce((total, option) => total + option.count, 0)}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="text-gray-700 px-4 py-3 font-medium border-b border-gray-200">
              Recent notifications
            </div>
            {options.map((option) => (
              <div
                key={option.value}
                className={
                  "px-4 py-2 cursor-pointer hover:bg-gray-100" +
                  (option.value === selectedOption ? " bg-gray-100" : "")
                }
                onClick={() => handleClick(option.value)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">
                    {option.label}
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs inline-block text-gray-500 mr-1">
                      {option.count}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 fill-current text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.01 5A2.99 2.99 0 017 2h6a2.99 2.99 0 012.99 3L16 9H4l.01-4zm2-1a1 1 0 00-.99 1l-.01 4A.99.99 0 006 9h10a1 1 0 00.99-1l-.01-4A.99.99 0 0014 3H6zM9 13a1 1 0 100 2 1 1 0 000-2zM11 13a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{`You have ${option.count} new messages from ${option.label}`}</div>
              </div>
            ))}
            {options.length === 0 && (
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

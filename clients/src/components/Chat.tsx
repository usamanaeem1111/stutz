import { useRef, useEffect, useState } from "react";
import moment from "moment";

const Chat = ({ descendingOrderMessages, currentUser, clickedUser }: any) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);

  let prevDate: any = null;
  let prevUser: any = null;

  useEffect(() => {
    if (chatMessagesRef.current) {
      if (isAtBottom) {
        chatMessagesRef.current.scrollTop =
          chatMessagesRef.current.scrollHeight;
      }
    }
  }, [descendingOrderMessages, isAtBottom]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.target as HTMLDivElement;
    setIsAtBottom(
      element.scrollHeight - element.scrollTop === element.clientHeight
    );
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div
        className="overflow-y-scroll px-4 h-[500px]"
        ref={chatMessagesRef}
        onScroll={handleScroll}
      >
        {descendingOrderMessages.map((message: any, index: any) => {
          const isCurrentUser = message.currentUser;
          const showTimestamp =
            !prevDate || !moment(prevDate).isSame(message.timestamp, "day");
          const showProfileInfo =
            !prevUser || prevUser !== message.userId || showTimestamp;

          prevDate = message.timestamp;
          prevUser = message.userId;

          return (
            <div key={index} className="py-2">
              {showTimestamp && (
                <div className="text-xs text-gray-500 mb-2 text-center">
                  {moment(message.timestamp).format("MMMM D, YYYY")}
                </div>
              )}
              <div
                className={`flex ${
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                } items-start mb-1`}
              >
                <div className="flex-shrink-0">
                  {showProfileInfo && (
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        isCurrentUser
                          ? currentUser.images[0]
                          : clickedUser.images[0]
                      }
                      alt={message.name + " profile"}
                    />
                  )}
                </div>
                <div
                  className={`ml-2 p-2 rounded-lg ${
                    isCurrentUser ? "bg-[#00acffad] text-white" : "bg-gray-300"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  <div className="text-sm mb-1 font-medium">
                    {!showProfileInfo && isCurrentUser && (
                      <span className="text-gray-400 mr-2">You</span>
                    )}
                    {message.name}
                  </div>
                  <div className="text-sm text-gray-800">{message.message}</div>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    {moment(message.timestamp).format("h:mm A")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;

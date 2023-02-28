import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Chat from "./Chat";

const socket = io("http://localhost:8000");

const ChatInput = ({
  user,
  clickedUser,
  descendingOrderMessages,
  currentUser,
}: any) => {
  const [textArea, setTextArea] = useState<string>("");
  const [messagesTwo, setMessagesTwo] = useState<any>([]);

  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;

  useEffect(() => {
    setMessagesTwo(descendingOrderMessages);
  }, [descendingOrderMessages]);

  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      to_userId: clickedUserId,
      message: textArea,
      currentUser: true,
    };

    try {
      socket.emit("message", message); // Emit the message to the server
      setTextArea("");
      setMessagesTwo([...messagesTwo, message]); // Add the new message to the messages state variable
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  // console.log("user", user);
  return (
    <div>
      <Chat
        descendingOrderMessages={messagesTwo}
        currentUser={currentUser}
        clickedUser={clickedUser}
      />

      {/* chat input */}
      <div className="chat-input bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
        <textarea
          className="flex-1 bg-gray-100 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder={`Message ${user.first_name}...`}
          value={textArea}
          onChange={(e) => setTextArea(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          onClick={addMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

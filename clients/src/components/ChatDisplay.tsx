import Chat from "./Chat";
import ChatInput from "./ChatInput";
import axios from "axios";
import { useState, useEffect } from "react";

const ChatDisplay = ({ user, clickedUser }: any) => {
  const userId = user?.user_id;
  const clickedUserId = clickedUser?.user_id;
  const [usersMessages, setUsersMessages] = useState<any>(null);
  const [clickedUsersMessages, setClickedUsersMessages] = useState<any>(null);
  const getUsersMessages = async () => {
    try {
      const response = await axios.get("https://api.stutz.co.il/messages", {
        params: { userId: userId, correspondingUserId: clickedUserId },
      });
      setUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClickedUsersMessages = async () => {
    try {
      const response = await axios.get("https://api.stutz.co.il/messages", {
        params: { userId: clickedUserId, correspondingUserId: userId },
      });
      setClickedUsersMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersMessages();
    getClickedUsersMessages();
  }, [clickedUsersMessages]);

  const messages: any = [];

  usersMessages?.forEach((message: any) => {
    const formattedMessage: any = {};
    formattedMessage["currentUser"] = true;
    formattedMessage["name"] = user?.first_name;
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;
    messages.push(formattedMessage);
  });

  clickedUsersMessages?.forEach((message: any) => {
    const formattedMessage: any = {};
    formattedMessage["clickedUser"] = false;
    formattedMessage["name"] = clickedUser?.first_name;
    formattedMessage["message"] = message.message;
    formattedMessage["timestamp"] = message.timestamp;
    messages.push(formattedMessage);
  });

  const descendingOrderMessages = messages?.sort((a: any, b: any) =>
    String(a.timestamp).localeCompare(String(b.timestamp))
  );

  return (
    <>
      <h2 className="bg-[black]/50 text-white font-bold capitalize backdrop-blur-[7px] p-2">
        Talking to {clickedUser.first_name}
      </h2>

      <ChatInput
        user={user}
        getUserMessages={getUsersMessages}
        getClickedUsersMessages={getClickedUsersMessages}
        descendingOrderMessages={descendingOrderMessages}
        currentUser={user}
        clickedUser={clickedUser}
      />
    </>
  );
};

export default ChatDisplay;

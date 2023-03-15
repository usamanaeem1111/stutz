import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RootState, useSelector } from "../store";
import io from "socket.io-client";

import envelopIcon from "./imgs/envelopeIcon.svg";
import siteLogo from "./imgs/logo.png";
import MessageDropdown from "./MessageDropdown";

interface NavbarProps {
  minimal: boolean;
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  authToken?: string;
  setIsSignUp?: (show: boolean) => void;
  formData: any;
  removeCookie: any;
  cookies: any;
}

type Message = {
  timestamp: string;
  from_userId: string;
  to_userId: string;
  message: string;
  currentUser: boolean;
};

const Navbar: FC<NavbarProps> = (props) => {
  const [newMessage, setNewMessage] = useState(false);
  const [newMatch, setNewMatch] = useState(false);
  const [numUnreadMessages, setNumUnreadMessages] = useState(0);
  const [notificationClicked, setNotificationClicked] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const {
    minimal,
    setShowModal,
    showModal,
    authToken,
    setIsSignUp,
    formData,
    removeCookie,
    cookies,
  } = props;

  const socket = io("https://api.stutz.co.il");
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    socket.on("recive_msg", (data: Message) => {
      if (data.from_userId !== user?.user_id) {
        console.log("Message received:", data);
        setMessageList((prevList) => [...prevList, data]);
        setNumUnreadMessages(
          (prevNumUnreadMessages) => prevNumUnreadMessages + 1
        );
      }
    });

    socket.on("new_match", (userId) => {
      console.log(`New match found for user ${userId}`);
      setNewMatch(true);
    });

    // Remove event listeners when component is unmounted
    return () => {
      socket.off("recive_msg");
      socket.off("new_match");
    };
  }, [socket, user]);

  const handleNotificationClose = () => {
    setNumUnreadMessages(0);
    setNewMatch(false);
    setNotificationClicked(true);
  };

  const handleEnvelopIconClick = () => {
    setNewMessage(false);
  };

  const handleClick = () => {
    setShowModal(true);
    if (setIsSignUp) {
      setIsSignUp(false);
    }
  };

  const handleLogout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    console.log("Loging you out ");
    localStorage.removeItem("formData");
    window.location.href = "/";
  };

  return (
    <div className=" ">
      <nav className="container mx-auto  py-3 w-full flex items-start justify-end">
        {user && (
          <section className="flex  justify-around w-full">
            <div className="flex">
              <img
                className="h-12 w-12 rounded-full shadow-sm shadow-black/50 m-1"
                src={user.images[0] ?? ""}
                alt=""
              />

              <MessageDropdown messages={messageList} />
            </div>
          </section>
        )}

        <div className="flex w-full justify-between items-center">
          <div className={`${user === null && "hidden"}`}>
            <Link
              to="/dashboard"
              className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
            >
              הודעות{numUnreadMessages > 0 ? ` (${numUnreadMessages})` : ""}
            </Link>

            <Link
              to="/onboarding"
              className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
            >
              הפרופיל שלי
            </Link>

            <Link
              to="/adminStats"
              className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
            >
              AdminStats
            </Link>
          </div>

          <div className="mr-3">
            {!authToken && !minimal && (
              <button
                disabled={showModal}
                onClick={handleClick}
                className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
              >
                התחבר
              </button>
            )}

            {!authToken && minimal && (
              <button
                disabled={showModal}
                onClick={handleLogout}
                className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
              >
                התנתק
              </button>
            )}
          </div>
        </div>

        <div className="w-[300px]">
          <Link to="/">
            <img src={siteLogo} alt="siteLogo" />
          </Link>
        </div>
      </nav>

      {currentMessage && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-gray-100 text-gray-800 shadow-lg z-[999]">
          <p className="text-pink-500 font-bold mb-1">
            You have a new message from {currentMessage.from_userId}
          </p>
          <p>{currentMessage.message}</p>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded mt-2 hover:bg-pink-600"
            onClick={() => setCurrentMessage(null)}
          >
            Close
          </button>
        </div>
      )}

      {newMatch && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white text-gray-800 border-t-2 border-[#FE316E]">
          You have a new match
          <button onClick={handleNotificationClose}>Close</button>
        </div>
      )}

      {newMessage && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-gray-100 text-gray-800 shadow-lg z-[999]">
          <h2 className="text-pink-500 font-bold mb-2">New Messages</h2>
          <ul className="space-y-2">
            {messageList.map((message) => (
              <li key={message.from_userId}>
                <p className="font-bold">{message.from_userId}</p>
                <p>{message.message}</p>
              </li>
            ))}
          </ul>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded mt-2 hover:bg-pink-600"
            onClick={() => setNewMessage(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

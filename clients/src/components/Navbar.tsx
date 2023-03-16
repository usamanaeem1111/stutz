import { FC, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { RootState, useDispatch, useSelector } from "../store";
import io from "socket.io-client";

import siteLogo from "./imgs/logo.png";
import MessageDropdown from "./MessageDropdown";
import NavigationLinks from "./NavigationLinks";
import UserActions from "./UserActions";
import { addNotification } from "../store/reducers/notification/notification.reducer";
import ProfileDropdown from "./ProfileDropdown";

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

const Navbar: FC<NavbarProps> = ({
  minimal,
  setShowModal,
  showModal,
  authToken,
  setIsSignUp,
  formData,
  removeCookie,
  cookies,
}) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState(false);

  const [numUnreadMessages, setNumUnreadMessages] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const socket = io("https://api.stutz.co.il");
  const user = useSelector((state: RootState) => state.user.user);

  const [socketCalls, setSocketCalls] = useState(0);

  const handleNotificationClose = useCallback(() => {
    setNumUnreadMessages(0);
  }, []);

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      if (data.from_userId !== user?.user_id) {
        setMessageList((prevList) => [...prevList, data]);
        setNumUnreadMessages(
          (prevNumUnreadMessages) => prevNumUnreadMessages + 1
        );

        // Dispatch addNotification action
        dispatch(
          addNotification({
            id: Date.now(),
            message: data.message,
            from_userId: data.from_userId,
          })
        );

        setSocketCalls((prevSocketCalls) => prevSocketCalls + 1);
      }
    };

    if (socket && user) {
      socket.on("recive_msg", handleNewMessage);
    }

    return () => {
      if (socket && user) {
        socket.off("recive_msg", handleNewMessage);
      }
    };
  }, [socket, user]);

  const handleClick = useCallback(() => {
    setShowModal(true);
    if (setIsSignUp) {
      setIsSignUp(false);
    }
  }, [setIsSignUp, setShowModal]);

  const handleLogout = useCallback(() => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    localStorage.removeItem("formData");
    window.location.href = "/";
  }, [cookies.UserId, cookies.AuthToken, removeCookie]);

  return (
    <nav className="sticky top-0 z-[999] backdrop-blur-[7px] bg-white/20">
      <div className="container mx-auto  py-3 w-full flex items-center justify-between p-1 ">
        {user && (
          <section className="hidden md:flex items-center justify-between w-full ">
            <div className="relative w-10 h-10 mr-4">
              <img
                className="absolute top-0 left-0 w-full h-full rounded-full object-cover"
                src={user?.images?.[0] ?? ""}
                alt=""
              />
            </div>
          </section>
        )}

        {user && (
          <ProfileDropdown
            userImages={user.images}
            messageList={messageList}
            authToken={authToken}
            minimal={minimal}
            showModal={showModal}
            handleClick={handleClick}
            handleLogout={handleLogout}
          />
        )}
        <MessageDropdown messages={messageList} />

        <div className="hidden md:flex w-full justify-between items-center">
          <NavigationLinks />

          <UserActions
            authToken={authToken}
            minimal={minimal}
            showModal={showModal}
            handleClick={handleClick}
            handleLogout={handleLogout}
          />
        </div>

        <div className="min-w-[100px]">
          <Link to="/">
            <img className="mt-[-5px]" src={siteLogo} alt="siteLogo" />
          </Link>
        </div>
      </div>
      <p>{socketCalls} total socket calls</p>

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
    </nav>
  );
};

export default Navbar;

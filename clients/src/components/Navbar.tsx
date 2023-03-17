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

        <UserActions
          authToken={authToken}
          minimal={minimal}
          showModal={showModal}
          handleClick={handleClick}
          handleLogout={handleLogout}
        />

        <div className="hidden md:flex w-full justify-between items-center">
          <NavigationLinks />
        </div>

        <div className="min-w-[100px]">
          <Link to="/">
            <img className="mt-[-5px]" src={siteLogo} alt="siteLogo" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

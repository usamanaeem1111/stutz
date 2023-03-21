import { FC, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { RootState, useDispatch, useSelector } from "../store";
import io from "socket.io-client";

import siteLogo from "./imgs/logo.png";
import NavigationLinks from "./NavigationLinks";
import UserActions from "./UserActions";
import { addNotification } from "../store/reducers/notification/notification.reducer";
import axios from "axios";

interface NavbarProps {
  minimal: boolean;
  setShowModal: any;
  showModal: boolean;
  authToken?: string;
  setIsSignUp: any;
  formData: any;
  removeCookie: any;
  cookies: any;
  isSignUp: any;
  setCookie: any;
}

type Message = {
  timestamp: string;
  from_userId: string;
  to_userId: string;
  message: string;
  currentUser: boolean;
  first_name: string;
  profileImage: string;
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
  isSignUp,
  setCookie,
}) => {
  const dispatch = useDispatch();

  const [numUnreadMessages, setNumUnreadMessages] = useState(0);
  const [messageList, setMessageList] = useState<Message[]>([]);

  const socket = io(`${process.env.REACT_APP_BASE_URL}`);
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

        console.log("incomming message data ", data);
        // Dispatch addNotification action
        dispatch(
          addNotification({
            id: Date.now(),
            message: data.message,
            from_userId: data.from_userId,
            first_name: data.first_name,
            profileImage: data.profileImage,
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
    setIsSignUp(false);
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
        <UserActions
          authToken={authToken}
          minimal={false}
          showModal={showModal}
          handleClick={handleClick}
          handleLogout={handleLogout}
          user={formData}
        />

        <div className="hidden md:flex max-w-[500px] w-full justify-between items-center p-2">
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

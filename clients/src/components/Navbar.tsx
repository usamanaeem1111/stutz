import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { RootState, useSelector } from "../store";
import io from "socket.io-client";

import envelopIcon from "./imgs/envelopeIcon.svg";
import siteLogo from "./imgs/logo.png";
import ProfileCompletion from "./ProfileCompletion";

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

const Navbar: FC<NavbarProps> = (props) => {
  const [newMessage, setNewMessage] = useState(false);
  const [newMatch, setNewMatch] = useState(false);

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

  socket.on("recive_msg", (data) => {
    // Check if the message is not sent by the current user
    // console.log(user, data);
    if (data.from_userId !== user?.user_id) {
      console.log("Message received:", data);
      setNewMessage(true);
    }
  });

  socket.on("new_match", (userId) => {
    console.log(`New match found for user ${userId}`);
    setNewMatch(true);
  });

  const handleNotificationClose = () => {
    setNewMessage(false);
    setNewMatch(false);
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
    <div className="bg-gray-100 ">
      <nav className="container mx-auto  py-3 w-full flex items-start justify-end">
        {user && (
          <section className="flex  justify-around w-full">
            <div className="flex">
              <img
                className="h-12 w-12 rounded-full shadow-sm shadow-black/50 m-1"
                src={user.images[0] ?? ""}
                alt=""
              />

              <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center m-1 relative">
                <img src={envelopIcon} alt="envelopIcon" />
                {newMessage && (
                  <p className="absolute top-0 right-0 h-3 w-3 rounded-full bg-[#FE316E]"></p>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="flex w-full justify-between items-center">
          <div className={`${user === null && "hidden"}`}>
            <Link
              to="/dashboard"
              className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
            >
              הודעות
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
          <img src={siteLogo} alt="siteLogo" />
        </div>
      </nav>

      {newMessage && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white text-gray-800 border-t-2 border-[#FE316E]">
          You have a new message
          <button onClick={handleNotificationClose}>Close</button>
        </div>
      )}

      {newMatch && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white text-gray-800 border-t-2 border-[#FE316E]">
          You have a new match
          <button onClick={handleNotificationClose}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;

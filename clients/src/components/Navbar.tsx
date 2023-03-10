import React, { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import envelopIcon from "./imgs/envelopeIcon.svg";

interface NavbarProps {
  minimal: boolean;
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  authToken?: string;
  setIsSignUp?: (show: boolean) => void;
}

const Navbar: FC<NavbarProps> = ({
  minimal,
  setShowModal,
  showModal,
  authToken,
  setIsSignUp,
}) => {
  const handleClick = () => {
    setShowModal(true);
    if (setIsSignUp) {
      setIsSignUp(false);
    }
  };

  const [cookies, removeCookie] = useCookies(["UserId", "AuthToken"]);

  const handleLogout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    window.location.href = "/";
  };

  const [user, setUser] = useState<any>(null);
  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      // check if the image URL is already stored in localStorage
      const storedImage = localStorage.getItem(`userImage-${userId}`);

      if (storedImage) {
        // if the image URL is found, use it directly
        setUser({ ...user, images: [storedImage] });
      } else {
        // if the image URL is not found, fetch the user data from the database
        const response = await axios.get("http://localhost:8000/user", {
          params: { userId },
        });
        const userData = response.data;
        setUser(userData);

        // store the image URL in localStorage for future use
        localStorage.setItem(`userImage-${userId}`, userData.images[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="">
      <nav className="w-full flex justify-between z-[5] relative py-3">
        {/* profile section */}
        <div className="flex bg-[green] px-4">
          {user && (
            <img
              className=" h-[60px] w-[60px] overflow-hidden rounded-full shadow-sm shadow-black/50 m-1"
              src={user.images[0] ?? ""}
              alt=""
            />
          )}

          <div className="h-[60px] w-[60px] bg-[#F4F4F4] rounded-full flex items-center justify-center m-1 relative">
            <img src={envelopIcon} alt="envelopIcon" />
            <p className="absolute top-0 right-0 h-[15px] w-[15px] rounded-full bg-[#FF0000]"></p>
          </div>
        </div>

        <div className="flex items-center">
          <a
            href="/dashboard"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#c73232] hover:bg-red-800"
          >
            הודעות
          </a>

          <a
            href="/Onboarding"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#c73232] hover:bg-red-800"
          >
            הפרופיל שלי
          </a>
          <a
            href="/adminStats"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#c73232] hover:bg-red-800"
          >
            AdminStats
          </a>
          {!authToken && !minimal && (
            <button
              disabled={showModal}
              onClick={handleClick}
              className="text-[#c73232] bg-white/90 p-3 font-semibold rounded-xl m-2 disabled:bg-black/50"
            >
              Log In
            </button>
          )}
          {!authToken && minimal && (
            <button
              disabled={showModal}
              onClick={handleLogout}
              className="text-[#c73232] bg-white/90 p-3 font-semibold rounded-xl m-2 disabled:bg-black/50"
            >
              Log out
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

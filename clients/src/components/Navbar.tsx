import React, { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import envelopIcon from "./imgs/envelopeIcon.svg";
import ProfileCompletion from "./ProfileCompletion";

interface NavbarProps {
  minimal: boolean;
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  authToken?: string;
  setIsSignUp?: (show: boolean) => void;
  formData: any;
  user?: any;
}

const Navbar: FC<NavbarProps> = ({
  minimal,
  setShowModal,
  showModal,
  authToken,
  setIsSignUp,
  formData,
  user,
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

  if (!user) {
    return <p>Loading no user</p>;
  }
  console.log(user);

  return (
    <div className="bg-gray-100">
      <nav className="container mx-auto flex justify-between items-center py-3">
        {/* profile section */}
        <div className="flex">
          {user && (
            <img
              className="h-12 w-12 rounded-full shadow-sm shadow-black/50 m-1"
              src={user.images[0] ?? ""}
              alt=""
            />
          )}

          <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center m-1 relative">
            <img src={envelopIcon} alt="envelopIcon" />
            <p className="absolute top-0 right-0 h-3 w-3 rounded-full bg-[#FE316E]"></p>
          </div>
        </div>

        <ProfileCompletion formData={user} />
        <div className="flex items-center">
          <a
            href="/dashboard"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] hover:bg-red-800"
          >
            הודעות
          </a>

          <a
            href="/Onboarding"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] hover:bg-red-800"
          >
            הפרופיל שלי
          </a>

          <a
            href="/adminStats"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] hover:bg-red-800"
          >
            AdminStats
          </a>

          {!authToken && !minimal && (
            <button
              disabled={showModal}
              onClick={handleClick}
              className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 hover:bg-gray-100"
            >
              Log In
            </button>
          )}

          {!authToken && minimal && (
            <button
              disabled={showModal}
              onClick={handleLogout}
              className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 hover:bg-gray-100"
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

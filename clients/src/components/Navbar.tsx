import colorLogo from "./imgs/color-logo-tinder.png";
import whiteLogo from "./imgs/tinder_logo_white.png";
import React, { FC } from "react";
import { useCookies } from "react-cookie";

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

  const [cookies, setCookie, removeCookie] = useCookies([
    "UserId",
    "AuthToken",
  ]);

  const handleLogout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    window.location.href = "/";
  };
  return (
    <div className="">
      <nav className="w-full flex justify-between z-[5] relative">
        <div className="w-[170px] m-2">
          <img
            className="w-full"
            src={minimal ? colorLogo : whiteLogo}
            alt="colorLogo"
          />
        </div>
        <div className="flex items-center">
          <a
            href="/dashboard"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#c73232] hover:bg-red-800"
          >
            Dashboard
          </a>

          <a
            href="/onboarding"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#c73232] hover:bg-red-800"
          >
            Onboarding
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

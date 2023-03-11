import { FC } from "react";
import { Link } from "react-router-dom";

import envelopIcon from "./imgs/envelopeIcon.svg";
import ProfileCompletion from "./ProfileCompletion";

interface NavbarProps {
  minimal: boolean;
  setShowModal: (show: boolean) => void;
  showModal: boolean;
  authToken?: string;
  setIsSignUp?: (show: boolean) => void;
  formData: any;
  user: any;
  removeCookie: any;
  cookies: any;
}

const Navbar: FC<NavbarProps> = ({
  minimal,
  setShowModal,
  showModal,
  authToken,
  setIsSignUp,
  formData,
  user,
  removeCookie,
  cookies,
}) => {
  const handleClick = () => {
    setShowModal(true);
    if (setIsSignUp) {
      setIsSignUp(false);
    }
  };

  const handleLogout = () => {
    removeCookie("UserId", cookies.UserId);
    removeCookie("AuthToken", cookies.AuthToken);
    window.location.href = "/";
  };

  return (
    <div className="bg-gray-100 ">
      <nav className="container mx-auto  py-3 w-full flex items-start justify-between">
        {/* profile section */}
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
                <p className="absolute top-0 right-0 h-3 w-3 rounded-full bg-[#FE316E]"></p>
              </div>
            </div>

            <ProfileCompletion formData={user} />
          </section>
        )}
        <div className="flex items-center">
          <Link
            to="/dashboard"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-red-800"
          >
            הודעות
          </Link>

          <Link
            to="/Onboarding"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-red-800"
          >
            הפרופיל שלי
          </Link>

          <Link
            to="/adminStats"
            className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-red-800"
          >
            AdminStats
          </Link>

          {!authToken && !minimal && (
            <button
              disabled={showModal}
              onClick={handleClick}
              className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
            >
              Log In
            </button>
          )}

          {!authToken && minimal && (
            <button
              disabled={showModal}
              onClick={handleLogout}
              className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
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

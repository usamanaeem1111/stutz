import { FC } from "react";
import { Link } from "react-router-dom";
import { RootState, useSelector } from "../store";

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
  // user: any;
  removeCookie: any;
  cookies: any;
}

const Navbar: FC<NavbarProps> = (props) => {

  // PROPS
  const {
    minimal,
    setShowModal,
    showModal,
    authToken,
    setIsSignUp,
    formData,
    // user,
    removeCookie,
    cookies,
  } = props;

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user)


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
        <div className="flex w-full justify-between items-center">
          <div className={`${user === null && "hidden"}`}>
            <Link
              to="/dashboard"
              className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
            >
              ????????????
            </Link>

            <Link
              to="/onboarding"
              className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
            >
              ?????????????? ??????
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
                ??????????
              </button>
            )}

            {!authToken && minimal && (
              <button
                disabled={showModal}
                onClick={handleLogout}
                className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
              >
                ??????????
              </button>
            )}
          </div>
        </div>

        <div className="w-[300px]">
          <img src={siteLogo} alt="siteLogo" />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

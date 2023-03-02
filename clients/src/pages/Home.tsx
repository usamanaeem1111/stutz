import React, { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import { useCookies } from "react-cookie";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies([
    "UserId",
    "AuthToken",
  ]);
  const authToken = cookies.AuthToken;

  const handleClick = () => {
    if (authToken) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setShowModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="overlay flex flex-col">
      <Navbar
        authToken={authToken}
        minimal={false}
        setShowModal={setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}
      />

      <div className="z-[10] relative">
        <h1 className="text-[72px] font-bold text-white my-4">Swipe Right</h1>
        <button
          className="text-white text-[15px] uppercase bg-gradient-to-br from-[#fe3072] to-[#ff5940] py-2 px-4 border-none rounded-[30px] font-semibold transition-all active:translate-y-[1px] hover:from-[#ff5940] hover:to-[#fe3072]"
          onClick={handleClick}
        >
          {authToken ? "SignOut" : "Create an accounsssss"}
        </button>

        {showModal && (
          <AuthModal setShowModal={setShowModal} isSignUp={isSignUp} />
        )}
      </div>
    </div>
  );
}

export default Home;

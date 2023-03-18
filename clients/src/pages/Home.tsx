import { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";

function Home({
  cookies,
  removeCookie,
  setCookie,
  setShowModal,
  showModal,
  setIsSignUp,
  isSignUp,
}: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (cookies.AuthToken) {
      setIsAuthenticated(true);
    }
  }, [cookies.AuthToken]);

  const handleClick = () => {
    if (isAuthenticated) {
      removeCookie("UserId", cookies.UserId);
      removeCookie("AuthToken", cookies.AuthToken);
      window.location.reload();
      return;
    }
    setShowModal(true);
    setIsSignUp(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="z-[10] relative flex-1">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-white/80 to-white  bg-clip-text text-transparent py-10">
          מה כבר יכול להיות
        </h1>
        <button
          className="text-white text-[15px] uppercase bg-gradient-to-br from-[#fe3072] to-[#9640ff] py-2 px-4 border-none rounded-[30px] font-semibold transition-all active:translate-y-[1px] hover:from-[#ff5940] hover:to-[#fe3072]"
          onClick={handleClick}
        >
          {isAuthenticated ? "התנתק" : "צור חשבון / התחברות"}
        </button>
        {showModal && !isAuthenticated && (
          <div
            className={`fixed top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-500 ${
              isAuthenticated
                ? "opacity-0 pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <AuthModal
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
                setShowModal={setShowModal}
                isSignUp={isSignUp}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

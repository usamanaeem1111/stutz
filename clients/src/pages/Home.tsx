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
        <h1 className="text-[72px] font-bold text-white my-4">Swipe Right</h1>
        <button
          className="text-white text-[15px] uppercase bg-gradient-to-br from-[#fe3072] to-[#ff5940] py-2 px-4 border-none rounded-[30px] font-semibold transition-all active:translate-y-[1px] hover:from-[#ff5940] hover:to-[#fe3072]"
          onClick={handleClick}
        >
          {isAuthenticated ? "Sign Out" : "Create an Account/Login"}
        </button>

        {showModal && !isAuthenticated && (
          <AuthModal
            cookies={cookies}
            removeCookie={removeCookie}
            setCookie={setCookie}
            setShowModal={setShowModal}
            isSignUp={isSignUp}
          />
        )}
      </div>
    </div>
  );
}

export default Home;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import jwt_decode from "jwt-decode";
interface AuthModalProps {
  setShowModal: (show: boolean) => void;
  isSignUp: boolean;
  cookies: any;
  removeCookie: any;
  setCookie: any;
}

const AuthModal: React.FC<AuthModalProps> = ({
  setShowModal,
  isSignUp,
  cookies,
  removeCookie,
  setCookie,
}) => {
  // const user = useSelector((state: RootState) => state.user.user)

  const [email, setEmail] = useState<String | null>(null);
  const [password, setPassword] = useState<String | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<String | null>(null);
  const [error, setError] = useState<String | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let navigate = useNavigate();

  const handleCallBackResponse = async (res: any) => {
    if (!cookies.AuthToken) {
      const authToken = res.credential;

      var userObject: any = jwt_decode(authToken);
      let email = userObject.email;

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/googleSignUp`,
        {
          email,
          authToken,
        }
      );

      setCookie("AuthToken", authToken);
      setCookie("UserId", userObject.sub);

      const success = response.status === 200 || response.status === 201;
      if (success) navigate("./myprofile");
      return;
    } else {
      console.log("there is auth token");
    }
  };
  /*@ts-ignore*/

  useEffect(() => {
    /*@ts-ignore*/
    if (typeof google !== "undefined") {
      /*@ts-ignore*/
      google.accounts.id.initialize({
        client_id:
          "326344074758-gkj1lu05vgbkmok35j28em9gkch6f7m0.apps.googleusercontent.com",
        callback: handleCallBackResponse,
      });
      /*@ts-ignore*/
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
    } else {
      console.log("Google is undefined,refreshing the page...");
      window.location.reload();
    }
  }, []);

  const handleClick = () => {
    setShowModal(false);
  };
  useEffect(() => {}, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords need to match!");
        return;
      }

      // Password validation check
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(String(password))) {
        setError(
          "Password must be at least 8 characters long and include both letters and numbers."
        );
        return;
      }

      // Set submitting state to true to disable the submit button
      setIsSubmitting(true);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/${
          isSignUp ? "signup" : "login"
        }`,
        {
          email,
          password,
        }
      );

      const success = response.status === 201;
      const authToken = response.data.token;
      const userId = response.data.userId;

      setCookie("UserId", userId);
      setCookie("AuthToken", authToken);

      if (success && isSignUp) navigate("./myprofile");
      if (success && !isSignUp) navigate("./Dashboard");
      // window.location.reload();
      setIsLoading(false);
      return;
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError(
          "Sorry, this email address is already registered. Please log in instead or use a different email address to sign up"
        );
      }

      if (err.response && err.response.status === 400) {
        setError("Invalid Credentials");
      } else {
        console.log(err);
      }
      setIsLoading(false);
    } finally {
      // Set submitting state to false to enable the submit button
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed md:top-[240px] md:max-w-[350px] mx-auto h-fit top-[35%]  left-0 md:right-0 md:bottom-0 w-full bg-gradient-to-br from-white/0 to-gray-500 backdrop-blur-[7px] rounded-[10px] px-4 py-[20px] cursor-pointer shadow-md">
      <div className="" onClick={handleClick}>
        <p className=" border-2 border-gray-300 font-semibold rounded-full w-[25px] h-[25px] float-right text-gray-300 text-[14px] hover:shadow-lg transition-all translate-y-[1px]">
          X
        </p>
      </div>
      <h2 className="text-[24px] font-semibold text-gray-300">
        {isSignUp ? "צור חשבון" : "כניסה למשתמש קיים"}
      </h2>{" "}
      <form className="flex flex-col" onSubmit={handleSubmit} action="">
        <input
          className="border border-black/20 my-2 p-2 rounded-md text-right outline-none "
          type="email"
          id="email"
          name="email"
          placeholder="אימייל"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-black/20 my-2 p-2 rounded-md text-right outline-none"
          type="password"
          id="password"
          name="password"
          placeholder="סיסמה"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignUp && (
          <input
            className="border border-black/20 my-2 p-2 rounded-md text-right outline-none"
            type="password"
            id="password-check"
            name="password-check"
            placeholder="אימות סיסמה"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input
          className="bg-gradient-to-br from-[#fe3072] to-[#9640ff] hover:from-[#fe316e] hover:to-[#fe316e] text-gray-100 font-semibold px-4 py-2 rounded-md transition-colors cursor-pointer"
          type="submit"
          disabled={isSubmitting}
          value="התחבר"
        />
        {error && <p className="text-red-500 py-2">{error}</p>}
      </form>
      <hr className="my-5 text-gray-300 " />
      <h2 className="text-gray-300">Google כניסה בעזרת </h2>
      <div className="flex items-center justify-center mt-3">
        <div id="signInDiv"></div>
      </div>
      {isLoading && <p className="text-black">טוען...</p>}
    </div>
  );
};

export default AuthModal;

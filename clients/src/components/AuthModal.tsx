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
        `https://api.stutz.co.il/googleSignUp`,
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
        `https://api.stutz.co.il/${isSignUp ? "signup" : "login"}`,
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
    <div className="fixed top-[20%] md:max-w-[350px] mx-auto h-fit md:left-0 md:right-0 md:bottom-0 w-full   bg-white rounded-[10px] px-4 py-[20px] ">
      <div className=" cursor-pointer" onClick={handleClick}>
        <p className=" border border-[black] rounded-full w-[25px] h-[25px] float-right">
          X
        </p>
      </div>
      <h2 className="text-[42px]">
        {isSignUp ? "צור חשבון" : "כניסה למשתמש קיים"}
      </h2>{" "}
      <form className="flex flex-col" onSubmit={handleSubmit} action="">
        <input
          className="border border-black/20 my-2 p-2 rounded-md text-right"
          type="email"
          id="email"
          name="email"
          placeholder="אימייל"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-black/20 my-2 p-2 rounded-md text-right"
          type="password"
          id="password"
          name="password"
          placeholder="סיסמה"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignUp && (
          <input
            className="border border-black/20 my-2 p-2 rounded-md text-right"
            type="password"
            id="password-check"
            name="password-check"
            placeholder="אימות סיסמה"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input
          className="text-gray-700 bg-white font-bold uppercase py-2 px-4 rounded-[30px] m-1 border cursor-pointer border-gray-300 hover:text-gray-900 hover:border-gray-500 active:translate-y-[1px]"
          type="submit"
          disabled={isSubmitting}
          value="התחבר"
        />
        <p className="text-red-500 py-2">{error}</p>
      </form>
      <hr className="my-5" />
      <h2>כניסה עם Google</h2>
      <div className="flex items-center justify-center mt-3">
        <div id="signInDiv"></div>
      </div>
      {isLoading && <p className="text-black">טוען...</p>}
    </div>
  );
};

export default AuthModal;

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OnBoarding from "./pages/OnBoarding";
import { useCookies } from "react-cookie";
import AdminStats from "./pages/AdminStats";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies([
    "AuthToken",
    "UserId",
  ]);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [authToken, setAuthToken] = useState("dummyToken");

  useEffect(() => {
    const authTokenCookie = cookies.AuthToken;
    setAuthToken(authTokenCookie);
  }, [cookies.AuthToken]);

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("https://api.stutz.co.il/user", {
        params: { userId },
      });
      setUser(response.data);
      setUserDataLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [cookies]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            userDataLoaded && (
              <Home
                user={user}
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            )
          }
        />
        <Route
          path={"/AdminStats"}
          element={
            userDataLoaded && (
              <AdminStats
                user={user}
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            )
          }
        />
        {authToken !== "dummyToken" && (
          <Route
            path={"/Dashboard"}
            element={
              userDataLoaded && (
                <Dashboard
                  user={user}
                  cookies={cookies}
                  removeCookie={removeCookie}
                  setCookie={setCookie}
                />
              )
            }
          />
        )}
        {authToken !== "dummyToken" && (
          <Route
            path={"/Onboarding"}
            element={
              userDataLoaded && (
                <OnBoarding
                  user={user}
                  cookies={cookies}
                  removeCookie={removeCookie}
                  setCookie={setCookie}
                />
              )
            }
          />
        )}
        This way, the authToken state variable is updated with the value of the
        AuthToken cookie once it is set in the handleSubmit function. The routes
        that require authentication are then conditionally rendered based on
        whether the authToken state variable is still a dummy token or not.
      </Routes>
    </BrowserRouter>
  );
};

export default App;

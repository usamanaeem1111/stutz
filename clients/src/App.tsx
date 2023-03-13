import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OnBoarding from "./pages/OnBoarding";
import { useCookies } from "react-cookie";
import AdminStats from "./pages/AdminStats";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "./store/reducers/user/user.reducer";
import { RootState } from "./store";
const App = () => {
  // TOOLS
  const dispatch = useDispatch();

  // STATE
  // const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies([
    "AuthToken",
    "UserId",
  ]);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [authToken, setAuthToken] = useState("dummyToken");

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user);

  // console.log("user from selectors", user);

  useEffect(() => {
    const authTokenCookie = cookies.AuthToken;
    setAuthToken(authTokenCookie);
  }, [cookies.AuthToken]);

  const userId = cookies.UserId;

  const fetchUser = async () => {
    try {
      const response = await axios.get("https://api.stutz.co.il/user", {
        params: { userId },
      });
      const _user = response.data;
      dispatch(userActions.setUser({ value: _user }));
      // setUser(response.data);
      setUserDataLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [cookies]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            userDataLoaded && (
              <Home
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
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            )
          }
        />

        <Route
          path={`${user === null ? "/" : "/dashboard"}`}
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

        <Route
          path={`${user === null ? "/" : "/Onboarding"}`}
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;

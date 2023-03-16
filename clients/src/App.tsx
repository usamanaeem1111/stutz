import React, { useEffect, useCallback } from "react";
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

  // PROPS
  const [cookies, setCookie, removeCookie] = useCookies([
    "AuthToken",
    "UserId",
  ]);

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user);
  const userId = cookies.UserId;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get("https://api.stutz.co.il/user", {
        params: { userId },
      });
      const _user = response.data;
      dispatch(userActions.setUser({ value: _user }));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    // Only fetch user data if the userId has changed
    if (userId) {
      fetchUser();
    }
  }, [fetchUser, userId]);

  return (
    <div className="background-image">
      <BrowserRouter>
        <Routes>
          <Route
            path={"/"}
            element={
              <Home
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            }
          />
          <Route
            path={"/AdminStats"}
            element={
              <AdminStats
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            }
          />

          <Route
            path={`${user === null ? "/" : "/dashboard"}`}
            element={
              <Dashboard
                user={user}
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            }
          />

          <Route
            path={`${user === null ? "/" : "/Onboarding"}`}
            element={
              <OnBoarding
                user={user}
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

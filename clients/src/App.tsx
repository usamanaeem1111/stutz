import React, { useEffect, useCallback, useState } from "react";
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
import Navbar from "./components/Navbar";
import NavigationLinks from "./components/NavigationLinks";

const App = () => {
  // TOOLS
  const dispatch = useDispatch();
  // Counter variable
  const [counter, setCounter] = useState(0);

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
      setCounter((prevCounter) => prevCounter + 1);
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
    <div className="background-image ">
      <BrowserRouter>
        <Navbar
          formData={user}
          minimal={true}
          setShowModal={() => {}}
          showModal={false}
          removeCookie={removeCookie}
          cookies={cookies}
        />
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
            path={`${user === null ? "/" : "/myprofile"}`}
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

        <div className="md:hidden sticky bottom-0 z-[999] flex items-center bg-white/50 backdrop-blur-[7px] md:backdrop-blur-[0px] md:bg-white/0 justify-between mt-3  md:min-w-[500px]">
          <NavigationLinks />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

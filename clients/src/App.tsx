import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OnBoarding from "./pages/OnBoarding";
import { useCookies } from "react-cookie";
import AdminStats from "./pages/AdminStats";
import axios from "axios";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "AuthToken",
    "UserId",
  ]);
  const authToken = cookies.AuthToken;
  const [user, setUser] = useState(null);

  const userId = cookies.UserId;
  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <Home
              user={user}
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
              user={user}
              cookies={cookies}
              removeCookie={removeCookie}
              setCookie={setCookie}
            />
          }
        />
        {authToken && (
          <Route
            path={"/Dashboard"}
            element={
              <Dashboard
                user={user}
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            }
          />
        )}
        {authToken && (
          <Route
            path={"/Onboarding"}
            element={
              <OnBoarding
                user={user}
                cookies={cookies}
                removeCookie={removeCookie}
                setCookie={setCookie}
              />
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

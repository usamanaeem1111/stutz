import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OnBoarding from "./pages/OnBoarding";
import { useCookies } from "react-cookie";
import AdminStats from "./pages/AdminStats";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["AuthToken"]);

  const authToken = cookies.AuthToken;

  console.log(authToken);
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/AdminStats"} element={<AdminStats />} />
        {authToken && <Route path={"/Dashboard"} element={<Dashboard />} />}
        {authToken && <Route path={"/Onboarding"} element={<OnBoarding />} />}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

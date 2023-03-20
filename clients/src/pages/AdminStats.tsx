import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios, { AxiosResponse } from "axios";
import { RootState, useSelector } from "../store";
import NavigationLinks from "../components/NavigationLinks";

type StatsData = {
  mostPopularMan: object;
  about: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  gender_identity: string;
  gender_interest: string;
  images: string[];
  likes: object[];
  matches: object[];
  show_gender: boolean;
  signUpDate: string;
  url: string;
  user_id: string;
  _id: string;
};

type AdminStatsProps = {
  cookies: any;
  removeCookie: any;
  setCookie: any;
};

const AdminStats: React.FC<AdminStatsProps> = ({
  cookies,
  removeCookie,
  setCookie,
}) => {
  // SELECTORS
  // const user = useSelector((state: RootState) => state.user.user)

  const [stats, setStats] = useState<StatsData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<StatsData> = await axios.get<StatsData>(
          `${process.env.BASE_URL}/adminStats`
        );
        setStats(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  console.log(stats);

  return (
    <div className=" text-white flex flex-col justify-end ">
      {Object.entries(stats).map(([fieldKey, fieldValue]: any) => (
        <div key={fieldKey} className="bg-red-500 p-2 m-1">
          <p>name: {fieldValue["first_name"]}</p>
          <p>Email: {fieldValue["email"]}</p>
          <p>NUmber of matches: {fieldValue["matches"].length}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;

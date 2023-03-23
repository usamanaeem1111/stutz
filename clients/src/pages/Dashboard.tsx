import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { RootState, useSelector } from "../store";
import Swipe from "../components/Swipe";
import io from "socket.io-client";

const Dashboard = ({ cookies, removeCookie, setCookie }: any) => {
  const [genderedUsers, setGenderedUsers] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user);

  const getGenderedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/gendered-users`,
        {
          params: { gender: user?.gender_interest },
        }
      );
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loader"></div>
      ) : (
        user && (
          <div className="dashboard flex justify-between">
            <ChatContainer user={user} />
            {genderedUsers && <Swipe user={user} cardData={genderedUsers} />}
          </div>
        )
      )}
    </>
  );
};

export default Dashboard;

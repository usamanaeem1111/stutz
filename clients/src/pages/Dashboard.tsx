import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { RootState, useSelector } from "../store";
import Swipe from "../components/Swipe";
import io from "socket.io-client";
import CardDeck from "../components/CardDeck";

const Dashboard = ({ cookies, removeCookie, setCookie }: any) => {
  const [genderedUsers, setGenderedUsers] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(0);

  // update user to have new match
  const [hasNewMatch, setHasNewMatch] = useState(false);

  const socket = io(`${process.env.REACT_APP_BASE_URL}`);

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user);
  const userId = cookies.UserId;

  const getGenderedUsers = async () => {
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
    }
  };

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, []);

  return (
    <>
      {user && (
        <div className="dashboard flex justify-between ">
          <ChatContainer user={user} />
          {genderedUsers && <Swipe cardData={genderedUsers} />}

          {/* <CardDeck cards={genderedUsers} /> */}
        </div>
      )}
    </>
  );
};

export default Dashboard;

import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { RootState, useSelector } from "../store";
import Swipe from "../components/Swipe";

const Dashboard = ({ cookies, removeCookie, setCookie }: any) => {
  const [genderedUsers, setGenderedUsers] = useState<any>(null);

  const [selectedImage, setSelectedImage] = useState<number | null>(0);

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user);
  const userId = cookies.UserId;

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get(
        "https://api.stutz.co.il/gendered-users",
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
  }, [user]);

  const updateMatches = async (matchedUserId: any) => {
    try {
      await axios.put("https://api.stutz.co.il/addmatch", {
        userId,
        matchedUserId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const swiped = (direction: any, swipedUserId: any) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
  };

  const outOfFrame = (name: any) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches?.map(({ user_id }: any) => user_id) ?? [
    userId,
  ];

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser: any) => !matchedUserIds.includes(genderedUser.user_id)
  );

  return (
    <>
      {user && (
        <div className="dashboard flex justify-between ">
          {/* <ChatContainer user={user} /> */}
          <Swipe
            filteredGenderedUsers={filteredGenderedUsers}
            swiped={swiped}
            outOfFrame={outOfFrame}
          />
        </div>
      )}
    </>
  );
};

export default Dashboard;

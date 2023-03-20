import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { RootState, useSelector } from "../store";
import Swipe from "../components/Swipe";
import io from "socket.io-client";

const Dashboard = ({ cookies, removeCookie, setCookie }: any) => {
  const [genderedUsers, setGenderedUsers] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(0);

  // update user to have new match
  const [hasNewMatch, setHasNewMatch] = useState(false);

  const socket = io("https://api.stutz.co.il");

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
    const matchId = `${userId}-${matchedUserId}`;
    console.log("matchId", matchId);

    try {
      // Check if the match already exists in the database
      const response = await axios.get(
        `https://api.stutz.co.il/matches/${matchId}`
      );

      if (response.data) {
        // Match already exists, do not update the database
        return;
      }

      // Insert a new match into the "matches" collection
      const insertResponse = await axios.post(
        "https://api.stutz.co.il/matches",
        {
          matchId,
          user1Id: userId,
          user2Id: matchedUserId,
          createdAt: new Date(),
        }
      );

      // If the response indicates a new match, notify both users via WebSocket
      if (insertResponse.data.newMatch) {
        socket.emit("new_match", {
          matchId,
          user1Id: userId,
          user2Id: matchedUserId,
        });
      }
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

  socket.on("new_match", (match) => {
    setHasNewMatch(true);
  });

  return (
    <>
      {user && (
        <div className="dashboard flex justify-between ">
          <div className="bg-green-500">
            {hasNewMatch && (
              <div className="bg-red-500">You have a new match!</div>
            )}
            <h1>Dashboard</h1>
          </div>
          <ChatContainer user={user} />
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

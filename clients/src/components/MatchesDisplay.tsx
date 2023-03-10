import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { io, Socket } from "socket.io-client";

interface User {
  user_id: string;
  images: string[];
  first_name: string;
  unread_msg?: number;
}

interface Props {
  matches: { user_id: string }[];
  setClickedUser: any;
}

const socket: Socket = io("http://localhost:8000");

const MatchesDisplay = ({ matches, setClickedUser }: Props) => {
  const [matchedProfiles, setMatchedProfiles] = useState<User[] | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies<any>(["UserId"]);

  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const userId = cookies.UserId;

  const getMatches = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:8000/users", {
        params: { userIds: JSON.stringify(matchedUserIds) },
      });
      setMatchedProfiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatches();
  }, [matches]);

  useEffect(() => {
    // Listen for incoming messages
    const handleIncomingMessage = (data: any) => {
      if (
        data.to_userId === userId &&
        matchedUserIds.includes(data.from_userId)
      ) {
        // Increment the unread message count by 1 for the profile that received the new message
        setMatchedProfiles((prevProfiles) => {
          if (prevProfiles) {
            return prevProfiles.map((profile) => {
              if (profile.user_id === data.from_userId) {
                return {
                  ...profile,
                  unread_msg: (profile.unread_msg ?? 0) + 1, // Increment the unread message count by 1
                };
              }
              return profile;
            });
          }
          return prevProfiles;
        });
      }
    };

    socket.on("recive_msg", handleIncomingMessage);

    // Remove the event listener when the component unmounts
    return () => {
      socket.off("recive_msg", handleIncomingMessage);
    };
  }, [socket, userId, matchedUserIds]);

  return (
    <div className="matches-display ">
      {matchedProfiles && <p>No matches yet</p>}
      {matchedProfiles?.map((match, index) => (
        <div
          key={index}
          className="match-card"
          onClick={() => setClickedUser(match)}
        >
          <div className=" img-containerm-1 p-2 mx-auto border-b cursor-pointer hover:bg-black/10">
            <div className="w-[250px]  flex items-center justify-between">
              <img
                className="rounded-full w-[50px] h-[50px]"
                src={match.images[0] ?? ""}
                alt={match?.first_name + " profile"}
              />
              <h3 className="w-[150px]">{match?.first_name}</h3>
              {match.unread_msg && (
                <span className="bg-red-500 text-white text-center p-1 rounded-lg">
                  {match.unread_msg} New Message!
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;

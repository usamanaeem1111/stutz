import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { RootState, useSelector } from "../store";

interface User {
  user_id: string;
  images: string[];
  first_name: string;
}

interface Props {
  matches: { user_id: string }[];
  setClickedUser: any;
}

const MatchesDisplay = ({ matches, setClickedUser }: Props) => {
  const [matchedProfiles, setMatchedProfiles] = useState<User[] | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies<any>(["UserId"]);

  const matchedUserIds = matches.map(({ user_id }) => user_id);
  const userId = cookies.UserId;

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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesDisplay;

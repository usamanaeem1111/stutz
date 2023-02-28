import ChatHeader from "./ChatHeader";
import MatchesDisplay from "./MatchesDisplay";
import ChatDisplay from "./ChatDisplay";
import { useState } from "react";

const ChatContainer = ({ user }: any) => {
  const [clickedUser, setClickedUser] = useState(null);

  return (
    <div className="chat-container bg-[rgb(255, 255, 255)] shadow-md w-[30%] text-left z-[1]">
      <ChatHeader user={user} />

      <div>
        <button
          className="option border-b-2 border-[rgb(243,33,33)] text-[20px] m-1 p-2 bg-[rgb(255, 255, 255)] "
          onClick={() => setClickedUser(null)}
        >
          Matches
        </button>
        <button
          className="option border-b-2 border-[rgb(243,33,33)] text-[20px] m-1 p-2 bg-[rgb(255, 255, 255)] disabled:border-[#bbbbbb]"
          disabled={!clickedUser}
        >
          Chat
        </button>
      </div>

      {!clickedUser && (
        <MatchesDisplay
          matches={user.matches}
          setClickedUser={setClickedUser}
        />
      )}

      {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser} />}
    </div>
  );
};

export default ChatContainer;

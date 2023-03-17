import { FC } from "react";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

interface UserActionsProps {
  authToken: any;
  minimal: boolean;
  showModal: boolean;
  handleClick: () => void;
  handleLogout: () => void;
  user: any;
}

const UserActions: FC<UserActionsProps> = ({
  authToken,
  minimal,
  showModal,
  handleClick,
  handleLogout,
  user,
}) => {
  console.log("authToken", authToken);
  return (
    <div className="mr-3">
      {authToken || user ? (
        <button
          disabled={showModal}
          onClick={handleLogout}
          className="flex items-center justify-center text-[#FE316E] bg-white p-3 font-semibold rounded-md m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
        >
          <FaSignOutAlt className="mr-2" /> התנתק
        </button>
      ) : (
        <button
          disabled={showModal}
          onClick={handleClick}
          className="flex items-center justify-center text-[#FE316E] bg-white p-3 font-semibold rounded-md m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
        >
          <FaSignInAlt className="mr-2" /> התחבר
        </button>
      )}
    </div>
  );
};

export default UserActions;

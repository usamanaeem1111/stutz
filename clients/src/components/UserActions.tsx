import { FC } from "react";
import { FaSignInAlt, FaSignOutAlt, FaCog } from "react-icons/fa";

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
  return (
    <div className="mr-3">
      {authToken || user ? (
        <div className="flex items-center">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-gray-400">
            <img
              className="h-full w-full object-cover"
              src={user.images[0]}
              alt="user.images"
            />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-medium text-gray-800">{user.name}</h2>
            <div className="flex space-x-4 mt-2">
              <button
                disabled={showModal}
                onClick={handleLogout}
                className="flex items-center justify-center text-white bg-red-500 p-2 rounded-md font-semibold hover:bg-red-600 disabled:bg-black/50 disabled:text-gray-400"
              >
                <FaSignOutAlt className="mr-2" /> התנתק
              </button>
            </div>
          </div>
        </div>
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

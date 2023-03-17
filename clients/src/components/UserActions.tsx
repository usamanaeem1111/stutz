import { FC } from "react";

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
          className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
        >
          התנתק
        </button>
      ) : (
        <button
          disabled={showModal}
          onClick={handleClick}
          className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
        >
          התחבר
        </button>
      )}
    </div>
  );
};

export default UserActions;

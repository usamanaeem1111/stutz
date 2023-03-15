import { FC } from "react";

interface UserActionsProps {
  authToken: string | undefined;
  minimal: boolean;
  showModal: boolean;
  handleClick: () => void;
  handleLogout: () => void;
}

const UserActions: FC<UserActionsProps> = ({
  authToken,
  minimal,
  showModal,
  handleClick,
  handleLogout,
}) => {
  return (
    <div className="mr-3">
      {!authToken && !minimal && (
        <button
          disabled={showModal}
          onClick={handleClick}
          className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
        >
          התחבר
        </button>
      )}

      {!authToken && minimal && (
        <button
          disabled={showModal}
          onClick={handleLogout}
          className="text-red-500 bg-white p-3 font-semibold rounded-xl m-2 disabled:bg-black/50 min-w-[100px] hover:bg-gray-100"
        >
          התנתק
        </button>
      )}
    </div>
  );
};

export default UserActions;

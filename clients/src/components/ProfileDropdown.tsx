import { FC, useState } from "react";
import MessageDropdown from "./MessageDropdown";
import NavigationLinks from "./NavigationLinks";
import UserActions from "./UserActions";

interface ProfileDropdownProps {
  userImages?: string[];
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({ userImages }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative md:hidden">
      <div className="w-10 h-10 mr-4 cursor-pointer" onClick={toggleDropdown}>
        {userImages?.[0] ? (
          <img
            className="w-full h-full rounded-full object-cover"
            src={userImages[0]}
            alt=""
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-400"></div>
        )}
      </div>

      <div
        className={`absolute bg-white rounded-lg shadow-md overflow-hidden z-10 transition duration-300 transform ${
          isDropdownOpen ? "scale-100" : "scale-0"
        }`}
      >
        <NavigationLinks />
      </div>
    </div>
  );
};

export default ProfileDropdown;

import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationLinksProps {}

const NavigationLinks: FC<NavigationLinksProps> = ({}) => {
  const location = useLocation();

  const linkClasses =
    "px-3 py-2 hover:text-black text-gray-500 rounded-md font-medium transition-colors duration-200 w-[150px]";

  const activeLinkClasses = "border-b-4 border-[#fe316e] text-black";

  return (
    <div className="flex-col md:flex-row flex space-x-4 items-center justify-between mx-[20px]">
      <Link
        to="/dashboard"
        className={`${linkClasses} ${
          location.pathname === "/dashboard" ? activeLinkClasses : ""
        }`}
      >
        הודעות
      </Link>

      <Link
        to="/onboarding"
        className={`${linkClasses} ${
          location.pathname === "/onboarding" ? activeLinkClasses : ""
        }`}
      >
        הפרופיל שלי
      </Link>

      <Link
        to="/adminStats"
        className={`${linkClasses} ${
          location.pathname === "/adminStats" ? activeLinkClasses : ""
        }`}
      >
        AdminStats
      </Link>
    </div>
  );
};

export default NavigationLinks;

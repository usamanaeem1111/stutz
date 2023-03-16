import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavigationLinksProps {}

const NavigationLinks: FC<NavigationLinksProps> = ({}) => {
  const location = useLocation();

  const linkClasses =
    "px-3 py-2 hover:text-black text-gray-500 rounded-md font-medium transition-colors duration-200";

  const activeLinkClasses = "border-b-4 border-[#fe316e] text-black";

  return (
    <nav className="flex space-x-4 ">
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
    </nav>
  );
};

export default NavigationLinks;

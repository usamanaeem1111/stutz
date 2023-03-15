import { FC } from "react";
import { Link } from "react-router-dom";

interface NavigationLinksProps {
  numUnreadMessages: number;
}

const NavigationLinks: FC<NavigationLinksProps> = ({ numUnreadMessages }) => {
  return (
    <div>
      <Link
        to="/dashboard"
        className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
      >
        הודעות{numUnreadMessages > 0 ? ` (${numUnreadMessages})` : ""}
      </Link>

      <Link
        to="/onboarding"
        className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
      >
        הפרופיל שלי
      </Link>

      <Link
        to="/adminStats"
        className="mx-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-[#FE316E] min-w-[100px] hover:bg-[#ff5b95] transition-all active:translate-y-[1px]"
      >
        AdminStats
      </Link>
    </div>
  );
};

export default NavigationLinks;

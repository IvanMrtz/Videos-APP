import Search from "./Search";
import "../styles/TopNavBar.css";
import ProfileImage from "./ProfileImage";
import Logo from "./Logo";
import userContext from "../context/user-context";
import { useContext } from "react";

export default function (props) {
  const { setSideMenu, videos, setVideos } = props;
  const { userData } = useContext(userContext);
  const { photoURL } = userData;

  return (
    <div className="Top-Nav-Bar">
      <Logo />
      <Search setVideos={setVideos} />
      <ProfileImage
        action={setSideMenu}
        width="50"
        image={photoURL}
        alt="Profile Image"
      />
    </div>
  );
}

import Search from "./Search";
import "../styles/TopNavBar.css";
import ProfileImage from "./ProfileImage";
import Logo from "./Logo";
import userContext from "../context/user-context";
import { useContext } from "react";
import Notifications from "./Notifications";

export default function (props) {
  const { setSideMenu, videos, setVideos } = props;
  const { userData } = useContext(userContext);
  const { photoURL } = userData;

  return (
    <div className="Top-Nav-Bar">
      <Logo />
      <Search setVideos={setVideos} videos = {videos} />
      <Notifications />
      <ProfileImage
        action={setSideMenu}
        width="50"
        image={photoURL}
        alt="Profile Image"
      />
    </div>
  );
}

import ProfileImage from "./ProfileImage";
import "../styles/Friends.css";
import useFriend from "../hooks/useFriend";
import { useContext } from "react";
import userContext from "../context/user-context";

export function Friend(props) {
  const { name, photo, isOnline } = props;

  return (
    <div className="Friend-Container">
      <ProfileImage width="50%" image={photo} alt="Friend" />

      <div
        style={{
          borderRadius: "50%",
          background: isOnline ? "green" : "red",
          width: "7px",
          height: "7px",
        }}
      ></div>
    </div>
  );
}

export default function () {
  const { currentUser: user } = useContext(userContext);
  const { friends } = useFriend({ user });

  return (
    <div className="Friends-Container ">
      {friends ? friends.map((friend) => {
        return <Friend key={friend.id} {...friend} />;
      }) : null}
    </div>
  );
}

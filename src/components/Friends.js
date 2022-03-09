import ProfileImage from "./ProfileImage";
import "../styles/Friends.css";
import useFriend from "../hooks/useFriend";
import { useContext } from "react";
import userContext from "../context/user-context";
import { useHistory } from "react-router";

export function Friend(props) {
  const { displayName, photoURL, userUID, isOnline, style } = props;
  const history = useHistory();

  return (
    <div className="Friend-Container" style={style}>
      <ProfileImage
        width="40px"
        image={photoURL}
        action={() => {
          history.push("/profile/" + userUID);
        }}
        alt="Friend"
      />
      <p className="grey">{displayName}</p>
      <div
        style={{
          borderRadius: "50%",
          background: isOnline ? "green" : "red",
          width: "7px",
          height: "7px",
        }}
      ></div>
      {/* <div className="Friend-Functionality">{add}</div> */}
    </div>
  );
}

export function Friends(props) {
  const { style, children } = props;
  const { currentUser } = useContext(userContext);
  const { friends } = useFriend({ user: currentUser.uid });
  if(!(friends?.users.length)) return null;
  return friends
    ? friends.users.map((friend) => {
        return (
          <div className="Friend">
            <Friend add={children} style={style} key={friend.id} {...friend} />
            <hr className="line-friend" />
          </div>
        );
      })
    : null;
}

export default function () {
  return (
    <div className="Friends-Container ">
      <Friends />
    </div>
  );
}

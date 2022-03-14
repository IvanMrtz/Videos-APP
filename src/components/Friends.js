import ProfileImage from "./ProfileImage";
import "../styles/Friends.css";
import useFriend from "../hooks/useFriend";
import { useContext, useEffect } from "react";
import userContext from "../context/user-context";
import { useHistory } from "react-router";
import Media from "./MediaQuery";
import { firestore } from "../firebase/config";
import { forwardRef, useState } from "react";
import { useUpdatedUser } from "../hooks/useUser";

export function Friend(props) {
  const { displayName, photoURL, userUID, isOnline, match } = props;
  const history = useHistory();
  const styleFriendContainer = {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "150px",
  };

  const styleIsOnline = {
    borderRadius: "50%",
    background: isOnline ? "green" : "red",
    width: "7px",
    height: "7px",
  };
  return (
    <div
      style={
        match
          ? styleFriendContainer
          : { ...styleFriendContainer, width: "75px", position: "relative" }
      }
    >
      <ProfileImage
        width="40px"
        image={photoURL}
        action={() => {
          history.push("/profile/" + userUID);
        }}
        alt="Friend"
      />
      {!match ? null : <p className="grey">{displayName}</p>}
      <div
        style={
          match
            ? styleIsOnline
            : {
                ...styleIsOnline,
                width: "10px",
                height: "10px",
                position: "absolute",
                bottom: "3px",
                right: "18px",
              }
        }
      ></div>
      {/* <div className="Friend-Functionality">{add}</div> */}
    </div>
  );
}

export function Friends(props) {
  const { children, match } = props;
  const { currentUser } = useContext(userContext);
  const user = currentUser.uid;
  const { getUser, getUserObserver } = useUpdatedUser();
  const { friends } = useFriend({ user });
  const [updatedFriend, setUpdatedFriend] = useState();

  useEffect(() => {
    if (friends?.users) {
      let updated = [];
      const unsubscribeUsers = firestore
        .collection("users")
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            const changeDocID = change.doc.id;
            const changedData = change.doc.data();
            if (change.type === "added") {
              // alert("added")
              if (friends.users.includes(changeDocID)) {
                updated.push({ ...changedData, userUID: changeDocID });
              }
            }
            console.log(updated)

            if (change.type === "modified") {
              // alert("modified")
              if (friends.users.includes(changeDocID)) {
                updated = updated.map((friend) => {
                  if (friend.userUID === changeDocID) {
                    return { ...changedData, userUID: changeDocID };
                  }
                  return friend;
                });
              }
            }

            if (change.type === "removed") {
              if (friends.users.includes(changeDocID)) {
                updated = updated.filter((friend) => {
                  return friend.userUID !== changeDocID;
                });
                firestore
                  .collection("users")
                  .doc(currentUser.uid)
                  .collection("friends")
                  .doc(changeDocID)
                  .delete();
              }
            }
          });

          setUpdatedFriend({ count: updated.length, users: updated });
        });

      return unsubscribeUsers;
    }
  }, [friends]);

  if (!updatedFriend?.users.length) return null;
  return updatedFriend
    ? updatedFriend?.users.map((friend) => {
        return (
          <div className="Friend">
            <Friend match={match} add={children} key={friend.id} {...friend} />
            <hr className="line-friend" />
          </div>
        );
      })
    : null;
}
export default forwardRef((props, ref) => {
  return (
    <Media
      query="(min-width: 850px)"
      render={(match) => {
        const styleFriendsContainer = {
          display: "flex",
          flexDirection: "column",
          width: "230px",
          height: "100%",
          background: "var(--color-grey-background)",
          borderRadius: "15px",
          alignItems: "center",
          transition: "all 0.5s",
        };
        function changeStyles(apply, match) {
          if (!match) apply();
        }
        changeStyles(() => {
          styleFriendsContainer.width = "100%";
          styleFriendsContainer.height = "60px";
          styleFriendsContainer.left = "0";
          styleFriendsContainer.position = "fixed";
          styleFriendsContainer.borderRadius = "20px 20px 0 0";
          styleFriendsContainer.bottom = "0";
          styleFriendsContainer.boxShadow = "0px 0px 55px 55px #00000033";
          styleFriendsContainer.alignItems = "";
          styleFriendsContainer.flexDirection = "row";
        }, match);
        return (
          <div
            ref={ref}
            className="Friends-Container"
            style={styleFriendsContainer}
          >
            <Friends match={match} />
          </div>
        );
      }}
    />
  );
});

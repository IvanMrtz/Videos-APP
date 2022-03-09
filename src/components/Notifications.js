import React, { useContext, useRef } from "react";
import userContext from "../context/user-context";
import useFriend from "../hooks/useFriend";
import Options, { Option } from "./Options";
import { Icon } from "@iconify/react";
import "../styles/Notifications.css";
import ProfileImage from "./ProfileImage";
import firebase from "firebase";

export function Notification(props) {
  const {
    photoURL,
    displayName,
    userUID,
    acceptFriendRequest,
    rejectFriendRequest,
  } = props;

  return (
    <>
      <Option>
        <div className="Notification">
          <div>
            <ProfileImage
              width="45px"
              height="45px"
              image={props.photoURL}
              alt="Profile Image"
            />
          </div>
          <div className="Notification-Body">
            <p className="linked">{props.displayName}</p>
            <p className="Notification-Type">Friend Request</p>
          </div>

          <div className="Notification-Manage">
            <Icon
              color="var(--color-green)"
              onClick={() =>
                acceptFriendRequest({ photoURL, displayName, userUID })
              }
              icon="akar-icons:check"
            />
            <Icon
              color="var(--color-red)"
              onClick={() => {
                rejectFriendRequest({ photoURL, displayName, userUID });
              }}
              icon="eva:close-outline"
            />
          </div>
        </div>
      </Option>
      <hr className="Notification-Line" />
    </>
  );
}

export default function Notifications() {
  const { currentUser } = useContext(userContext);
  const { friendRequests, acceptFriendRequest, rejectFriendRequest } =
    useFriend({
      user: currentUser.uid,
    });
  const activator = useRef();

  return (
    <div className="Notifications">
      <Icon
        width="22px"
        color="var(--color-grey)"
        icon="clarity:notification-line"
        ref={activator}
        className="Notification-Icon"
      />
      {friendRequests.users && friendRequests.count ? (
        <Options
          activator={activator}
          style={{
            width: "250px",
            right: "10px",
            top: "10px",
            height: "400px",
            background: "var(--color-grey-background-lower)",
            boxShadow: "rgba(0, 0, 0, 1) 5px 7px 15px",
          }}
        >
          <div className="Notification-Title">
            <p className="grey">Notifications</p>
            <p className="linked">{friendRequests.count}</p>
          </div>
          <hr className="line-semi-completed" />
          {friendRequests.users.length ? (
            friendRequests.users.map((user) => (
              <Notification
                acceptFriendRequest={acceptFriendRequest}
                rejectFriendRequest={rejectFriendRequest}
                key={user.createdAt.toDate()}
                {...user}
              />
            ))
          ) : (
            <div className="Notification-Nothing">
              <img width="90%" height="50%" src="undraw_void_3ggu.svg"></img>
              <p>There is nothing around here.</p>
            </div>
          )}
        </Options>
      ) : null}
    </div>
  );
}

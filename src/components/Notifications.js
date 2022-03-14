import React, { useContext, useRef, useEffect, useState, useCallback } from "react";
import userContext from "../context/user-context";
import useFriend from "../hooks/useFriend";
import Options, { Option } from "./Options";
import { Icon } from "@iconify/react";
import "../styles/Notifications.css";
import ProfileImage from "./ProfileImage";
import useUser from "../hooks/useUser";
import { firestore } from "../firebase/config";

export function Notification(props) {
  const {
    userUID,
    photoURL,
    displayName,
    acceptFriendRequest,
    rejectFriendRequest,
  } = props;

  const onClickToAcceptFriendRequest = useCallback(
    () => {
      acceptFriendRequest(userUID)
    },
    [userUID],
  )
  
  const onClickToRejectFriendRequest = useCallback(
    () => {
      rejectFriendRequest(userUID);
    },
    [userUID],
  )
  
  return (
    <>
      <Option>
        <div className="Notification">
          <div>
            <ProfileImage
              width="45px"
              height="45px"
              image={photoURL}
              alt="Profile Image"
            />
          </div>
          <div className="Notification-Body">
            <p className="linked">{displayName}</p>
            <p className="Notification-Type">Friend Request</p>
          </div>

          <div className="Notification-Manage">
            <Icon
              color="var(--color-green)"
              onClick={onClickToAcceptFriendRequest}
              icon="akar-icons:check"
            />
            <Icon
              color="var(--color-red)"
              onClick={onClickToRejectFriendRequest}
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
  const [updatedFriendRequests, setUpdatedFriendRequests] = useState();
  
  useEffect(() => {
    if (friendRequests?.users) {
      let updated = [];

      const unsubscribeUsers = firestore
        .collection("users")
        .onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            const changeDocID = change.doc.id;
            const changedData = change.doc.data();
            if (change.type === "added") {
              if (friendRequests.users.includes(changeDocID)) {
                updated.push({ ...changedData, userUID: changeDocID });
              }
            }

            if (change.type === "modified") {
              if (friendRequests.users.includes(changeDocID)) {
                console.log(changedData);
                updated = updated.map((friendRequest) => {
                  if (friendRequest.userUID === changeDocID) {
                    return { ...changedData, userUID: changeDocID };
                  }
                  return friendRequest;
                });
              }
            }

            if (change.type === "removed") {
              if (friendRequests.users.includes(changeDocID)) {
                console.log(changedData);
                updated = updated.filter((friendRequest) => {
                  return friendRequest.userUID !== changeDocID;
                });
                firestore
                  .collection("users")
                  .doc(currentUser.uid)
                  .collection("friendRequests")
                  .doc(changeDocID)
                  .delete();
              }
            }
          });

          setUpdatedFriendRequests({ count: updated.length, users: updated });
        });

      return unsubscribeUsers;
    }
  }, [friendRequests]);

  return (
    <div className="Notifications">
      <Icon
        width="22px"
        color="var(--color-grey)"
        icon="clarity:notification-line"
        ref={activator}
        className="Notification-Icon"
      />
      {updatedFriendRequests?.users && updatedFriendRequests?.count >=0 ? (
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
            <p className="linked">{updatedFriendRequests.count}</p>
          </div>
          <hr className="line-semi-completed" />
          {updatedFriendRequests?.users?.length ? (
            updatedFriendRequests.users.map((user) => {
              return (
                <Notification
                  acceptFriendRequest={acceptFriendRequest}
                  rejectFriendRequest={rejectFriendRequest}
                  key={user.userUID}
                  {...user}
                />
              );
            })
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

import { useEffect, useState, useContext, useCallback } from "react";
import userContext from "../context/user-context";
import { firestore } from "../firebase/config";
import firebase from "firebase";
import useUser from "./useUser";

export default function ({ user }) {
  const { currentUser } = useContext(userContext);
  const { consume } = useUser(currentUser?.uid);
  const { photoURL, displayName } = consume;
  const [friends, setFriends] = useState();
  const [friendRequests, setFriendRequests] = useState({});

  const isSendedFriendRequest = useCallback(() => {
    if (friendRequests.users) {
      return friendRequests.users.find(
        (user) => user.userUID === currentUser.uid
      );
    }
  }, [friendRequests, currentUser]);

  const acceptFriendRequest = useCallback(
    (requestUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          const refUser = firestore.collection("users").doc(currentUser.uid);
          const refFriends = refUser.collection("friends");
          const refFriendRequests = refUser
            .collection("friendRequests")
            .doc(requestUser.userUID);

          console.log(currentUser);

          const refCreatorUser = firestore
            .collection("users")
            .doc(requestUser.userUID);
          const refCreatorFriends = refCreatorUser.collection("friends");

          refFriendRequests.delete().then(() => {
            refFriends
              .doc(requestUser.userUID)
              .set(Object.assign(requestUser, { id: String(Date.now()) }));
            refCreatorFriends
              .doc(user)
              .set({ displayName, photoURL, id: String(Date.now()) });
          });
        }
      }
    },
    [currentUser, displayName, photoURL]
  );

  const rejectFriendRequest = useCallback(
    (requestUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          const refUser = firestore.collection("users").doc(currentUser.uid);
          const refFriendRequests = refUser
            .collection("friendRequests")
            .doc(requestUser.userUID);

          refFriendRequests.delete();
        }
      }
    },
    [currentUser]
  );

  const friendRequest = useCallback(() => {
    if (currentUser) {
      if (friendRequests) {
        if (currentUser.emailVerified) {
          const timestamp =
            firebase.default.firestore.FieldValue.serverTimestamp();
          const friendsRequestsRef = firestore
            .collection("users")
            .doc(user)
            .collection("friendRequests")
            .doc(currentUser.uid);

          if (!isSendedFriendRequest()) {
            friendsRequestsRef.set({
              createdAt: timestamp,
              displayName,
              photoURL,
            });
          } else {
            friendsRequestsRef.delete();
          }
        }
      }
    }
  }, [friendRequests, currentUser, displayName, photoURL]);

  useEffect(() => {
    if (user) {
      const refUser = firestore.collection("users").doc(user);
      const refFriendRequests = refUser.collection("friendRequests");
      const unsubSnapshotFriendRequests = refFriendRequests.onSnapshot(
        (querySnapshot) => {
          setFriendRequests({
            count: String(querySnapshot.size),
            users: querySnapshot.docs.map((doc) =>
              Object.assign(doc.data(), { userUID: doc.id })
            ),
          });
        }
      );

      return () => {
        unsubSnapshotFriendRequests();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const refUser = firestore.collection("users").doc(user);
      const refFriends = refUser.collection("friends");

      const unsubSnapshotFriends = refFriends.onSnapshot((querySnapshot) => {
        const users = querySnapshot.docs
          .map((doc) => {
            Object.assign(doc.data(), { userUID: doc.id });
          })
          .filter((el) => el);
        setFriends({
          count: users.length,
          users,
        });
      });

      return () => {
        unsubSnapshotFriends();
      };
    }
  }, [user]);

  const removeFriend = useCallback(() => {
    if (friends && user) {
      const refUser = firestore.collection("users").doc(user);
      const refFriend = refUser.collection("friends").doc(currentUser.uid);

      const refUserCurrent = firestore.collection("users").doc(currentUser.uid);
      const refFriendCurrent = refUserCurrent.collection("friends").doc(user);

      refFriend.delete();
      refFriendCurrent.delete();
    }
  }, [friends, user]);

  const isFriend = useCallback(() => {
    if (friends) {
      return friends.users.find((user) => user.userUID === currentUser.uid);
    }
  }, [friends, currentUser]);

  return {
    friends,
    friendRequests,
    isFriend,
    friendRequest,
    isSendedFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
}

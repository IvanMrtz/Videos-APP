import { useEffect, useState, useContext, useCallback } from "react";
import userContext from "../context/user-context";
import { firestore } from "../firebase/config";
import firebase from "firebase";
import { useUpdatedUser } from "./useUser";

export default function ({ user }) {
  const { currentUser } = useContext(userContext);
  const { consume } = useUpdatedUser(currentUser?.uid);
  const { photoURL, displayName } = consume;
  const [friends, setFriends] = useState();
  const [friendRequests, setFriendRequests] = useState({});

  const isSendedFriendRequest = useCallback(() => {
    if (friendRequests.users) {
      return friendRequests.users.find(
        (userUID) => userUID === currentUser.uid
      );
    }
  }, [friendRequests, currentUser]);

  useEffect(() => {
    if (user) {
      const refUser = firestore.collection("users").doc(user);
      const refFriendRequests = refUser.collection("friendRequests");
      const unsubSnapshotFriendRequests = refFriendRequests.onSnapshot(
        (querySnapshot) => {
          setFriendRequests({
            count: String(querySnapshot.size),
            users: querySnapshot.docs.map((doc) => doc.id),
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
      refFriends
        .get()
        .then((res) => res.docs.map((friend) => console.log(friend.data())));
      const unsubSnapshotFriends = refFriends.onSnapshot((querySnapshot) => {
        const users = querySnapshot.docs
          .map((doc) => {
            return doc.id;
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

  const acceptFriendRequest = useCallback(
    (requestUserUID) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          const refUser = firestore.collection("users").doc(currentUser.uid);
          const refFriends = refUser.collection("friends");
          const refFriendRequests = refUser
            .collection("friendRequests")
            .doc(requestUserUID);

          const refCreatorUser = firestore
            .collection("users")
            .doc(requestUserUID);
          const refCreatorFriends = refCreatorUser.collection("friends");

          refFriendRequests.delete().then(() => {
            refFriends.doc(requestUserUID).set({ id: String(Date.now()) });
            refCreatorFriends.doc(user).set({ id: String(Date.now()) });
          });
        }
      }
    },
    [currentUser]
  );

  const rejectFriendRequest = useCallback(
    (requestUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          const refUser = firestore.collection("users").doc(currentUser.uid);

          refUser
            .collection("friendRequests")
            .doc(requestUser)
            .delete();
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
            });
          } else {
            friendsRequestsRef.delete();
          }
        }
      }
    }
  }, [friendRequests, currentUser, displayName, photoURL]);

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
      return friends.users.find((userUID) => userUID === currentUser.uid);
    }
  }, [friends, currentUser]);

  return {
    friends,
    setFriends,
    friendRequests,
    setFriendRequests,
    isFriend,
    friendRequest,
    isSendedFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
}

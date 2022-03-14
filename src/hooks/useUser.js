import { firestore } from "../firebase/config";
import { useState, useEffect } from "react";

export function useUpdatedUser(user) {
  if (user) {
    if (typeof user !== "string") {
      user = user.uid;
    }
  }
  const [data = {}, setData] = useState({});
  const [subscribers, setSubscribers] = useState({});
  const finalData = Object.assign(data, subscribers);
  const existsData = !!Object.keys(finalData).length;
  const refUsers = firestore.collection("users");

  function getUserSubscribers(uid) {
    let refUser = refUsers.doc(uid);

    return refUser.collection("subscribers").onSnapshot({
      next: (querySnapshot) => {
        setSubscribers({
          subscribers: {
            count: String(querySnapshot.size),
            users: querySnapshot.docs.map((doc) =>
              Object.assign(doc.data(), { userUID: doc.id })
            ),
          },
        });
      },
    });
  }

  useEffect(() => {
    if (user) {
      let refUser = refUsers.doc(user);
      const unsubSnapshot = refUser.onSnapshot({
        next: function (snapshot) {
          setData(snapshot.data());
        },
        error: function (error) {
          console.log(error);
        },
      });
      const unsubSnapshotSubscibers = refUser
        .collection("subscribers")
        .onSnapshot({
          next: (querySnapshot) => {
            setSubscribers({
              subscribers: {
                count: String(querySnapshot.size),
                users: querySnapshot.docs.map((doc) =>
                  Object.assign(doc.data(), { userUID: doc.id })
                ),
              },
            });
          },
        });

      return () => {
        unsubSnapshot();
        unsubSnapshotSubscibers();
      };
    }
  }, [user]);

  function setUpdatedData(uid, data) {
    return refUsers
      .doc(uid)
      .update(data);
  }

  return {
    consume: existsData
      ? finalData
      : {
          photoURL: null,
          displayName: null,
          email: null,
          isOnline: null,
          age: null,
          subscribers: null,
        },
    provide: setUpdatedData,
    getUserSubscribers,
  };
}

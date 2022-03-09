import { firestore } from "../firebase/config";
import { useState, useEffect } from "react";

export default function (user) {
  if (user) {
    if (typeof user !== "string") {
      user = user.uid;
    }
  }
  const [data = {}, setData] = useState({});
  const [subscribers, setSubscribers] = useState({});
  const [updatedData, setUpdatedData] = useState();
  const finalData = Object.assign(data, subscribers);
  const existsData = !!Object.keys(finalData).length;
  useEffect(() => {
    if (user) {
      const refUser = firestore.collection("users").doc(user);
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

  useEffect(() => {
    if (updatedData && (user || updatedData.userUID)) {
      const ref = firestore
        .collection("users")
        .doc(user || updatedData.userUID);

      if (updatedData.userUID) {
        delete updatedData.userUID;
      }
      ref.update(updatedData);
    }
  }, [updatedData]);

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
  };
}

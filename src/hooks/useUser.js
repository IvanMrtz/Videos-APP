import { firestore } from "../firebase/config";
import { useState, useEffect } from "react";

export default function (user) {
  if (user) {
    if (typeof user !== "string") {
      user = user.uid;
    }
  }

  const [data, setData] = useState();
  const [updatedData, setUpdatedData] = useState();

  useEffect(() => {
    if (user) {
      var unsubSnapshot = firestore
        .collection("users")
        .doc(user)
        .onSnapshot({
          next: function(snapshot) {
            setData(snapshot.data())
          }
        })
    }

    return unsubSnapshot;
  }, [user]);

  useEffect(() => {
    if (data) {
      firestore.collection("users").doc(user).update(updatedData);
    }
  }, [updatedData]);

  return {
    consume: data ?? {
      photoURL: null,
      displayName: null,
      friends: null,
      peopleHelped: null,
      email: null,
      isOnline: null,
      verified: null,
    },
    provide: setUpdatedData,
  };
}

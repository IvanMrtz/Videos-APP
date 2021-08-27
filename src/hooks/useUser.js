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
          next: function (snapshot) {
            setData(snapshot.data());
          },
        });
    }

    return unsubSnapshot;
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
    consume: data ?? {
      photoURL: null,
      displayName: null,
      peopleHelped: null,
      email: null,
      isOnline: null,
      age: null,
      subscribers: null,
    },
    provide: setUpdatedData,
  };
}

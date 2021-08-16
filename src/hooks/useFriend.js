import { useEffect, useState } from "react";
import { firestore } from "../firebase/config";

export default function({user}) {
    const [friends, setFriends] = useState(null);

    useEffect(() => {
        const unsubSnapshot = firestore
        .collection("users")
        .doc(user.uid)
        .collection("friends")
        .onSnapshot({
          next: (querySnapshot) => {
            const updatedFriends = querySnapshot.docs.map((docSnapshot) => {
              return docSnapshot.data();
            });
  
            setFriends(updatedFriends);
          },
        });
  
      return unsubSnapshot;
    }, [])

    return { friends };
}
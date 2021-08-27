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
              const data = docSnapshot.data();
              if(Object.keys(data).length) {
                return data;
              }
            }).filter(data => !!data);
  
            setFriends(updatedFriends);
          },
        });
  
      return unsubSnapshot;
    }, [])

    return { friends };
}
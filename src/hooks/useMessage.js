import { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import firebase from "firebase/app";

export default function ({ idVideo, userUID }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubSnapshot = firestore
      .collection("users")
      .doc(userUID)
      .collection("notes")
      .doc(idVideo)
      .collection("chat")
      .orderBy("createdAt")
      .limit(20)
      .onSnapshot({
        next: (querySnapshot) => {
          const updatedMessages = querySnapshot.docs.map((docSnapshot) => {
            return Object.assign(docSnapshot.data(), { id: docSnapshot.id });
          });

          setMessages(updatedMessages);
        },
      });

    return unsubSnapshot;
  }, []);

  function writeMessage(data) {
    const { name, photo, message } = data;
    const timestamp = firebase.default.firestore.FieldValue.serverTimestamp;

    if (Boolean(name) && Boolean(photo) && Boolean(message)) {
      return firestore
        .collection("users")
        .doc(userUID)
        .collection("notes")
        .doc(idVideo)
        .collection("chat")
        .add({ ...data, createdAt: timestamp() });
    }

    return Promise.reject();
  }

  return { messages, writeMessage };
}

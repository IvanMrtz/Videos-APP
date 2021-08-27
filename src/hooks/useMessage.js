import { useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import firebase from "firebase/app";
import concatDocs from "../utilities/ConcatDocs/concatDocs";

export default function ({ idVideo, userUID }) {
  const [messages, setMessages] = useState([]);
  const [changes, setChanges] = useState(false);

  useEffect(() => {
    const chatRef = firestore
      .collection("users")
      .doc(userUID)
      .collection("videos")
      .doc(idVideo)
      .collection("chat");

    const observer = {
      next: (querySnapshot) => {
        let promises = [];

        promises.push(
          new Promise((res) => {
            querySnapshot.docs.map((docSnapshot) => {
              return chatRef
                .doc(docSnapshot.id)
                .collection("comments")
                .orderBy("createdAt")
                .limit(20)
                .onSnapshot({
                  next: (querySnapshot) => {
                    const messages = querySnapshot.docs.map((docSnapshot) => {
                      return Object.assign(docSnapshot.data(), {
                        id: docSnapshot.id,
                      });
                    });

                    // Horrible
                    if (promises === "finished") {
                      setChanges((previous) => !previous);
                    } else {
                      res(messages);
                    }
                  },
                });
            });
          })
        );

        Promise.all(promises).then((messages) => {
          if (promises !== "finished") {
            promises = "finished";
            setMessages(concatDocs(messages));
          }
        });
      },
    };
    const unsubSnapshot = chatRef.onSnapshot(observer);
    return unsubSnapshot;
  }, [changes]);

  function writeMessage(data) {
    const { name, photo, message } = data;
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();

    if (Boolean(name) && Boolean(photo) && Boolean(message)) {
      const chatUserRef = firestore
        .collection("users")
        .doc(userUID)
        .collection("videos")
        .doc(idVideo)
        .collection("chat")
        .doc(userUID);

      return chatUserRef.get().then(() => {
        return chatUserRef.set({ createdAt }).then(() => {
          return chatUserRef.collection("comments").add({ ...data, createdAt });
        });
      });
    }
  }

  return { messages, writeMessage };
}

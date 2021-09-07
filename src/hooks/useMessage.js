import { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase/config";
import firebase from "firebase/app";
import concatDocs from "../utilities/ConcatDocs/concatDocs";
import userContext from "../context/user-context";

export default function ({ idVideo, ownerVideoUID }) {
  const [messages, setMessages] = useState([]);
  const [changes, setChanges] = useState(false);
  const { currentUser } = useContext(userContext);

  const chatRef = firestore
    .collection("users")
    .doc(ownerVideoUID)
    .collection("videos")
    .doc(idVideo)
    .collection("chat");

  useEffect(() => {
    const observer = {
      next: (querySnapshot) => {
        let promises = [];

        querySnapshot.docs.map((docSnapshot) => {
          promises.push(
            new Promise((res, rej) => {
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

                    console.log(messages);

                    // Horrible
                    if (promises === "finished") {
                      setChanges((previous) => !previous);
                    } else {
                      res(messages);
                    }
                  },
                });
            })
          );
        });

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

  function editMessage(messageID, data) {
    console.log(data)
    firestore
      .collection("users")
      .doc(ownerVideoUID)
      .collection("videos")
      .doc(idVideo)
      .collection("chat")
      .doc(currentUser.uid)
      .collection("comments")
      .doc(messageID)
      .update(data);
  }

  function removeMessage(messageID) {
    firestore
      .collection("users")
      .doc(ownerVideoUID)
      .collection("videos")
      .doc(idVideo)
      .collection("chat")
      .doc(currentUser.uid)
      .collection("comments")
      .doc(messageID)
      .delete();
  }

  function writeMessage(data) {
    const { name, photo, message } = data;
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();

    if (Boolean(name) && Boolean(photo) && Boolean(message)) {
      const chatUserRef = firestore
        .collection("users")
        .doc(ownerVideoUID)
        .collection("videos")
        .doc(idVideo)
        .collection("chat")
        .doc(currentUser.uid);

      return chatUserRef.set({ createdAt }).then(() => {
        return chatUserRef.collection("comments").add({ ...data, createdAt });
      });
    }

    return Promise.resolve();
  }

  return { messages, writeMessage, removeMessage, editMessage };
}

import { useContext, useState } from "react";
import { firestore } from "../firebase/config";
import firebase from "firebase/app";
import userContext from "../context/user-context";
import { reject } from "lodash";

export default function ({ idVideo, ownerVideoUID }) {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(userContext);
  
  function editMessage(messageID, data) {
    console.log(data);
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

  return { messages, writeMessage, removeMessage, editMessage, setMessages};
}

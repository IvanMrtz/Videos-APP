import { firestore } from "../firebase/config";
import Swal from "sweetalert2";
import { useContext } from "react";
import userContext from "../context/user-context";
import useStorage from "./useStorage";

function useFirestore() {
  const { currentUser } = useContext(userContext);
  const { read: readStorage, getDownloadURL } = useStorage();

  // : if request.resource.contentType.matches('video/mp4') || request.resource.contentType.matches('image/jpg');

  function add(video, done = () => {}, error = () => {}) {
    if (currentUser.emailVerified) {
      readStorage(["videos", currentUser.uid, video.idVideo])
        .put(video.fileVideo)
        .then(() => {
          readStorage(["thumbnails", currentUser.uid, video.idVideo])
            .put(video.fileThumbnail)
            .then(() => {
              /** dangerous */
              delete video.fileVideo;
              delete video.fileThumbnail;
              video.views = {
                viewers: [
                  {
                    refresh: 0,
                    userUID: currentUser.uid,
                  },
                ],
                count: 0,
              };
              /** dangerous */

              firestore
                .collection("users")
                .doc(currentUser.uid)
                .collection("videos")
                .doc(video.idVideo)
                .collection("chat")
                .add({
                  name: "Bot",
                  photo: "https://picsum.photos/35",
                  message: "write something mate!",
                });

              firestore
                .collection("users")
                .doc(currentUser.uid)
                .collection("videos")
                .doc(video.idVideo)
                .set(video)
                .then(() => {
                  done();
                })
                .catch(({ message }) => {
                  error(message);
                });

              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });

              Toast.fire({
                icon: "success",
                title: "Successfully created",
              });
            })
            .catch(({ message }) => error(message));
        })
        .catch(({ message }) => error(message));
    }
  }

  function remove(video) {
    if (currentUser.emailVerified) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Deleted!", "Your video has been deleted.", "success");

          firestore
            .collection("users")
            .doc(currentUser.uid)
            .collection("videos")
            .doc(video.idVideo)
            .delete();

          const chatRef = firestore
            .collection("users")
            .doc(currentUser.uid)
            .collection("videos")
            .doc(video.idVideo)
            .collection("chat");

          chatRef.onSnapshot((docSnapshot) => {
            docSnapshot.forEach((doc) => {
              chatRef.doc(doc.id).delete();
            });
          });

          readStorage(["videos", currentUser.uid, video.idVideo]).delete();
          readStorage(["thumbnails", currentUser.uid, video.idVideo]).delete();
        }
      });
    }
  }

  function update(video, done = () => {}, error = () => {}) {
    if (currentUser.emailVerified) {
      const { userUID = currentUser.uid } = video;
      /** dangerous */
      delete video.userUID;
      /** dangerous */

      let toUpdateFirestore = {};
      let toUpdateStorage = {};

      Object.entries(video).map(([key, val]) => {
        if (!val || typeof val === "function") {
          return null;
        }
        if (val instanceof File) {
          toUpdateStorage[key] = val;
        } else {
          toUpdateFirestore[key] = val;
        }
      });

      if (
        Object.keys(toUpdateStorage).length == 0 &&
        Object.keys(toUpdateFirestore).length == 1
      ) {
        error("You must change at least one input");
        return;
      }

      let data = [];

      function onChangeTask(task, resolve, name) {
        task.on(
          "state_changed",
          function () {},
          function () {},
          function () {
            getDownloadURL(task.snapshot.ref).then((url) => {
              resolve({ [name]: url });
            });
          }
        );
      }

      if (Object.keys(toUpdateStorage).length > 0) {
        if (toUpdateStorage["fileVideo"]) {
          data.push(
            new Promise((res, rej) => {
              const uploadTask = readStorage([
                "videos",
                userUID,
                video.idVideo,
              ]).put(toUpdateStorage["fileVideo"]);

              onChangeTask(uploadTask, res, "video");
            })
          );
        }
        if (toUpdateStorage["fileThumbnail"]) {
          data.push(
            new Promise((res, rej) => {
              const uploadTask = readStorage([
                "thumbnails",
                userUID,
                video.idVideo,
              ]).put(toUpdateStorage["fileThumbnail"]);

              onChangeTask(uploadTask, res, "thumbnail");
            })
          );
        }

        Promise.all(data).then((processedData) => {
          const parsedToObj = processedData.reduce((el, acc) => {
            return Object.assign(acc, el);
          });

          video.setData(parsedToObj);
          putFirestoreData();
        });
      } else {
        putFirestoreData();
      }

      function putFirestoreData() {
        if (Object.keys(toUpdateFirestore).length > 1) {
          // Greater than one, because not needs
          firestore
            .collection("users")
            .doc(userUID)
            .collection("videos")
            .doc(video.idVideo)
            .update(toUpdateFirestore);
        }
      }
      console.log(toUpdateStorage);
      console.log(toUpdateFirestore);
      done();
    }
  }

  function readAllVideos(observer) {
    return firestore.collection("users").onSnapshot(observer);
  }

  function read(observer) {
    return firestore
      .collection("users")
      .doc(currentUser.uid)
      .collection("videos")
      .onSnapshot(observer);
  }

  return { add, read, remove, update, readAllVideos };
}

export default useFirestore;

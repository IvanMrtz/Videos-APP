import { firestore } from "../firebase/config";
import Swal from "sweetalert2";
import { useCallback, useContext } from "react";
import userContext from "../context/user-context";
import useStorage from "./useStorage";
import firebase from "firebase";

function useFirestore() {
  const { currentUser } = useContext(userContext);
  const { read: readStorage, getDownloadURL } = useStorage();
  // : if request.resource.contentType.matches('video/mp4') || request.resource.contentType.matches('image/jpg');

  const add = useCallback(
    (video, done = () => {}, error = () => {}) => {
      readStorage(["videos", currentUser.uid, video.idVideo])
        .put(video.fileVideo)
        .then(() => {
          readStorage(["thumbnails", currentUser.uid, video.idVideo])
            .put(video.fileThumbnail)
            .then(() => {
              const timestamp =
                firebase.default.firestore.FieldValue.serverTimestamp();

              delete video.fileVideo;
              delete video.fileThumbnail;
              video.userUID = currentUser.uid;
              video.likes = {
                likings: [],
                count: 0,
              };
              video.createdAt = timestamp;
              video.views = {
                viewers: [],
                count: 0,
              };

              const videoRef = firestore
                .collection("users")
                .doc(currentUser.uid)
                .collection("videos")
                .doc(video.idVideo);

              videoRef
                .set(video)
                .then(() => {
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
                .catch(({ message }) => {
                  error(message);
                });
            })
            .catch(({ message }) => error(message));
        })
        .catch(({ message }) => error(message));
    },
    [currentUser]
  );

  const remove = useCallback(
    (video) => {
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

          const videoRef = firestore
            .collection("users")
            .doc(currentUser.uid)
            .collection("videos")
            .doc(video.idVideo);

          videoRef.delete();
          const chatRef = videoRef.collection("chat");

          chatRef.onSnapshot((docSnapshot) => {
            docSnapshot.forEach((doc) => {
              chatRef.doc(doc.id).delete();
            });
          });

          readStorage(["videos", currentUser.uid, video.idVideo]).delete();
          readStorage(["thumbnails", currentUser.uid, video.idVideo]).delete();
        }
      });
    },
    [currentUser]
  );

  const update = useCallback(
    (video, done = () => {}, error = () => {}) => {
      const { userUID = currentUser?.uid, idVideo } = video;
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
            new Promise((res) => {
              const uploadTask = readStorage(["videos", userUID, idVideo]).put(
                toUpdateStorage["fileVideo"]
              );

              onChangeTask(uploadTask, res, "video");
            })
          );
        }
        if (toUpdateStorage["fileThumbnail"]) {
          data.push(
            new Promise((res) => {
              const uploadTask = readStorage([
                "thumbnails",
                userUID,
                idVideo,
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
            .doc(idVideo)
            .update(toUpdateFirestore)
            .catch(console.error);
        }
      }

      console.log(toUpdateStorage);
      console.log(toUpdateFirestore);
      done();
    },
    [currentUser]
  );

  function readAllVideos(observer) {
    return firestore.collection("users").onSnapshot(observer);
  }

  function read(observer, userUID) {
    return firestore
      .collection("users")
      .doc(userUID)
      .collection("videos")
      .onSnapshot(observer);
  }

  function readSingleVideo(observer, error, userUID, videoID) {
    return firestore
      .collection("users")
      .doc(userUID)
      .collection("videos")
      .where("idVideo", "==", videoID)
      .onSnapshot(observer, error);
  }

  return { add, read, remove, update, readAllVideos, readSingleVideo };
}

export default useFirestore;
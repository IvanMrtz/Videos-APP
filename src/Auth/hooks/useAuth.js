import { auth, firestore } from "../../firebase/config";
import firebase from "firebase/app";

function useAuth() {
  function login(data, done, error) {
    auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        done();
      })
      .catch(({ message }) => {
        error(message);
      });
  }

  function logout() {
    auth.signOut();
  }

  function register(data, done, error) {
    if (data.repeatPassword !== data.password) {
      error("The two passwords are not equal.");
      return;
    }

    if (data.age < 18) {
      error("You are not of legal age.");
      return;
    }

    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((newUser) => {
          const displayName = newUser.user.email.split("@")[0];
          const email = newUser.user.email;
          const photoURL = "https://picsum.photos/40";

          firebase.auth().currentUser
          .updateProfile({
            displayName,
            email,
            photoURL,
          })
          .then(() => {
            firestore
              .collection("users")
              .doc(newUser.user.uid)
              .set({
                displayName,
                email,
                photoURL,
                isOnline: false,
                verified: false,
                friends: 0,
                peopleHelped: 0,
              })
              .then(() => {
                done();
              });
          });
      })
      .catch(({ message }) => {
        error(message);
      });
  }

  return { login, logout, register };
}

export default useAuth;

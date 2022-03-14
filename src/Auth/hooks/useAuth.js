import { useCallback } from "react";
import { auth, firestore } from "../../firebase/config";
import { useUpdatedUser } from "../../hooks/useUser";

function useAuth() {
  const { provide } = useUpdatedUser();

  const login = useCallback(
    (data, done, error) => {
      alert("login");

      auth
        .signInWithEmailAndPassword(data.email, data.password)
        .then(() => {
          provide(auth.currentUser.uid, { isOnline: true });
          done();
        })
        .catch(error);
    },
    [auth]
  );

  function updatePassword(password, _, error) {
    auth.currentUser.updatePassword(password).catch(error);
  }

  function updateEmail(email, _, error) {
    auth.currentUser.updateEmail(email).catch(error);
  }

  const logout = useCallback(() => {
    const userUID = auth.currentUser.uid;
    provide(userUID, { isOnline: false }).then(() => {
      auth.signOut().catch((error) => {
        provide(userUID, { isOnline: true });
      });
    });
  }, [auth]);

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
        auth.currentUser
          .sendEmailVerification()
          .then(() => {
            const refUser = firestore.collection("users").doc(newUser.user.uid);

            refUser
              .set({
                displayName: data.displayName,
                email: newUser.user.email,
                photoURL: "https://picsum.photos/40",
                isOnline: false,
                age: Number(data.age),
              })
              .then(done)
              .catch(error);

            refUser.collection("friend_requests").add({});
          })
          .catch(error);
      });
  }

  return { login, logout, register, updatePassword, updateEmail };
}

export default useAuth;

import { auth, firestore } from "../../firebase/config";
import useUser from "../../hooks/useUser";

function useAuth() {
  const { provide } = useUser();

  function login(data, done, error) {
    auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(() => {
        provide({ isOnline: true, userUID: auth.currentUser.uid });
        done();
      })
      .catch(error);
  }

  function updatePassword(password, _, error) {
    auth.currentUser.updatePassword(password).catch(error);
  }

  function updateEmail(email, _, error) {
    auth.currentUser.updateEmail(email).catch(error);
  }

  function logout() {
    const userUID = auth.currentUser.uid;
    auth.signOut().then(() => {
      provide({ isOnline: false, userUID });
    });
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

            refUser.collection("friends").add({});
          })
          .catch(error);
      });
  }

  return { login, logout, register, updatePassword, updateEmail };
}

export default useAuth;

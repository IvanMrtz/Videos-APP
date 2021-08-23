import React from "react";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { withRouter } from "react-router";
import useUser from "../hooks/useUser";

const userContext = React.createContext();

export default userContext;

export const UserProvider = withRouter(({ children, history }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { consume: userData } = useUser(currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(user);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <userContext.Provider value={{ currentUser, userData }}>
      {children}
    </userContext.Provider>
  );
});
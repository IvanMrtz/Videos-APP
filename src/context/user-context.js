import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase/config";
import {useUpdatedUser} from "../hooks/useUser";

const userContext = React.createContext();

export default userContext;

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();
  const { consume: userData } = useUpdatedUser(currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const pathName = history.location.pathname;
      
      if (user) {
        setCurrentUser(user);
        if (pathName == "/auth") {
          history.push("/");
        }
        console.log(userData)
      } else {
        setCurrentUser(null);
        if (pathName != "/auth") {
          history.push("/auth");
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <userContext.Provider value={{ currentUser, userData }}>
      {children}
    </userContext.Provider>
  );
};

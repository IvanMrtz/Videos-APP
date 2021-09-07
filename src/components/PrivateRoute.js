import { useContext } from "react";
import { Route } from "react-router";
import { useHistory } from "react-router-dom";
import UserContext from "../context/user-context";

export default function ({ component: RouteComponent, ...rest }) {
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (!!currentUser) {
          return <RouteComponent {...routeProps} />;
        } else{
          return null;
        }
      }}
    />
  );
}

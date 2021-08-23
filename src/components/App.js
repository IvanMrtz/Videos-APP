import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Main } from "./Main";
import MainAuth from "../Auth/components/Main";
import PageNotFound from "./404.js";
import { UserProvider } from "../context/user-context";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Profile";
import React from "react";
import Video from "./Video";

function App() {
  return (
    <Router>
      <UserProvider>  
        <Switch>
          <PrivateRoute path="/" exact component={Main} />
          <Route path="/profile/:uid" exact component={Profile} />
          <Route path="/video/:id/" exact component={Video} />
          <Route path="/auth" exact component={MainAuth} />
          <Route path="*" component={PageNotFound} />
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;

import { useContext } from "react";
import { withRouter } from "react-router-dom";
import userContext from "../context/user-context";
import "../styles/InfoUserPanel.css";
import ProfileImage from "./ProfileImage";

export default withRouter(function ({ history }) {
  const { userData, currentUser } = useContext(userContext);
  const { displayName, friends, peopleHelped, email, photoURL } =
    userData.consume;

  return (
    <div className="Info-User-Panel d-flex flex-column align-items-center justify-content-evenly">
      <div className="Personal-Info-Container d-flex justify-content-around align-items-center">
        <ProfileImage
          action={() => {
            history.push("/profile/" + currentUser.uid);
          }}
          width="60px"
          image={photoURL}
          alt="Profile Image"
        />
        <div className="d-flex flex-column">
          <p className="small linked">{displayName}</p>
          <p className="small linked">{email}</p>
        </div>
      </div>
      <div className="Public-Info-Container d-flex justify-content-evenly align-items-center">
        <p className="very-small-2 grey">
          Friends: <span className="linked">{friends}</span>
        </p>
        <p className="very-small-2 grey">
          People helped: <span className="linked">{peopleHelped}</span>
        </p>
      </div>
    </div>
  );
});

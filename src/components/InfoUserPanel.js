import { useContext } from "react";
import { withRouter } from "react-router-dom";
import userContext from "../context/user-context";
import useFriend from "../hooks/useFriend";
import "../styles/InfoUserPanel.css";
import Media from "./MediaQuery";
import ProfileImage from "./ProfileImage";

export default withRouter(function ({ history }) {
  const { userData, currentUser } = useContext(userContext);
  const { displayName, subscribers, email, photoURL } = userData;
  const { friends } = useFriend({user: currentUser.uid});

  return (
    <Media
      query="(min-width: 850px)"
      render={(match) => {
        return (
          <Media
            query="(min-width: 650px)"
            render={(match2) => {
              const styleInfoUserPanel = {
                width: "300px",
                height: "150px",
                borderRadius: "10px",
                background: "var(--color-grey-background)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
              };

              function changeStyles(apply, match) {
                if (!match) apply();
              }

              changeStyles(() => {
                styleInfoUserPanel.height = "200px";
              }, match);

              changeStyles(() => {
                styleInfoUserPanel.width = "100%";
                styleInfoUserPanel.marginBottom = "25px";
              }, match2);
              
              return (
                <div style={styleInfoUserPanel}>
                  <div className="Personal-Info-Container">
                    <ProfileImage
                      action={() => {
                        history.push("/profile/" + currentUser.uid);
                      }}
                      width="55px"
                      height="55px"
                      image={photoURL}
                      alt="Profile Image"
                    />
                    <div className="d-flex flex-column">
                      <p className="small linked">{displayName}</p>
                      <p className="small linked">{email}</p>
                    </div>
                  </div>
                  <div className="Public-Info-Container">
                    <p className="very-small-2 grey">
                      Friends: <span className="linked">{friends?.count}</span>
                    </p>
                    <p className="very-small-2 grey">
                      Subscribers:{" "}
                      <span className="linked">{subscribers?.count || "-"}</span>
                    </p>
                  </div>
                </div>
              );
            }}
          />
        );
      }}
    />
  );
});

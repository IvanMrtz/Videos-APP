import "../styles/SideMenu.css";
import { Icon } from "@iconify/react";
import userFriends from "@iconify-icons/fa-solid/user-friends";
import options16Filled from "@iconify-icons/fluent/options-16-filled";
import tasksApp28Filled from "@iconify-icons/fluent/tasks-app-28-filled";
import bxArrowBack from "@iconify-icons/bx/bx-arrow-back";
import Background from "./Background";
import { useContext, useState } from "react";
import userContext from "../context/user-context";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { withRouter } from "react-router";
import useAuth from "../Auth/hooks/useAuth";
import useFriend from "../hooks/useFriend";
import { Friends } from "./Friends";
import Media from "./MediaQuery";

export function FriendsPopup(props) {
  const { currentUser } = useContext(userContext);
  const { setPopup } = props;
  const { friends } = useFriend({ user: currentUser?.uid });

  return (
    <div className="Friends-Popup">
      <Icon
        onClick={() => {
          setPopup(false);
        }}
        className="Friends-Close"
        icon="clarity:close-line"
      />
      <h2>Friends ({friends?.count})</h2>
      <hr className="line-semi-completed" />

      <Friends style={{ width: "250px" }}>
        <Icon icon="bi:chat-right-dots-fill" />
        <Icon icon="bi:three-dots-vertical" />
      </Friends>
    </div>
  );
}

export default withRouter(function ({ history, setSideMenu }) {
  const { currentUser, userData } = useContext(userContext);
  const { photoURL, displayName } = userData;
  const { logout } = useAuth();
  const [popup, setPopup] = useState();

  return !popup ? (
    <Media
      query="(min-width: 500px)"
      render={(match) => {
        return (
          <Background setClose={setSideMenu} color="rgba(7, 8, 15, 0.801)">
            <div id="Side-Menu">
              <div id="Back-Container">
                <Icon
                  icon={bxArrowBack}
                  onClick={() => setSideMenu(false)}
                ></Icon>
              </div>

              <div id="Side-Menu-Principal-Info">
                <div id="Img-Container">
                  <ProfileImage
                    width={"80px"}
                    action={() => {
                      history.push("/profile/" + currentUser.uid);
                    }}
                    image={photoURL}
                    alt="Profile Image"
                  />

                  <input id="Input-File" type="file" hidden />
                  <label
                    id="Button-Edit-User-Profile"
                    htmlFor="Input-File"
                  ></label>
                </div>
                <label id="Side-Menu-User-Name">{displayName}</label>
              </div>
              <div id="Container-Items">
                {!match ? (
                  <div className="Side-Menu-Item">
                    <label>Friends</label>
                    <Icon
                      onClick={() =>
                        setPopup(<FriendsPopup setPopup={setPopup} />)
                      }
                      icon={userFriends}
                    ></Icon>
                  </div>
                ) : null}
                <div className="Side-Menu-Item">
                  <label>Advanced</label>
                  <Icon height="22" icon={options16Filled}></Icon>
                </div>
                {currentUser ? (
                  <div
                    className="Side-Menu-Item item-bottom"
                    id="side-menu-logout"
                    onClick={() => logout(currentUser)}
                  >
                    <label>Logout</label>
                  </div>
                ) : (
                  <div
                    className="Side-Menu-Item item-bottom"
                    id="side-menu-login"
                  >
                    <Link to="/auth" className="grey">
                      Login
                    </Link>
                  </div>
                )}

                <input
                  type="checkbox"
                  id="Switch-Check"
                  name="theme"
                  style={{ display: "none" }}
                />

                <label id="Switch" htmlFor="Switch-Check">
                  {/* <svg className = "Moon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93a9.93 9.93 0 0 0 7.07-2.929a10.007 10.007 0 0 0 2.583-4.491a1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343a7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483a10.027 10.027 0 0 0 2.89 7.848a9.972 9.972 0 0 0 7.848 2.891a8.036 8.036 0 0 1-1.484 2.059z" fill="#626262"/></svg> */}
                  {/* <svg className = "Sun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993S6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007S8.993 13.658 8.993 12S10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3z" fill="#626262"/><path d="M4.219 18.363l2.12-2.122l1.415 1.414l-2.12 2.122z" fill="#626262"/><path d="M16.24 6.344l2.122-2.122l1.414 1.414l-2.122 2.122z" fill="#626262"/><path d="M6.342 7.759L4.22 5.637l1.415-1.414l2.12 2.122z" fill="#626262"/><path d="M19.776 18.364l-1.414 1.414l-2.122-2.122l1.414-1.414z" fill="#626262"/></svg> */}
                  <div id="Handle" htmlFor="switchCheck"></div>
                </label>
              </div>
            </div>
          </Background>
        );
      }}
    />
  ) : (
    popup
  );
});

import { Icon } from "@iconify/react";
import useUser from "../hooks/useUser";
import "../styles/Profile.css";
import Circle from "./Circle";
import ProfileImage from "./ProfileImage";

export function Details({ uid }) {
  const dataProfile = useUser(uid).consume;
  const detailsRequired = ["friends", "peopleHelped", "verified"];

  return detailsRequired.map((detail) => {
    const valueDetail = dataProfile[detail];

    return (
      <div key={detail} className="d-flex flex-column">
        <div className="d-flex justify-content-around">
          <p>
            {detail.replace(/[a-z]{1}[A-Z]{1}/, (finded) => {
              return finded[0] + " " + finded[1].toLowerCase();
            })}
          </p>
          <p>{String(valueDetail)}</p>
        </div>
        <hr style={{ height: "1px", width: "100%" }} />
      </div>
    );
  });
}

export default function Profile(props) {
  const { uid } = props.match.params;
  const { photoURL, displayName, email } = useUser(uid).consume;
  const provide = useUser(uid).provide;

  return (
    <div className="Profile">
      <div
        className="Profile-Cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
        }}
      >
        <button>Change Cover</button>
      </div>

      <div className="Profile-Container">
        <div className="Profile-Info">
          <div className="Profile-Principal-Info">
            <div style={{ position: "relative", width: "50%" }}>
              <ProfileImage image={photoURL} width="100%" />

              <input
                accept="image/*"
                onChange={(event) => {
                  const reader = new FileReader();

                  reader.onload = function () {
                    provide({ photoURL: reader.result });
                  };

                  reader.readAsDataURL(event.target.files[0]);
                }}
                id="photoInput"
                type="file"
                hidden
              />
              <label
                style={{ position: "absolute", right: "6%", bottom: "6%" }}
              >
                <Circle htmlFor="photoInput" width="30px" background="grey">
                  <Icon width="70%" icon="bx:bxs-camera" />
                </Circle>
              </label>
            </div>

            <h3>{displayName}</h3>
            <p>{email}</p>
          </div>
          <div className="Profile-Details">
            <hr style={{ height: "1px", width: "100%" }} />
            <Details uid={uid} />
          </div>
        </div>
        <div className="Profile-Auth"></div>
      </div>
    </div>
  );
}

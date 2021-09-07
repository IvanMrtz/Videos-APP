import { Icon } from "@iconify/react";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import userContext from "../context/user-context";
import useForm from "../hooks/useForm";
import useUser from "../hooks/useUser";
import reducerFormAccountSettings from "../reducers/reducerFormAccountSettings";
import Circle from "./Circle";
import Videos from "./VideoContainer";
import ProfileImage from "./ProfileImage";
import "../styles/Profile.css";
import "../styles/FormAccountSettings.css";
import useAuth from "../Auth/hooks/useAuth";
import Media from "./MediaQuery";
import useFirestore from "../hooks/useFirestore";
import { VideoProfileContainer } from "./VideoContainer";
import firebase from "firebase";
import { firestore } from "../firebase/config";

export function AccountSettings(props) {
  const { submit, error } = useForm();
  const { updateEmail, updatePassword } = useAuth();
  const { provide } = props;
  const initialState = {
    displayName: "",
    email: "",
    password: "",
    age: "",
  };
  const [formState, dispatch] = useReducer(
    reducerFormAccountSettings,
    initialState
  );

  const handleInput = (event) => {
    dispatch({
      type: "HANDLE INPUT",
      field: event.target.name,
      payload: event.target.value,
    });
  };

  const clearInputs = () => {
    dispatch({
      type: "CLEAR INPUTS",
      payload: initialState,
    });
  };

  return (
    <div className="Profile-Auth">
      <div className="Form-Account-Settings">
        <div className="Inputs-Account-Settings">
          <div className="Input-Account-Settings">
            <input
              value={formState.displayName}
              name="displayName"
              onChange={handleInput}
              placeholder="Display Name"
            />
          </div>
          <div className="Input-Account-Settings">
            <input
              value={formState.email}
              name="email"
              onChange={handleInput}
              type="email"
              placeholder="Email"
            />
          </div>
          <div className="Input-Account-Settings">
            <input
              value={formState.password}
              name="password"
              onChange={handleInput}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="Input-Account-Settings">
            <input
              value={formState.age}
              name="age"
              onChange={handleInput}
              type="number"
              placeholder="Age"
            />
          </div>
        </div>
        <div className="Inputs-Account-Settings">
          <div className="Input-Account-Settings">
            <input
              value={formState.country}
              name="country"
              onChange={handleInput}
              placeholder="Country"
            />
          </div>
          <div className="Input-Account-Settings">
            <input
              value={formState.city}
              name="city"
              onChange={handleInput}
              placeholder="City"
            />
          </div>
          <div className="Input-Account-Settings">
            <input
              value={formState.street}
              name="street"
              onChange={handleInput}
              placeholder="Street"
            />
          </div>
          <div className="Input-Account-Settings">
            <input
              value={formState.postCode}
              name="postCode"
              onChange={handleInput}
              type="number"
              placeholder="Post Code"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            const toSubmit = Object.assign(
              {},
              { inputsData: formState },
              {
                closeInSubmit: false,
                autoCatchErrorByEmptyFields: false,
                autoCatchErrorByRules: true,
                removeError: 3000,
                ignoreFalseValues: true,
                setInputs: {
                  type: "reducer",
                  handler: clearInputs,
                },
                initialState,
                rulesOfFields: {
                  name: {
                    field: "",
                    rules: [{ maxCharacters: 29 }],
                  },
                  email: "",
                  password: "",
                  age: "",
                },
                clearFieldsOnSubmit: true,
                submits: {
                  email: { submit: updateEmail, onlyData: false },
                  password: { submit: updatePassword, onlyData: false },
                  default: { submit: provide, onlyData: true },
                },
                remove: ["userUID"],
              }
            );
            submit(toSubmit);
          }}
          className="default-button default-button-animation"
        >
          Upload
        </button>
        <p className="error">{error}</p>
      </div>
    </div>
  );
}

export function OwnerVideos(props) {
  const { children, setOwnerVideos, uid } = props;
  const { read } = useFirestore();

  useEffect(() => {
    const unsubSnapshot = read(
      {
        next: (querySnapshot) => {
          console.log("Rendering owner video/s...");

          const updatedVideos = querySnapshot.docs.map((docSnapshot) => {
            return Object.assign(docSnapshot.data());
          });

          setOwnerVideos(updatedVideos);
        },
      },
      uid
    );

    return unsubSnapshot;
  }, []);

  return children;
}

const PublicDetails = forwardRef(function (props, ref) {
  const { uid } = props;
  const { subscribers, age } = useUser(uid).consume;

  return (
    <div ref={ref} className="Public-Details">
      <div className="Public-Detail">
        <p className="grey-lower">Subscribers: </p>
        <p className="linked">{subscribers?.count || "-"}</p>
      </div>
      <hr style={{ height: "1px", width: "100%" }} />
      <div className="Public-Detail">
        <p className="grey-lower">Age: </p>
        <p className="linked">{age || "-"}</p>
      </div>
      <hr style={{ height: "1px", width: "100%" }} />
    </div>
  );
});

export { PublicDetails };

export function UserDetails(props) {
  const { currentUser } = useContext(userContext);
  const { displayName, email, profileCoverRef, profileInfoRef, ownerUID } =
    props;
  const profileDetailsRef = useRef();
  const { consume } = useUser(ownerUID);
  const { subscribers } = consume;
  const [subscribeColor, setSubscribeColor] = useState(
    "var(--color-grey-lower)"
  );
  const [subscribeText, setSubscribeText] = useState("Subscribe");
  const isSubscribed = useCallback(() => {
    if (subscribers) {
      return subscribers.users.find((user) => user.userUID === currentUser.uid);
    }
  }, [subscribers]);

  useEffect(() => {
    if (subscribers) {
      if (!isSubscribed()) {
        setSubscribeColor("var(--color-grey-lower)");
        setSubscribeText("Subscribe");
      } else {
        setSubscribeColor("var(--color-linked)");
        setSubscribeText("Unsubscribe");
      }
    }
  }, [subscribers]);

  const subscribe = useCallback(() => {
    if (currentUser) {
      if (subscribers) {
        if (currentUser.emailVerified) {
          const timestamp =
            firebase.default.firestore.FieldValue.serverTimestamp();
          const subscribersRef = firestore
            .collection("users")
            .doc(ownerUID)
            .collection("subscribers")
            .doc(currentUser.uid);

          if (!isSubscribed()) {
            subscribersRef.set({ createdAt: timestamp });
          } else {
            subscribersRef.delete();
          }
        }
      }
    }
  }, [subscribers, currentUser]);

  useEffect(() => {
    const profileCover = profileCoverRef?.current;
    const profileInfo = profileInfoRef?.current;
    const profileDetails = profileDetailsRef?.current;

    if (profileCover && profileInfo) {
      function resize() {
        const profileCoverHeight = profileCover.getBoundingClientRect().height;
        const photo = profileInfo.querySelector(".user-img");
        const photoHeight = photo.clientHeight;

        profileInfo.style.top = `${profileCoverHeight - photoHeight / 2}px`;
        profileDetails.style.top = `${profileCoverHeight + photoHeight / 6}px`;
      }

      window.addEventListener("resize", resize);
      resize();

      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [
    profileCoverRef.current,
    profileInfoRef.current,
    profileDetailsRef.current,
  ]);

  return (
    <Media
      query="(max-width: 380px)"
      render={(match) => {
        return (
          <div ref={profileDetailsRef} className="User-Details">
            <h2 className="grey">{displayName}</h2>
            <h6 className="grey-lower">{email}</h6>
            <div className="User-Secondary-Details">
              <div className="User-Secondary-Detail">
                <Icon icon="akar-icons:location" />
                <p>Argentina.</p>
              </div>
            </div>
            <div className="User-Follows">
              <button
                id="Icon-Button-Animation"
                className="default-button default-button-animation"
                style={{ background: "var(--color-grey-lower)" }}
              >
                {match ? <Icon icon="akar-icons:person-add" /> : "Add Friend"}
              </button>
              <button
                onClick={() => subscribe()}
                className="default-button default-button-animation"
                style={{ background: subscribeColor }}
              >
                {subscribeText}
              </button>
            </div>
          </div>
        );
      }}
    />
  );
}

export default function Profile(props) {
  const { uid } = props.match.params;
  const { currentUser } = useContext(userContext);
  const { photoURL, displayName, email } = useUser(uid).consume;
  const provide = useUser(uid).provide;
  const profileCoverRef = useRef();
  const profileInfoRef = useRef();
  const profileDetailsRef = useRef();
  const profileImageRef = useRef();
  const [ownerVideos, setOwnerVideos] = useState();
  const userDetails = (
    <UserDetails
      profileCoverRef={profileCoverRef}
      profileInfoRef={profileInfoRef}
      displayName={displayName}
      email={email}
      ownerUID={uid}
    />
  );

  return (
    <>
      <Media
        query="(max-width: 500px)"
        render={(match) => {
          return (
            <div className="Profile">
              <div
                className="Profile-Cover"
                ref={profileCoverRef}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
                }}
              ></div>

              <div className="Profile-Container">
                <div ref={profileInfoRef} className="Profile-Info">
                  <ProfileImage
                    ref={profileImageRef}
                    image={photoURL}
                    width="200px"
                    height="200px"
                  />

                  <input
                    accept="image/*"
                    onChange={(event) => {
                      if (currentUser.emailVerified) {
                        const reader = new FileReader();

                        reader.onload = function () {
                          provide({ photoURL: reader.result });
                        };

                        reader.readAsDataURL(event.target.files[0]);
                      }
                    }}
                    id="photoInput"
                    type="file"
                    hidden
                  />

                  <div className="Profile-Details">
                    {match ? userDetails : null}
                    <hr style={{ height: "1px", width: "100%" }} />
                    <PublicDetails ref={profileDetailsRef} uid={uid} />

                    <OwnerVideos uid={uid} setOwnerVideos={setOwnerVideos}>
                      <VideoProfileContainer
                        profileImageRef={profileImageRef}
                        profileDetailsRef={profileDetailsRef}
                      >
                        <Videos ownerUID={uid} videos={ownerVideos} />
                      </VideoProfileContainer>
                    </OwnerVideos>
                  </div>
                </div>
                {/* <AccountSettings provide={provide} /> */}
              </div>
              {!match ? userDetails : null}
            </div>
          );
        }}
      />
    </>
  );
}
{
  /* <div style={{ position: "relative" }}> */
}

{
  /* <label className="Camera-Input">
                <Circle htmlFor="photoInput" width="30px" background="grey">
                  <Icon width="70%" icon="bx:bxs-camera" />
                </Circle>
              </label> */
}
{
  /* </div> */
}

{
  /* <h3 className="grey">{displayName}</h3>
            <p className="grey-lower">{email}</p> */
}

import { Icon } from "@iconify/react";
import { useContext, useReducer, useState } from "react";
import userContext from "../context/user-context";
import useForm from "../hooks/useForm";
import useUser from "../hooks/useUser";
import reducerFormAccountSettings from "../reducers/reducerFormAccountSettings";
import Circle from "./Circle";
import ProfileImage from "./ProfileImage";
import "../styles/Profile.css";
import "../styles/FormAccountSettings.css";
import useAuth from "../Auth/hooks/useAuth";

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

export function Details({ uid }) {
  const dataProfile = useUser(uid).consume;
  const detailsRequired = ["friends", "peopleHelped", "age"];

  return detailsRequired.map((detail) => {
    const valueDetail = dataProfile[detail];

    return (
      <div key={detail} className="d-flex flex-column">
        <div className="d-flex justify-content-around">
          <p className="grey-lower">
            {detail.replace(/[a-z]{1}[A-Z]{1}/, (finded) => {
              return finded[0] + " " + finded[1].toLowerCase();
            })}
          </p>
          <p className="linked">{String(valueDetail)}</p>
        </div>
        <hr style={{ height: "1px", width: "100%" }} />
      </div>
    );
  });
}

export default function Profile(props) {
  const { uid } = props.match.params;
  const { currentUser } = useContext(userContext);
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
        {currentUser.uid === uid ? (
          <div className="Change-Cover">
            <Icon width="70%" icon="bx:bxs-camera" />
            <p>Change Cover</p>
          </div>
        ) : (
          <div className="Social-Interactions">
            <button
              className="default-button default-button-animation"
              onClick={() => {
                
              }}
            >
              Subscribe
            </button>
            <div className="Send-Friend-Request">
              <Icon
                height="100%"
                width="10%"
                icon="ant-design:user-add-outlined"
              />
              <p>Send friend request</p>
            </div>
          </div>
        )}
      </div>

      <div className="Profile-Container">
        <div className="Profile-Info">
          <div className="Profile-Principal-Info">
            <div style={{ position: "relative" }}>
              <ProfileImage image={photoURL} width="110px" />

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
              <label className="Camera-Input">
                <Circle htmlFor="photoInput" width="30px" background="grey">
                  <Icon width="70%" icon="bx:bxs-camera" />
                </Circle>
              </label>
            </div>

            <h3 className="grey">{displayName}</h3>
            <p className="grey-lower">{email}</p>
          </div>
          <div className="Profile-Details">
            <hr style={{ height: "1px", width: "100%" }} />
            <Details uid={uid} />
          </div>
        </div>
        <AccountSettings provide={provide} />
      </div>
    </div>
  );
}

import React, { useState } from "react";
import Media from "../../components/MediaQuery";
import Forms from "../../utilities/Forms/Forms";
import { withRouter } from "react-router";
import useAuth from "../hooks/useAuth";
import Login from "./Login";
import Register from "./Register";
import FormAuth from "./FormAuth";

export default withRouter(function (props) {
  const [stateFormAuth, setStateFormAuth] = useState("Login");
  const { login, register } = useAuth(props);

  const [inputs, setInputs] = useState([
    {
      Component: Login,
      name: "Login",
      closeInSubmit: false,
      autoCatchErrorByEmptyFields: true,
      autoCatchErrorByRules: false,
      removeError: 3000,
      submits: {
        default: { submit: login },
      },
      data: {
        initial: {
          email: "",
          password: "",
        },
      },
    },
    {
      Component: Register,
      name: "Register",
      closeInSubmit: false,
      autoCatchErrorByEmptyFields: true,
      autoCatchErrorByRules: true,
      removeError: 3000,
      submits: {
        default: { submit: register },
      },
      data: {
        initial: {
          email: {
            field: "",
            rules: [{ maxCharacters: 320 }],
          },
          displayName: {
            field: "",
            rules: [{ minCharacters: 2, maxCharacters: 10 }],
          },
          password: {
            field: "",
            rules: [{ maxCharacters: 30 }],
          },
          repeatPassword: "",
          age: {
            field: "",
            rules: [{ maxCharacters: 3 }],
          },
        },
      },
    },
  ]);

  return (
    <Media
      query="(min-width: 700px)"
      render={(match) => (
        <div className="Auth-Container">
          {match ? (
            <div className="Form-Img-Container">
              <img src="undraw_dreamer_gxxi.svg" />
            </div>
          ) : null}

          <Forms
            formState={[stateFormAuth, setStateFormAuth]}
            structure={(data, inputs) => {
              return (
                <FormAuth
                  setStateFormAuth={setStateFormAuth}
                  allData={data}
                  inputs={inputs}
                />
              );
            }}
            inputs={inputs}
          />
        </div>
      )}
    ></Media>
  );
});

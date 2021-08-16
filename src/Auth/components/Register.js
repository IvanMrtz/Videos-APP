import { useEffect, useState } from "react";

export default function (props) {
  const { statex } = props;
  const [inputs, setInputs] = useState(statex.inputs);
  
  useEffect(() => {
    statex.setInputs((state) => ({ ...state, inputs }));
  }, [inputs]);

  return (
    <>
      <div className="Form-Input-Div">
        <input
          autoComplete="off"
          className="Form-Input"
          value={inputs.email}
          name="email"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Email"
        />
      </div>
      <div className="Form-Input-Div">
        <input
          autoComplete="off"
          className="Form-Input"
          value={inputs.password}
          type="password"
          name="password"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Password"
        />
      </div>
      <div className="Form-Input-Div">
        <input
          autoComplete="off"
          className="Form-Input"
          value={inputs.repeatPassword}
          type="password"
          name="repeatPassword"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Repeat password"
        />
      </div>
      <div className="Form-Input-Div">
        <input
          autoComplete="off"
          className="Form-Input"
          value={inputs.age}
          name="age"
          type="number"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Age"
        />
      </div>
    </>
  );
}

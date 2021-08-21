import "../styles/FormAuth.css";

export default function (props) {
  const { allData, inputs, setStateFormAuth } = props;
  const target = allData.target;

  return (
    <div className="Form-Auth">
      <div className="d-flex align-items-center flex-column">
        <img className="User-Welcome" src="undraw_male_avatar_323b.svg" />
        <h3 className="linked">Welcome!</h3>
      </div>

      <div className="Inputs-Auth-Container">{target}</div>

      <div className="Form-Auth-Bottom">
        <p
          onClick={() =>
            setStateFormAuth((state) =>
              state == "Login" ? "Register" : "Login"
            )
          }
          className="linked"
        >
          {allData.name == "Login" ? "Register now!" : "Back"}
        </p>
        <button
          className="default-button default-button-animation"
          onClick={() => {
            const data = Object.assign(inputs, allData.externalData);
            target.props.onSubmit(data);
          }}
        >
          {allData.name}
        </button>

        <div className="error">{allData.manage.error}</div>
      </div>
    </div>
  );
}

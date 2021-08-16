import "../styles/FormAuth.css";

export default function (props) {
  const { allData, inputs, setStateFormAuth } = props;
  const target = allData.target;

  return (
    <div className="Form-Auth">
      <img className="User-Welcome" src="undraw_male_avatar_323b.svg" />
      <h3 className="linked">Welcome!</h3>

      <div className="flex-column column-2">{target}</div>

      <p
        onClick={() =>
          setStateFormAuth((state) => (state == "Login" ? "Register" : "Login"))
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
  );
}

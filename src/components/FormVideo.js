import Background from "./Background";

export default function (props) {
  const { allData, inputs, setStateFormVideo } = props;
  const target = allData.target;

  return (
    <Background
      scrollable={true}
      centered={true}
      setClose={setStateFormVideo}
      color="rgba(7, 8, 15, 0.801)"
    >
      <div className="Form">
        <h3 className="Form-Title linked">
          {allData.name} your explanation 🚀
        </h3>

        {target}

        <div className="footer">
          <div className="left">
            <button
              className="Normal-Button"
              onClick={() => setStateFormVideo(null)}
            >
              Back
            </button>
            <button
              className="Normal-Button"
              onClick={() => setStateFormVideo(null)}
            >
              Cancel
            </button>
          </div>
          <div className="right">
            <button
              className="default-button default-button-animation"
              onClick={() => {
                const data = Object.assign(inputs, allData.externalData);
                target.props.onSubmit(data);
              }}
            >
              {allData.name} video
            </button>
          </div>
        </div>
        <div className="error">{allData.manage.error}</div>
      </div>
    </Background>
  );
}

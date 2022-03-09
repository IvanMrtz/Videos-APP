import "../styles/InfoChallengesPanel.css";
import AddNote from "./AddNote";
import Section from "./Section";
import Media from "./MediaQuery";

export default function (props) {
  const { setVideos } = props;

  return (
    <Media
      query="(min-width: 850px)"
      render={(match) => {
        return (
          <Media
            query="(min-width: 650px)"
            render={(match2) => {
              const styleInfoChallengesPanel = {
                width: "300px",
                height: "250px",
                borderRadius: "10px",
                position: "relative",
                background: "var(--color-grey-background)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              };

              const styleCircleExp = {
                display: "none",
              }

              const styleLineExp = {
                display: "none",
              }

              function changeStyles(apply, match) {
                if (!match) apply();
              }

              changeStyles(() => {
                styleInfoChallengesPanel.height = "150px";
              }, match);

              changeStyles(() => {
                styleInfoChallengesPanel.width = "100%";
                styleInfoChallengesPanel.marginBottom = "30px";
              }, match2);

              if(!match2) {
                styleLineExp.display = "block";
              }else {
                styleCircleExp.display = "block";
              }

              return (
                <div style={styleInfoChallengesPanel}>
                  <div className="d-flex justify-content-around">
                    <Section setVideos={setVideos} />
                    <AddNote />
                  </div>
                </div>
              );
            }}
          />
        );
      }}
    />
  );
}

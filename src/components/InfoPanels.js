import InfoUserPanel from "./InfoUserPanel";
import InfoChallengesPanel from "./InfoChallengesPanel";
import Media from "./MediaQuery";

export default function (props) {
  const { setVideos, mobile, setMobile, videosContainer } = props;

  return (
    <Media
      query="(min-width: 850px)"
      render={(match) => {
        return (
          <Media
            query="(min-width: 650px)"
            render={(match2) => {
              const styleInfoPanelContainer = {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              };

              const styleInfoUserPanelContainer = {
                height: "220px",
                justifyContent: "inherit",
                display: "flex",
                flexDirection: "column",
              };

              function changeStyles(apply, match) {
                if (!match) apply();
              }

              changeStyles(() => {
                delete styleInfoPanelContainer.flexDirection;
                styleInfoPanelContainer.width = "100%";
                styleInfoPanelContainer.height = "200px";
              }, match);

              changeStyles(() => {
                setMobile(false);
              }, match);

              changeStyles(() => {
                styleInfoPanelContainer.flexWrap = "wrap";
                styleInfoPanelContainer.width = "100%";
                styleInfoPanelContainer.height = "100%";
              }, match2);

              changeStyles(() => {
                styleInfoUserPanelContainer.width = "100%";
              }, match2);

              changeStyles(() => {
                setMobile(true);
              }, match2);

              return (
                <div style={styleInfoPanelContainer}>
                  <div style={styleInfoUserPanelContainer}>
                    <h2 className="grey">Comunity videos</h2>
                    <InfoUserPanel />
                  </div>

                  <InfoChallengesPanel setVideos={setVideos} />

                  {mobile ? videosContainer : null}
                </div>
              );
            }}
          />
        );
      }}
    />
  );
}

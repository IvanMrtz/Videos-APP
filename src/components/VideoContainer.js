import "../styles/VideoContainer.css";
import { memo, useContext } from "react";
import PreviewVideo from "./PreviewVideo";
import Scroll from "./Scroll";
import { sectionContext, videosContext } from "./Main";
import Media from "./MediaQuery";

export default memo(function ({ setStateFormVideo, setInputs }) {
  const { videos } = useContext(videosContext);
  const { section } = useContext(sectionContext);

  if (typeof videos === "undefined" || videos === null) {
    return <h3 className="waiting linked">Wait...</h3>;
  }

  if (!videos.length) {
    return (
      <div className="Empty-Container">
        <img width="350" src="undraw_empty_xct9.svg" alt="" />
        <p className="text-center grey-lower">
          {section === "MyVideos"
            ? "You don't currently have any video"
            : "No existing videos, be the first to create one!"}
        </p>
      </div>
    );
  }

  return (
    <Media
      query="(min-width: 850px)"
      render={(match) => {
        return (
          <Media
            query="(min-width: 650px)"
            render={(match2) => {
              const styleVideoContainer = {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                height: "inherit",
              };

              function changeStyles(apply, match) {
                if (!match) apply();
              }

              changeStyles(() => {
                styleVideoContainer.height = "500px";
              }, match);

              changeStyles(() => {
                styleVideoContainer.height = "auto";
              }, match2);

              const videosMap = videos.map((video) => {
                if (video.active) {
                  return (
                    <PreviewVideo
                      key={video.idVideo}
                      setInputs={setInputs}
                      setStateFormVideo={setStateFormVideo}
                      views={3}
                      {...video}
                    />
                  );
                } else {
                  return null;
                }
              });

              return (
                <>
                  {match ? (
                    <Scroll className="Videos-Container" distance="30px">
                      {videosMap}
                    </Scroll>
                  ) : (
                    <div style={styleVideoContainer}>{videosMap}</div>
                  )}
                </>
              );
            }}
          />
        );
      }}
    />
  );
});

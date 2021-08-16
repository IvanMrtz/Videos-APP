import "../styles/VideoContainer.css";
import { memo, useContext } from "react";
import PreviewVideo from "./PreviewVideo";
import Scroll from "./Scroll";
import { videosContext } from "./Main";

export default memo(function ({ setStateFormVideo, setInputs }) {
  const { videos } = useContext(videosContext);

  if (typeof videos === "undefined" || videos === null) {
    return <h3 className="waiting linked">Wait...</h3>;
  }

  if (!videos.length) {
    return (
      <div className="Empty-Container">
        <img width="350" src="undraw_empty_xct9.svg" alt="" />
        <p className="text-center grey-lower">
          You don't currently have any video
        </p>
      </div>
    );
  }

  return (
    <Scroll className="Videos-Container" distance="30px">
      {videos.map((video) => {
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
      })}
    </Scroll>
  );
});

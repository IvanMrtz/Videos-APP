import "../styles/VideoContainer.css";
import { memo, useContext, useEffect, useRef } from "react";
import PreviewVideo from "./PreviewVideo";
import Scroll from "./Scroll";
import Media from "./MediaQuery";
import { useLocation } from "react-router-dom";
import userContext from "../context/user-context";

export function VideoProfileContainer(props) {
  const { children, profileDetailsRef, profileImageRef } = props;
  const videosProfileRef = useRef();

  useEffect(() => {
    const videosProfile = videosProfileRef?.current;
    const profileDetails = profileDetailsRef?.current;
    const profileImage = profileImageRef?.current;

    if (videosProfile && profileDetails && profileImage) {
      function resize() {
        const profileDetailsHeight =
          profileDetails.getBoundingClientRect().height;
        const profileImageHeight = profileImage.getBoundingClientRect().height;
        const videosProfileHeight =
          videosProfile.getBoundingClientRect().height;
        videosProfile.style.top = `${
          profileDetailsHeight + 170 + profileImageHeight
        }px`;
      }

      window.addEventListener("resize", resize);
      resize();

      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [
    videosProfileRef.current,
    profileDetailsRef.current,
    profileImageRef.current,
  ]);

  return (
    <div ref={videosProfileRef} className="Videos-Profile-Container">
      {children}
    </div>
  );
}

export function VideoMainContainer(props) {
  const { children } = props;

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

              return (
                <>
                  {match ? (
                    <Scroll className="Videos-Main-Container" distance="30px">
                      {children}
                    </Scroll>
                  ) : (
                    <div style={styleVideoContainer}>{children}</div>
                  )}
                </>
              );
            }}
          />
        );
      }}
    />
  );
}

export default memo(
  function (props) {
    const { videos, ownerUID } = props;
    const { pathname } = useLocation();
    const isProfileScreen = pathname.match(/profile/);
    const { currentUser } = useContext(userContext);
    const emptyContainerStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      height: isProfileScreen ? "100px" : "400px",
      width: "100%",
    };

    if (!videos?.length) {
      return (
        <div className="Empty-Container" style={emptyContainerStyle}>
          <div className="d-flex justify-content-center">
            {!isProfileScreen ? (
              <img width="350" src="undraw_empty_xct9.svg" alt="" />
            ) : null}
          </div>
          <p className="text-center grey-lower">
            {isProfileScreen
              ? ownerUID === currentUser?.uid
                ? "You don't currently have any video"
                : "This user has no content"
              : "No existing videos, be the first to create one!"}
          </p>
        </div>
      );
    }
    console.log("Rendering single preview video...")

    return videos.map((video) => {
      if (video.active || typeof video.active === "undefined") {
        return <PreviewVideo key={video.idVideo} {...video} />;
      } else {
        return null;
      }
    });
  },
  function areEqual(prevProps, nextProps) {
    if (prevProps.videos && nextProps.videos) {
      return prevProps.videos.some((prevVideo, idx) => {
        const nextVideo = nextProps.videos[idx]
        return (
          prevVideo.likes.count !== nextVideo.likes.count ||
          prevVideo.createdAt.seconds === nextVideo.createdAt.seconds
        );
      });
    }
  }
);

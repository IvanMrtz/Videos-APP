import useFirestore from "../hooks/useFirestore";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import InfoPanels from "./InfoPanels";
import SideMenu from "./SideMenu";
import Videos from "./VideoContainer";
import { VideoMainContainer } from "./VideoContainer";
import TopBar from "./TopBar";
import FriendContainer, { Friends } from "./Friends";
import "../styles/Main.css";
import userContext from "../context/user-context";
import Popup from "./Popup";
import Media from "./MediaQuery";
import concatDocs from "../utilities/ConcatDocs/concatDocs";

export function AllVideos(props) {
  const { children, setVideos } = props;
  const [changes, setChanges] = useState(false);
  const { readAllVideos } = useFirestore();
  
  useEffect(() => {
    const observer = {
      next: (querySnapshot) => {
        let promises = [];

        querySnapshot.docs.map((el) => {
          promises.push(
            new Promise((res) => {
              el.ref.collection("videos").onSnapshot({
                next: (querySnapshot) => {
                  const videos = querySnapshot.docs.map((docSnapshot) => {
                    return Object.assign(docSnapshot.data(), {
                      active: true,
                    });
                  });

                  // Horrible
                  if (promises === "finished") {
                    setChanges((previous) => !previous);
                  } else {
                    res(videos);
                  }
                },
              });
            })
          );
        });
        Promise.all(promises).then((videos) => {
          if (promises !== "finished") {
            promises = "finished";
            setVideos(concatDocs(videos));
          }
        });
      },
    };

    const unsubSnapshot = readAllVideos(observer);

    return unsubSnapshot;
  }, [changes]);

  return children;
}

export function Main() {
  const { currentUser } = useContext(userContext);
  const [videos, setVideos] = useState(null);
  const [sideMenu, setSideMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [refPopup, setRefPopup] = useState();
  const [refMainContainer, setRefMainContainer] = useState();
  const videosContainer = (
    <AllVideos setVideos={setVideos}>
      <VideoMainContainer>
        <Videos videos={videos} />
      </VideoMainContainer>
    </AllVideos>
  );

  useEffect(() => {
    const node = refMainContainer;

    if (refPopup && node) {
      node.addEventListener("touchmove", (event) => {
        if (
          Math.round(node.scrollTop) + 50 >=
          node.scrollHeight - Math.round(node.getBoundingClientRect().height)
        ) {
          refPopup.style.opacity = "0";
        } else {
          refPopup.style.opacity = "1";
        }
      });
    }
  }, [refPopup, refMainContainer]);

  return (
    <>
      {!currentUser.emailVerified ? (
        <Popup
          ref={setRefPopup}
          message="Atention: You do not have verified email. Please check it out for a better experience."
          background="var(--color-grey-background-ligth)"
          color="var(--color-grey)"
        />
      ) : null}
      {sideMenu ? <SideMenu setSideMenu={setSideMenu} /> : null}

      <div className="Main-Container">
        <TopBar
          videos={videos}
          setVideos={setVideos}
          setSideMenu={setSideMenu}
        />

        <Media
          query="(min-width: 850px)"
          render={(match) => {
            return (
              <Media
                query="(min-width: 650px)"
                render={(match2) => {
                  const styleMainContainer = {
                    height: "530px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  };
                  function changeStyles(apply, match) {
                    if (!match) apply();
                  }
                  changeStyles(() => {
                    styleMainContainer.height = "100%";
                    styleMainContainer.flexWrap = "wrap";
                  }, match);

                  changeStyles(() => {
                    styleMainContainer.overflow = "scroll";
                    styleMainContainer.overflowX = "hidden";
                  }, match2);

                  return (
                    <div ref={setRefMainContainer} style={styleMainContainer}>
                      <InfoPanels
                        mobile={mobile}
                        videosContainer={videosContainer}
                        setMobile={setMobile}
                        setVideos={setVideos}
                      />

                      {!mobile ? videosContainer : null}

                      <Media
                        query="(min-width: 850px)"
                        render={(match) => {
                          return <FriendContainer>{match ? <Friends /> : null}</FriendContainer>;
                        }}
                      />
                    </div>
                  );
                }}
              />
            );
          }}
        />
      </div>
    </>
  );
}

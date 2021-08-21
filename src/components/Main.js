import useFirestore from "../hooks/useFirestore";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import Forms from "../utilities/Forms/Forms";
import Form from "./Form";
import InfoPanels from "./InfoPanels";
import SideMenu from "./SideMenu";
import VideoContainer from "./VideoContainer";
import TopBar from "./TopBar";
import FormVideo from "./FormVideo";
import MultipleComponents from "../utilities/MultipleComponents/MultipleComponents";
import Component from "../utilities/MultipleComponents/Component";
import Friends from "./Friends";
import "../styles/Main.css";
import userContext from "../context/user-context";
import Popup from "./Popup";
import Media from "./MediaQuery";

const videosContext = React.createContext();
const sectionContext = React.createContext();
export { videosContext, sectionContext };

export function AllVideos(props) {
  const { children } = props;
  const { setVideos } = useContext(videosContext);
  const [changes, setChanges] = useState(false);

  const { readAllVideos } = useFirestore();

  useEffect(() => {
    function concatVideos(videos) {
      let flatVideos = videos.filter((video) => !!video.length);

      if (flatVideos.length) {
        flatVideos = flatVideos.reduce((acc, el) => {
          return acc.concat(el);
        });
      }

      return flatVideos;
    }

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
            setVideos(concatVideos(videos));
          }
        });
      },
    };

    const unsubSnapshot = readAllVideos(observer);

    return unsubSnapshot;
  }, [changes]);

  return children;
}

export function MyVideos(props) {
  const { children } = props;
  const { setVideos } = useContext(videosContext);
  const { read } = useFirestore();

  useEffect(() => {
    const unsubSnapshot = read({
      next: (querySnapshot) => {
        console.log("Rendering my video/s...");

        const updatedVideos = querySnapshot.docs.map((docSnapshot) => {
          return Object.assign(docSnapshot.data(), { active: true });
        });

        setVideos(updatedVideos);
      },
    });

    return unsubSnapshot;
  }, []);

  return children;
}

export function Main() {
  const { currentUser } = useContext(userContext);
  const { update, add } = useFirestore("users");
  const [videos, setVideos] = useState(null);
  const [stateFormVideo, setStateFormVideo] = useState("");
  const [sideMenu, setSideMenu] = useState(false);
  const [section, setSection] = useState("MyVideos");
  const [inputs, setInputs] = useState([
    {
      Component: Form,
      name: "Create",
      closeInSubmit: true,
      autoCatchErrorByEmptyFields: true,
      autoCatchErrorByRules: true,
      removeError: 3000,
      submits: {
        default: { submit: add },
      },
      data: {
        initial: {
          title: {
            field: "",
            rules: [{ maxCharacters: 29 }],
          },
          color: "",
          fileVideo: "",
          fileThumbnail: "",
          description: {
            field: "",
            rules: [{ maxCharacters: 500 }],
          },
          category: {
            field: "",
            rules: [{ maxCharacters: 20 }],
          },
        },
        external: function () {
          return {
            idVideo: String(Date.now()),
            userUID: currentUser.uid,
          };
        },
      },
    },
    {
      Component: Form,
      name: "Edit",
      closeInSubmit: true,
      autoCatchErrorByEmptyFields: false,
      autoCatchErrorByRules: true,
      submits: {
        default: { submit: update },
      },
      removeError: 3000,
      data: {
        initial: {
          title: {
            field: "",
            rules: [{ maxCharacters: 29 }],
          },
          fileVideo: "",
          fileThumbnail: "",
          color: "",
          description: {
            field: "",
            rules: [{ maxCharacters: 500 }],
          },
          category: {
            field: "",
            rules: [{ maxCharacters: 20 }],
          },
        },
      },
    },
  ]);
  const sectionProvider = useMemo(() => ({ section, setSection }), [section]);
  const videosProvider = useMemo(() => ({ videos, setVideos }), [videos]);
  const [mobile, setMobile] = useState(false);
  const [refPopup, setRefPopup] = useState();
  const [refMainContainer, setRefMainContainer] = useState();

  useEffect(() => {
    const node = refMainContainer;

    if (refPopup && node) {
      node.addEventListener("touchmove", (event) => {
        if (
          Math.round(node.scrollTop) + 50 >=
          node.scrollHeight -
            Math.round(node.getBoundingClientRect().height)
        ) {
          refPopup.style.opacity = "0";
        } else {
          refPopup.style.opacity = "1";
        }
      });
    }
  }, [refPopup, refMainContainer]);

  const videosContainer = (
    <MultipleComponents section={section}>
      <Component
        render={() => {
          return (
            <MyVideos>
              <VideoContainer
                setStateFormVideo={setStateFormVideo}
                setInputs={setInputs}
              />
            </MyVideos>
          );
        }}
        section="MyVideos"
      />
      <Component
        render={() => {
          return (
            <AllVideos>
              <VideoContainer
                setStateFormVideo={setStateFormVideo}
                setInputs={setInputs}
              />
            </AllVideos>
          );
        }}
        section="AllVideos"
      />
    </MultipleComponents>
  );

  return (
    <>
      <sectionContext.Provider value={sectionProvider}>
        <videosContext.Provider value={videosProvider}>
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
            <TopBar setSideMenu={setSideMenu} />

            <Forms
              formState={[stateFormVideo, setStateFormVideo]}
              structure={(data, inputs) => {
                return (
                  <FormVideo
                    setStateFormVideo={setStateFormVideo}
                    allData={data}
                    inputs={inputs}
                  />
                );
              }}
              inputs={inputs}
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
                      }, match2);

                      return (
                        <div
                          ref={setRefMainContainer}
                          style={styleMainContainer}
                        >
                          <InfoPanels
                            mobile={mobile}
                            videosContainer={videosContainer}
                            setMobile={setMobile}
                            setStateFormVideo={setStateFormVideo}
                          />

                          {!mobile ? videosContainer : null}

                          <Media
                            query="(min-width: 850px)"
                            render={(match) => {
                              return <>{match ? <Friends /> : null}</>;
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
        </videosContext.Provider>
      </sectionContext.Provider>
    </>
  );
}

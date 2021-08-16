import useFirestore from "../hooks/useFirestore";
import React, { useContext, useEffect } from "react";
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

const VideosContext = React.createContext();
export { VideosContext };

export function AllVideos(props) {
  const { children } = props;
  const { setVideos } = useContext(VideosContext);
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
  const { setVideos } = useContext(VideosContext);
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
  const [section, setSection] = useState("AllVideos");
  const [inputs, setInputs] = useState([
    {
      Component: Form,
      name: "Create",
      closeInSubmit: true,
      autoCatchErrorByEmptyFields: true,
      autoCatchErrorByRules: true,
      removeError: 3000,
      onSubmit: add,
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
          return { idVideo: String(Date.now()), userUID: currentUser.uid };
        },
      },
    },
    {
      Component: Form,
      name: "Edit",
      closeInSubmit: true,
      autoCatchErrorByEmptyFields: false,
      autoCatchErrorByRules: true,
      onSubmit: update,
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

  return (
    <>
      <VideosContext.Provider value={{ videos, setVideos }}>
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
          <div className="Main-Principal">
            <InfoPanels
              section={section}
              setStateFormVideo={setStateFormVideo}
            />

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

            <Friends />
          </div>
        </div>
      </VideosContext.Provider>
    </>
  );
}

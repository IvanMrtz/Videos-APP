import { useEffect, useState, useContext, useRef, useCallback } from "react";
import userContext from "../context/user-context";
import useStorage from "../hooks/useStorage";
import Background from "./Background";
import "../styles/Video.css";
import ProfileImage from "./ProfileImage";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import useMessage from "../hooks/useMessage";
import Scroll from "./Scroll";
import useUser from "../hooks/useUser";
import { withRouter } from "react-router";
import useFirestore from "../hooks/useFirestore";
import Media from "./MediaQuery";
import { useLocation, useParams } from "react-router-dom";
import { auth } from "../firebase/config";

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: "50%",
  },
  end: {
    y: "150%",
  },
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut",
};

export const Message = withRouter(function (props) {
  const { message, photo, name, history, userUID } = props;

  return (
    <>
      <div className="Video-Comment-Container">
        <ProfileImage
          action={() => {
            history.push("/profile/" + userUID);
          }}
          width="15%"
          height="15%"
          image={photo}
          alt="Profile Image"
        />

        <div className="Video-Comment-Content">
          <p className="Video-Comment-Name">{name}</p>
          <p className="Video-Comment-Text">{message}</p>
        </div>
      </div>
    </>
  );
});

export function VideoChat({ idVideo, userUID }) {
  const { userData, currentUser } = useContext(userContext);
  const { photoURL, displayName } = userData;
  const { messages, writeMessage } = useMessage({ idVideo, userUID });
  const inputMessage = useRef(null);
  const sendRef = useRef(null);
  const autoScroll = useRef(null);

  useEffect(() => {
    if (inputMessage.current) {
      inputMessage.current.addEventListener("keyup", (event) => {
        if (event.keyCode == 13) {
          sendRef.current.click();
        }
      });
    }
  }, [inputMessage]);

  useEffect(() => {
    if (autoScroll.current)
      autoScroll.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="Video-Chat-Container">
      <div className="Video-Chat-Top">
        <h2 className="Video-Chat-Title">Video chat</h2>
      </div>

      <Scroll className="Video-Comments" distance="10px">
        {messages.length
          ? messages.map((message) => {
              return <Message key={message.id} {...message} />;
            })
          : null}
        <div ref={autoScroll}></div>
      </Scroll>

      <div className="Video-Chat-Bottom">
        <input
          ref={inputMessage}
          placeholder="Write your message"
          className="Video-Chat-Input"
          type="text"
        />
        <label
          ref={sendRef}
          onClick={() => {
            if (currentUser.emailVerified) {
              const data = {
                photo: photoURL,
                name: displayName,
                message: inputMessage.current.value,
                userUID: currentUser.uid,
              };

              writeMessage(data).then(() => {
                if (autoScroll.current)
                  autoScroll.current.scrollIntoView({ behavior: "smooth" });
              });
              inputMessage.current.value = "";
            }
          }}
          className="Video-Chat-Send"
        >
          <Icon icon="carbon:send-alt-filled" />
        </label>
      </div>
    </div>
  );
}

// see: https://overreacted.io/a-complete-guide-to-useeffect/
export default function () {
  const { currentUser } = useContext(userContext);
  const { state } = useLocation();
  const { userUID } = state;
  const { id: idVideo } = useParams();
  const [src, setSrc] = useState();
  const ownerData = useUser(userUID);
  const { displayName, photoURL } = ownerData.consume;
  const { getDownloadURL } = useStorage();
  const { update: _update, readSingleVideo } = useFirestore();
  const [likeColor, setLikeColor] = useState("white");
  const [videoData, setVideoData] = useState({
    views: null,
    likes: null,
    description: null,
    title: null,
  });
  const { views, likes, description, title } = videoData;

  const isLiked = useCallback(() => {
    if (likes) return likes.likings.find((uid) => uid === currentUser.uid);
  }, [likes]);

  const update = useCallback((toUpdate) => {
    _update(Object.assign({ idVideo, userUID }, toUpdate));
  }, [currentUser]);

  const like = useCallback(() => {
    if (currentUser) {
      if (likes) {
        if (currentUser.emailVerified) {
          if (!isLiked()) {
            setLikeColor("#ff4e6d");

            update({
              likes: {
                likings: likes.likings.concat([currentUser.uid]),
                count: likes.count + 1,
              },
            });
          } else {
            setLikeColor("grey");

            update({
              likes: {
                likings: likes.likings.filter((uid) => uid !== currentUser.uid),
                count: likes.count - 1,
              },
            });
          }
        }
      }
    }
  }, [likes, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const unsubSnapshot = readSingleVideo(
        {
          next: (querySnapshot) => {
            console.log("Rendering single video...");
            const updatedVideoData = querySnapshot.docs.map((docSnapshot) => {
              return docSnapshot.data();
            });

            setVideoData(
              updatedVideoData.find((video) => video.userUID === userUID)
            );
          },
        },
        currentUser.uid
      );

      return unsubSnapshot;
    }
  }, [currentUser]);

  useEffect(() => {
    if (isLiked()) {
      setLikeColor("#ff4e6d");
    } else {
      setLikeColor("grey");
    }
  }, [likes]);

  useEffect(() => {
    getDownloadURL(["videos", userUID, idVideo]).then((url) => {
      setSrc(url);
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (views) {
        const now = Date.now();
        const actualViewer = views.viewers.find(({ userUID }) => {
          return userUID === currentUser.uid;
        });

        if (currentUser.uid) {
          if (currentUser.emailVerified) {
            if (!actualViewer) {
              update({
                views: {
                  viewers: views.viewers.concat([
                    {
                      userUID: currentUser.uid,
                      refresh: now,
                    },
                  ]),
                  count: views.count + 1,
                },
              });
            } else {
              if (
                now - actualViewer.refresh >= 600000 ||
                now - actualViewer.refresh === now
              ) {
                update({
                  views: {
                    viewers: views.viewers.map((viewer) => {
                      return viewer.userUID === currentUser.uid
                        ? Object.assign(viewer, { refresh: now })
                        : viewer;
                    }),
                    count: views.count + 1,
                  },
                });
              }
            }
          }
        }
      }
    }
  }, [currentUser]);

  return (
    <Media
      query="(min-width: 380px)"
      render={(match) => {
        return (
          <div className="Video-Container">
            <div className="Video-Top">
              <div className="Video">
                {src ? (
                  <>
                    <div>
                      <video
                        className="Video-Element"
                        controls={true}
                        autoPlay=""
                        name="media"
                      >
                        <source src={src} type="video/mp4" />
                      </video>
                    </div>
                    <div className="Video-Bottom">
                      <div className="Video-Owner">
                        <div className="Video-Profile">
                          <ProfileImage
                            width="30%"
                            image={photoURL}
                            alt="Profile Image"
                          />
                          <p className="linked">{displayName}</p>
                        </div>
                        <div className="Video-Follows">
                          <button
                            style={{ background: "var(--color-grey-lower)" }}
                            id="Icon-Button-Animation"
                            className="Icon-Button default-button default-button-animation"
                          >
                            <Icon icon="bx:bxs-share" />
                            {match ? "Share" : ""}
                          </button>
                          <button
                            id="Icon-Button-Animation-2"
                            onClick={() => like()}
                            className="Icon-Button default-button default-button-animation"
                          >
                            <Icon color={likeColor} icon="topcoat:like" />
                            {likes ? likes.count : 0}
                          </button>
                        </div>
                      </div>
                      <div className="Video-Presentation">
                        <h2 className="grey Video-Title">{title}</h2>
                        <p className="grey-lower Video-Description">
                          {description}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="Loading-Container"
                    variants={loadingContainerVariants}
                    initial="start"
                    animate="end"
                  >
                    <motion.span
                      className="Loading-Circle"
                      variants={loadingCircleVariants}
                      transition={loadingCircleTransition}
                    />
                    <motion.span
                      className="Loading-Circle"
                      variants={loadingCircleVariants}
                      transition={loadingCircleTransition}
                    />
                    <motion.span
                      className="Loading-Circle"
                      variants={loadingCircleVariants}
                      transition={loadingCircleTransition}
                    />
                  </motion.div>
                )}
              </div>
              <VideoChat idVideo={idVideo} userUID={userUID} />
            </div>
          </div>
        );
      }}
    />
  );
}

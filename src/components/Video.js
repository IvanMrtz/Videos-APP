import { useEffect, useState, useContext, useRef, useCallback } from "react";
import userContext from "../context/user-context";
import useStorage from "../hooks/useStorage";
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
import { useHistory, useLocation, useParams } from "react-router-dom";
import firebase from "firebase";

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
    y: "100%",
  },
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut",
};

export const Message = withRouter(function (props) {
  const { message, createdAt, photo, name, history, userUID } = props;

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
          <div className="Video-Comment-Top">
            <p className="Video-Comment-Name">{name}</p>
            <p className="Video-Comment-Date">
              {(function () {
                const parsedDate = new Date(createdAt);
                const today = new Date(Date.now());
                const isToday = parsedDate.getDay() === today.getDay();

                return isToday
                  ? parsedDate.toLocaleTimeString()
                  : parsedDate.toLocaleDateString();
              })()}
            </p>
          </div>
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
      <hr
        style={{ top: "0px" }}
        id="Divison-Line-Chat"
        className="Division-Line"
      />

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
  const { state = { userUID: "0" } } = useLocation();
  const history = useHistory();
  const { userUID } = state;
  const { id: idVideo } = useParams();
  const [src, setSrc] = useState();
  const ownerData = useUser(userUID);
  const { displayName, subscribers, photoURL } = ownerData.consume;
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
    if (likes) {
      return likes.likings.find((uid) => uid === currentUser.uid);
    }
  }, [likes]);

  const update = useCallback(
    (toUpdate) => {
      _update(Object.assign({ idVideo, userUID }, toUpdate));
    },
    [currentUser]
  );

  const like = useCallback(() => {
    if (currentUser) {
      if (likes) {
        if (currentUser.emailVerified) {
          const likings = likes.likings;
          const timestamp =
            firebase.default.firestore.FieldValue.serverTimestamp();

          if (!isLiked()) {
            setLikeColor("#ff4e6d");

            update({
              likes: {
                likings: likings.concat([currentUser.uid]),
                count: likes.count + 1,
              },
              createdAt: timestamp,
            });
          } else {
            setLikeColor("grey");

            update({
              likes: {
                likings: likings.filter((uid) => uid !== currentUser.uid),
                count: likes.count - 1,
              },
              createdAt: timestamp,
            });
          }
        }
      }
    }
  }, [likes, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const unsubSnapshot = readSingleVideo(
        (querySnapshot) => {
          console.log("Rendering single video...");
          const updatedVideoData = querySnapshot.docs.map((doc) => {
            return doc.data();
          });
          const videoRequired = updatedVideoData.find(
            (video) => video.userUID === userUID
          );

          if (videoRequired) {
            setVideoData(videoRequired);

            getDownloadURL(["videos", userUID, idVideo]).then((url) => {
              setSrc(url);
            });
          } else {
            history.push("/error");
          }
        },
        (error) => {
          console.error(error);
        },
        userUID
      );

      return unsubSnapshot;
    }
  }, [currentUser, idVideo, userUID]);

  useEffect(() => {
    if (isLiked()) {
      setLikeColor("#ff4e6d");
    } else {
      setLikeColor("grey");
    }
  }, [likes]);

  useEffect(() => {
    if (currentUser) {
      if (views) {
        const actualViewer = views.viewers.find((userUID) => {
          return userUID === currentUser.uid;
        });

        if (!actualViewer) {
          update({
            views: {
              viewers: views.viewers.concat([currentUser.uid]),
              count: views.count + 1,
            },
          });
        }
      }
    }
  }, [currentUser, views]);

  return (
    <Media
      query="(min-width: 380px)"
      render={(match) => {
        return (
          <>
            {src ? (
              <div className="Video-Container">
                <div className="Video-Top">
                  <div className="Video">
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
                          <div className="Profile-Public-Data">
                            <p className="grey">{displayName}</p>
                            <p className="linked very-small">
                              {subscribers} subscribers
                            </p>
                          </div>
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
                        <hr
                          style={{ bottom: "-25px" }}
                          className="Division-Line"
                        />
                      </div>
                      <div className="Video-Presentation">
                        <h2 className="grey Video-Title">{title}</h2>
                        <p className="grey-lower Video-Description">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <VideoChat idVideo={idVideo} userUID={userUID} />
                </div>
              </div>
            ) : (
              <div className="Loading-Container">
                <motion.div
                  className="Loading"
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
              </div>
            )}
          </>
        );
      }}
    />
  );
}

import { useEffect, useState, useContext, useRef } from "react";
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
  const { photoURL, displayName } = userData.consume;
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
            const data = {
              photo: photoURL,
              name: displayName,
              message: inputMessage.current.value,
              userUID: currentUser.uid,
            };
            console.log(data);
            writeMessage(data).then(() => {
              if (autoScroll.current)
                autoScroll.current.scrollIntoView({ behavior: "smooth" });
            });
            inputMessage.current.value = "";
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

export default function (props) {
  const { setVideoPopup, video, userUID, idVideo, description, title } = props;
  const [src, setSrc] = useState();
  const ownerData = useUser(userUID);
  const { displayName, photoURL } = ownerData.consume;
  const { getDownloadURL } = useStorage();

  useEffect(() => {
    getDownloadURL(["videos", userUID, idVideo]).then((url) => {
      setSrc(url);
    });
  }, []);

  return (
    <Background setClose={setVideoPopup} color="rgba(8, 8, 15, .95)">
      <div className="Video-Container">
        <div className="Video-Top">
          <div className="Video">
            {video || src ? (
              <video controls={true} autoPlay="" name="media">
                <source src={video || src} type="video/mp4" />
              </video>
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
        <div className="Video-Bottom">
          <div className="Video-Presentation">
            <div className="Video-Profile">
              <ProfileImage width="10%" image={photoURL} alt="Profile Image" />
              <p className="linked">{displayName}</p>
            </div>
            <h2 className="grey">{title}</h2>
            <p className="grey-lower">{description}</p>
          </div>
          <div className="Video-Follows"></div>
        </div>
      </div>
    </Background>
  );
}
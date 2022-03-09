import { useEffect, useState, useRef, useContext } from "react";
import { withRouter } from "react-router";
import useMessage from "../hooks/useMessage";
import Options, { Option } from "./Options";
import ProfileImage from "./ProfileImage";
import { Icon } from "@iconify/react";
import "../styles/Message.css";
import userContext from "../context/user-context";

export const Message = withRouter(function (props) {
  let {
    message,
    userUID,
    id,
    idVideo,
    createdAt,
    photo,
    name,
    history,
    ownerVideoUID,
    currentReply,
    reply,
    setCurrentReply,
  } = props;
  const activator = useRef();
  const { editMessage, removeMessage } = useMessage({
    idVideo,
    ownerVideoUID,
  });
  const { currentUser } = useContext(userContext);
  const [editMode, setEditMode] = useState(false);
  const inputEditMessageRef = useRef();
  const [newMessage, setNewMessage] = useState(message);
  const inputEditMessage = inputEditMessageRef.current;
  const [replyMode, setReplyMode] = useState(false);
  const replyModeStyle =
    replyMode && currentReply ? { background: "#57528c12" } : {};
  const replyCommentStyle = reply ? { marginTop: "30px" } : {};
  const commentStyle = Object.assign(replyModeStyle, replyCommentStyle);

  useEffect(() => {
    if (inputEditMessage) {
      function enter(event) {
        event = event || window.event;

        if (event.key == "Enter") {
          editMessage(id, { message: newMessage });
          setEditMode(false);
        }

        if (event.key == "Escape") {
          setEditMode(false);
        }
      }

      inputEditMessage.addEventListener("keydown", enter);

      return () => {
        inputEditMessage.removeEventListener("keydown", enter);
      };
    }
  }, [inputEditMessage, newMessage]);

  useEffect(() => {
    if (inputEditMessage) {
      if (editMode) {
        inputEditMessage.focus();
      }
    }
  }, [editMode, inputEditMessage]);

  return (
    <>
      <div className="Video-Comment-Container" style={commentStyle}>
        <div className="Video-Comment-Start">
          {reply ? (
            <div className="Video-Comment-Reply">
              <ProfileImage
                width="20px"
                height="20px"
                image={reply.photo}
                alt="Profile Image"
              />

              <p className="Video-Reply-Name">{reply.name}:</p>
              <p className="Video-Reply-Text">{reply.message}</p>
              <div className="Video-Reply-Line" />
            </div>
          ) : null}

          <ProfileImage
            action={() => {
              history.push("/profile/" + userUID);
            }}
            width="45px"
            height="45px"
            image={photo}
            alt="Profile Image"
          />
        </div>

        <div className="Video-Comment-Content">
          <div className="Video-Comment-Top">
            <p className="Video-Comment-Name">{name}</p>
            <p className="Video-Comment-Date">
              {(function () {
                if (createdAt == null) {
                  return new Date(Date.now()).toLocaleTimeString();
                } else {
                  const parsedDate = new Date(createdAt.toDate());
                  const today = new Date(Date.now());
                  const isToday = parsedDate.getDay() === today.getDay();

                  return isToday
                    ? parsedDate.toLocaleTimeString()
                    : parsedDate.toLocaleDateString();
                }
              })()}
            </p>
            <Icon
              className="Options-Dots"
              ref={activator}
              icon="bi:three-dots-vertical"
            />
            <Options
              activator={activator}
              style={{
                width: "70px",
                right: "50px",
                height: "max-content",
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                color: "var(--color-grey)",
                background: "var(--color-grey-background-lower)",
                fontSize: "13px",
              }}
            >
              <Option
                fire={() => {
                  setCurrentReply({ name, photo, message, userUID });
                  setReplyMode(true);
                }}
                className="Option"
                closeOnFire={true}
              >
                Reply
              </Option>
              {currentUser.uid === userUID ? (
                <>
                  <Option
                    fire={() => {
                      setEditMode(true);
                    }}
                    className="Option"
                    closeOnFire={true}
                  >
                    Edit
                  </Option>
                  <Option
                    fire={() => {
                      removeMessage(id);
                    }}
                    className="Option"
                    closeOnFire={true}
                  >
                    Remove
                  </Option>
                </>
              ) : (
                ""
              )}
            </Options>
          </div>
          {editMode ? (
            <input
              value={newMessage}
              ref={inputEditMessageRef}
              onChange={(event) => {
                setNewMessage(event.target.value);
              }}
              className="Video-Comment-Text clean-input"
            />
          ) : (
            <p className="Video-Comment-Text">{message}</p>
          )}
        </div>
      </div>
    </>
  );
});

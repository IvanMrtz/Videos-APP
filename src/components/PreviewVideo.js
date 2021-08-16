import useFirestore from "../hooks/useFirestore";
import { Icon } from "@iconify/react";
import delete28Filled from "@iconify-icons/fluent/delete-28-filled";
import editIcon from "@iconify-icons/akar-icons/edit";
import { memo } from "react";
import "../styles/PreviewVideo.css";
import Thumbnail from "./Thumbnail";
import { useState, useContext } from "react";
import Video from "./Video";
import userContext from "../context/user-context";

function PreviewVideo(props) {
  const { remove } = useFirestore("users");
  const {
    title,
    color,
    category,
    idVideo,
    description,
    userUID,
    setStateFormVideo,
    setInputs,
  } = props;
  const [data, setData] = useState({ video: null, thumbnail: null });
  const [videoPopup, setVideoPopup] = useState();
  const { currentUser } = useContext(userContext); // ocultar botones de edición, para quienes no sean los dueños del video

  return (
    <div className="Preview-Video" style={{ border: `1px solid ${color}` }}>
      {videoPopup ? (
        <Video
          idVideo={idVideo}
          title = {title}
          description={description}
          userUID={userUID}
          video={data.video}
          setVideoPopup={setVideoPopup}
        />
      ) : null}

      <Thumbnail
        onClick={() => setVideoPopup(true)}
        urlThumbnail={data.thumbnail}
        userUID={userUID}
        idVideo={idVideo}
      />
      <div className="d-flex flex-column">
        <h2 className="small-2 linked">{title}</h2>

        <div className="Video-Actions">
          <div className="left">
            <Icon onClick={() => remove(props)} icon={delete28Filled} />
            <Icon
              onClick={() => {
                setInputs((inputs) => {
                  return inputs.map((input) => {
                    if (input.name === "Edit") {
                      input.data.external = {
                        idVideo,
                        setData,
                      };
                    }

                    return input;
                  });
                });

                setStateFormVideo("Edit");
              }}
              icon={editIcon}
            />
          </div>
          <div className="right">
            <h3 className="grey small">{category}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PreviewVideo);

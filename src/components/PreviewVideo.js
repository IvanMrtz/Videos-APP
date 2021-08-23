import useFirestore from "../hooks/useFirestore";
import { Icon } from "@iconify/react";
import { memo } from "react";
import "../styles/PreviewVideo.css";
import Thumbnail from "./Thumbnail";
import { useState, useContext } from "react";
import Video from "./Video";
import userContext from "../context/user-context";
import { sectionContext } from "./Main";
import { Link, withRouter } from "react-router-dom";

export default memo(function PreviewVideo(props) {
  const { remove } = useFirestore("users");
  const {
    title,
    color,
    category,
    idVideo,
    description,
    views,
    likes,
    userUID,
    setStateFormVideo,
    setInputs,
  } = props;
  const [data, setData] = useState({ thumbnail: null });
  const { section } = useContext(sectionContext);

  return (
    <div className="Preview-Video" style={{ border: `1px solid ${color}` }}>
      <Link
        to={{
          pathname: "video/" + idVideo,
          state: {
            userUID
          },
        }}
      >
        <Thumbnail
          urlThumbnail={data.thumbnail}
          userUID={userUID}
          idVideo={idVideo}
        />
      </Link>

      <div className="d-flex flex-column">
        <h2 className="small-2 linked">{title}</h2>

        <div className="Video-Actions">
          <div className="left">
            {section === "MyVideos" ? (
              <>
                <Icon onClick={() => remove(props)} icon="carbon:delete" />
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
                  icon="akar-icons:edit"
                />
              </>
            ) : (
              <div className="Video-Views">
                <Icon icon="carbon:view" />
                <p className="grey small">{views.count}</p>
              </div>
            )}
          </div>
          <div className="right">
            <h3 className="grey small">{category}</h3>
          </div>
        </div>
      </div>
    </div>
  );
});

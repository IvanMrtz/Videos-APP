import useFirestore from "../hooks/useFirestore";
import { Icon } from "@iconify/react";
import { memo } from "react";
import "../styles/PreviewVideo.css";
import Thumbnail from "./Thumbnail";
import { useState, useContext } from "react";
import {
  inputsContext,
  stateFormVideoContext,
} from "../context/form-video-context";
import { Link, useLocation } from "react-router-dom";
import userContext from "../context/user-context";

export default memo(function PreviewVideo(props) {
  const { remove } = useFirestore("users");
  const { title, color, category, idVideo, views, userUID } = props;
  const [data, setData] = useState({ thumbnail: null });
  const { setStateFormVideo } = useContext(stateFormVideoContext);
  const { setInputs } = useContext(inputsContext);
  const { currentUser } = useContext(userContext);
  const { pathname } = useLocation();
  const isProfileScreen = pathname.match(/profile/);

  return (
    <div className="Preview-Video" style={{ border: `1px solid ${color}` }}>
      <Link
        replace
        style={{
          color: "var(--color-grey)",
        }}
        to={{
          pathname: "/video/" + idVideo,
          state: {
            userUID,
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
            {currentUser.uid === userUID && isProfileScreen ? (
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
                            userUID: currentUser.uid,
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
                <p className="grey small">{views?.count ?? 0}</p>
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

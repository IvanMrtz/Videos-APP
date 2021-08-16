import "../styles/Thumbnail.css";
import { useState, useEffect } from "react";
import useStorage from "../hooks/useStorage";

export default function ({ urlThumbnail, idVideo, onClick, userUID }) {
  const [src, setSrc] = useState();
  const { getDownloadURL } = useStorage();

  useEffect(() => {
    getDownloadURL(["thumbnails", userUID, idVideo]).then(url => {
      setSrc(url);
    });
  }, []);

  return (
    <div className="Thumbnail-Container" onClick={onClick}>
      {src && (
        <div style={{ width: "100%", height: "140px" }}>
          <img
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            src={urlThumbnail || src}
            alt=""
          />
        </div>
      )}
      {!src && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: "100%", height: "140px" }}
        >
          <p className="grey">loading...</p>
        </div>
      )}
    </div>
  );
}

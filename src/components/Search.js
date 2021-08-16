import { useState, useEffect, useContext } from "react";
import "../styles/Search.css";
import { Icon } from "@iconify/react";
import bxSearch from "@iconify-icons/bx/bx-search";
import "bootstrap/dist/css/bootstrap.css";
import { VideosContext } from "./Main";

export default function (props) {
  const [search, setSearch] = useState("");
  const { videos, setVideos } = useContext(VideosContext);

  useEffect(() => {
    if (videos) {
      setVideos((videos) => {
        return videos.map((video) => {
          if ((video.title).toLowerCase().includes(search)) {
            video.active = true;
          } else {
            video.active = false;
          }
          return video;
        });
      });
    }
  }, [search]);

  return (
    <div className="Search-Container d-flex vertical-center justify-content-evenly">
      <Icon color="gainsboro" icon={bxSearch} />
      <input
        style={{ outline: "none", color: 'var(--color-grey)' }}
        value={search}
        onChange={(ev) => setSearch(ev.target.value)}
        className="Search"
        placeholder="Search tutorials, videos of your language..."
      />
    </div>
  );
}

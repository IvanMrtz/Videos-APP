import { useEffect, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { videosContext } from "./Main";
import "../styles/Section.css";

export default function () {
  const [option, setOption] = useLocalStorage("option", "name");
  const { setVideos } = useContext(videosContext);

  useEffect(() => {
    setVideos((videos) => {
      if (videos) {
        return [
          ...videos.sort((videoA, videoB) => {
            if (option === "date") {
              return Number(videoB.idNote) - Number(videoA.idNote);
            } else if (option === "name") {
              return videoA.title.charCodeAt() - videoB.title.charCodeAt();
            }
          }),
        ];
      }
    });
  }, [option]);

  return (
    <select
      className="default-button"
      value={option}
      style={{
        background: "var(--color-grey-lower)",
      }}
      onChange={(optionSelected) => setOption(optionSelected.target.value)}
    >
      <option
        style={{
          background: "grey",
        }}
        value="date"
      >
        Date
      </option>
      <option
        style={{
          background: "grey",
        }}
        value="name"
      >
        Name
      </option>
    </select>
  );
}

import InfoUserPanel from "./InfoUserPanel";
import InfoChallengesPanel from "./InfoChallengesPanel";
import { useContext } from "react";
import { sectionContext } from "./Main";

export default function ({ setStateFormVideo }) {
  const { section } = useContext(sectionContext);

  return (
    <div
      style={{ height: "100%" }}
      className="d-flex flex-column justify-content-between"
    >
      <div
        className="d-flex flex-column"
        style={{ height: "220px", justifyContent: "inherit" }}
      >
        <h2 className="grey">
          {section == "MyVideos" ? "Your videos" : "Comunity videos"}
        </h2>
        <InfoUserPanel />
      </div>
      <div>
        <InfoChallengesPanel setStateFormVideo={setStateFormVideo} />
      </div>
    </div>
  );
}

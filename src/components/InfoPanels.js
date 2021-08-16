import InfoUserPanel from "./InfoUserPanel";
import InfoChallengesPanel from "./InfoChallengesPanel";

export default function ({ setStateFormVideo, section }) {
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
          {section == "MyNotes" ? "Your videos" : "Comunity videos"}
        </h2>
        <InfoUserPanel />
      </div>
      <div>
        <InfoChallengesPanel setStateFormVideo={setStateFormVideo} />
      </div>
    </div>
  );
}

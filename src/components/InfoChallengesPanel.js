import "../styles/InfoChallengesPanel.css";
import { useRef, useEffect, useState } from "react";
import AddNote from "./AddNote";
import Section from "./Section";
import Media from "./MediaQuery";

export default function (props) {
  const [option, setOption] = useState("Name");
  const { setVideos } = props; 
  const canvasLineRef = useRef();
  const canvasLineBgRef = useRef();

  useEffect(() => {
    const canvasLine = canvasLineRef.current;
    const ctxLine = canvasLine.getContext("2d");

    const canvasLineBg = canvasLineBgRef.current;
    const ctxLineBg = canvasLineBg.getContext("2d");

    const experience = 80;

    function drawCircle(canvas, ctx, angle, color, lineWidth) {
      ctx.translate(
        canvas.getBoundingClientRect().width / 2,
        canvas.getBoundingClientRect().height / 2
      );
      ctx.rotate(Math.PI / -2);
      ctx.strokeStyle = color;
      ctx.arc(0, 0, 60, 0, angle);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    drawCircle(
      canvasLine,
      ctxLine,
      (experience / 100) * 2 * Math.PI,
      "#4d43ff",
      5
    );
    drawCircle(canvasLineBg, ctxLineBg, 2 * Math.PI, "rgb(173, 173, 173)", 3);
  }, []);

  return (
    <Media
      query="(min-width: 850px)"
      render={(match) => {
        return (
          <Media
            query="(min-width: 650px)"
            render={(match2) => {
              const styleInfoChallengesPanel = {
                width: "300px",
                height: "250px",
                borderRadius: "10px",
                position: "relative",
                background: "var(--color-grey-background)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              };
      
              function changeStyles(apply, match) {
                if (!match) apply();
              }
      
              changeStyles(() => {
                styleInfoChallengesPanel.height = "200px";
              }, match);

              changeStyles(() => {
                styleInfoChallengesPanel.width = "100%";
                styleInfoChallengesPanel.marginBottom = "30px";
              }, match2);

              return (
                <div style={styleInfoChallengesPanel}>
                  <div className="d-flex justify-content-around">
                    <Section setVideos={setVideos}/>
                    <AddNote />
                  </div>

                  <div
                    style={{ height: "50%" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <p style={{ color: "var(--color-grey)" }}>Nivel 3</p>
                    <canvas
                      style={{ position: "absolute" }}
                      ref={canvasLineBgRef}
                    />
                    <canvas
                      style={{ position: "absolute" }}
                      ref={canvasLineRef}
                    />
                  </div>
                </div>
              );
            }}
          />
        );
      }}
    />
  );
}

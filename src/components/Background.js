import { useEffect, useRef } from "react";

export default function (props) {
  const background = useRef();
  const {
    centered = false,
    color = "green",
    zIndex = "20000000",
    setClose,
    scrollable = false,
  } = props;

  //In the next project i will use styledComponents
  let style = Object.assign(
    centered
      ? { display: "flex", justifyContent: "center", alignItems: "center" }
      : {},
    scrollable ? { overflow: "scroll" } : {},
    {
      position: "fixed",
      inset: "0",
      backgroundColor: String(color),
      zIndex: String(zIndex),
    }
  );

  useEffect(() => {
    background.current.addEventListener("click", (ev) => {
      if (ev.target.classList.contains("closable")) {
        setClose(false);
      }
    });
  }, []);

  return (
    <div className="closable" ref={background} style={style}>
      {props.children}
    </div>
  );
}

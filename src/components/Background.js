import { useEffect, useRef } from "react";

export default function (props) {
  const background = useRef();
  const {
    centered = false,
    zIndex = "20000000",
    setClose,
    fillStyle={},
    scrollable = false,
  } = props;

  let style = Object.assign(
    centered
      ? { display: "flex", justifyContent: "center", alignItems: "center" }
      : {},
    scrollable ? { overflow: "scroll" } : {},
    {
      position: "fixed",
      inset: "0",
      zIndex: String(zIndex),
    },
    fillStyle
  )
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

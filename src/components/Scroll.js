import { useCallback } from "react";
import "../styles/Scroll.css";

export default function (props) {
  const { children, className, distance } = props;

  const scroll = useCallback((div) => {
    if (div) {
      let clearScroll = [];

      div.style.right = "-6px";
      function handleScroll(ev) {
        if (div.style.right !== "0px") {
          div.style.right = distance;
        }

        clearTimeout(clearScroll.shift());

        clearScroll.push(
          setTimeout(() => {
            div.style.right = "-6px";
          }, 3000)
        );
      }

      div.addEventListener("scroll", handleScroll);
    }
  }, []);
  return (
    <div className={`Scroll-Container-1 ${className}`}>
      <div className={`Scroll-Container-2 ${className}`} ref={scroll}>
        {children}
      </div>
    </div>
  );
}

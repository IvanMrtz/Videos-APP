import { useEffect, useState } from "react";

export default function MediaQuery(props) {
  const [matches, setMatches] = useState(window.matchMedia(props.query));
  const render = props.render;

  useEffect(() => {
    function listener(ev) {
      setMatches(ev);
    }

    matches.addEventListener("change", listener);

    return () => matches.removeListener(listener);
  }, []);

  return <>{render(matches.matches)}</>;
}

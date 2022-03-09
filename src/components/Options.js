import React, { useEffect, useRef, useState, useContext } from "react";
import { findDOMNode } from "react-dom";
import Background from "./Background";

const fireContext = React.createContext();

export function Option(props) {
  const { style, fire = () => {}, children, closeOnFire, ...rest } = props;
  const baseStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    width: "100%",
    height: "auto",
    cursor: "pointer",
  };
  const mergedStyle = Object.assign(baseStyle, style);
  const setFire = useContext(fireContext);

  return (
    <div
      {...rest}
      style={mergedStyle}
      onClick={() => {
        fire();

        if (closeOnFire) {
          setFire(false);
        }
      }}
    >
      {children}
    </div>
  );
}

export default function Options(props) {
  const { options, style, parent, background, children, ...rest } = props;
  const baseStyle = {
    position: "absolute",
    background: "grey",
    display: "flex",
    flexDirection: "column",
    justifyContent: "around",
    borderRadius: "7px",
    height: "auto",
    width: "auto",
    zIndex: 200000000,
  };
  const mergedStyle = Object.assign(baseStyle, style);

  const [fired, setFired] = useState(false);
  const optionsContainerRef = useRef();

  useEffect(() => {
    const optionsContainer = optionsContainerRef.current;

    if (optionsContainer) {
      const parentNode = parent ?? findDOMNode(optionsContainer).parentNode;

      function clickOptions(event) {
        if (event.target.parentNode == parentNode) {
          event.stopPropagation();
          setFired((fired) => !fired);
        }
      }

      if (parentNode) {
        parentNode.addEventListener("click", clickOptions);
      }

      return () => {
        parentNode.removeEventListener("click", clickOptions);
      };
    }
  }, [optionsContainerRef.current]);

  const OptionsDiv = (
    <div ref={optionsContainerRef} {...rest} style={fired ? mergedStyle : {}}>
      {fired ? children : null}
    </div>
  );

  return (
    <fireContext.Provider value={setFired}>
      {fired ? (
        <>
          {OptionsDiv}
          <Background
            fillStyle={{ background: "rgba(50,50,50,0.2" }}
            setClose={setFired}
          ></Background>
        </>
      ) : (
        OptionsDiv
      )}
    </fireContext.Provider>
  );
}

import { Icon } from "@iconify/react";
import { forwardRef } from "react";
import "../styles/Popup.css";

export default forwardRef((props, ref) => {
    const { background = "red", color = "white", message = "" } = props;

    return (
      <div
        ref={ref}
        style={{
          background,
          color,
        }}
        className="Popup-Container"
      >
        <div className="Popup-Icon">
          <Icon icon="carbon:warning" />
        </div>
        <p className="Popup-Message">{message}</p>
      </div>
    );
});
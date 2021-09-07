import { forwardRef } from "react";

export default forwardRef(function (props, ref) {
  const {
    image,
    width = "auto",
    height = "auto",
    action = () => {},
    alt = "",
  } = props;
  
  return (
    <div ref={ref}>
      <img
        width={width}
        height={height}
        className="user-img"
        src={image}
        alt={alt}
        onClick={() => action(true)}
      />
    </div>
  );
});
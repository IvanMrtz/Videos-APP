export default function Circle(props) {
  const { children, width, background, htmlFor } = props;

  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width,
        height: width,
        background,
        borderRadius: "50%",
      }}
    >
      {children}
    </label>
  );
}

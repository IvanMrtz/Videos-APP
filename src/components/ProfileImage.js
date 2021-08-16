export default function ({
  image,
  width = "auto",
  height = "auto",
  action = () => {},
  alt = "",
}) {
  return (
    <>
      <img
        width={width}
        height={height}
        className="user-img"
        src={image}
        alt={alt}
        onClick={() => action(true)}
      />
    </>
  );
}

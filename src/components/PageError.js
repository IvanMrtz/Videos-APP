import "../styles/PageError.css";

function Error({ src, message }) {
  return (
    <div className="Page-Not-Found-Container">
      <img src={src} />
      <h3>{message}</h3>
    </div>
  );
}

export function RouteNotFound() {
  return (
    <Error
      src="undraw_page_not_found_su7k.svg"
      message="Opss... this page not exists"
    />
  );
}

export function VideoNotFound() {
  return (
    <Error
      src="undraw_media_player_ylg8.svg"
      message="Opss... this video not exists"
    />
  );
}

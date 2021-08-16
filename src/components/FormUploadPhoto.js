import Background from "./Background";

export default function ({setStateImageChanger}) {
  {
    return (
      <Background zIndex = {2} setClose = {setStateImageChanger} color = "rgba(7, 8, 15, 0.801)">
        <div
        style={{
          height: "200px",
          width: "200px",
          borderRadius: "10px",
          background: "rgb(16, 15, 19)",
        }}
        >
          {/* {Inputs}             */}
        </div>
      </Background>
      
    );
  }
}

import { useState, useEffect } from "react";
import "../styles/Form.css";

export default function Form(props) {
  const { statex } = props;
  const [inputs, setInputs] = useState(statex.inputs);
  
  useEffect(() => {
    statex.setInputs((state) => ({ ...state, inputs }));
  }, [inputs]);
  
  return (
    <>
      <div className="Form-Input-Div">
        <input
          value={inputs.title}
          name="title"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Title (max 29 chars)"
        />
      </div>
      <div className="Form-Input-Div">
        <input
          value={inputs.description}
          name="description"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Description (max 100 chars)"
        />
      </div>
      <div className="Form-Input-Div">
        Video
        <input
          name="fileVideo"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.files[0] };
            })
          }
          type="file"
        />
      </div>
      <div className="Form-Input-Div">
        Thumbnail (1280x720)
        <input
          accept="image/jpg"
          name="fileThumbnail"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.files[0] };
            })
          }
          type="file"
        />
      </div>
      <div className="Form-Input-Div">
        <input
          value={inputs.color}
          name="color"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          type="color"
        />
      </div>
      <div className="Form-Input-Div">
        <input
          value={inputs.category}
          name="category"
          onChange={(ev) =>
            setInputs((state) => {
              return { ...state, [ev.target.name]: ev.target.value };
            })
          }
          placeholder="Category"
        />
      </div>
    </>
  );
}

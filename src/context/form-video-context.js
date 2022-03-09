import React, { useEffect } from "react";
import FormVideo from "../components/FormVideo";
import Forms from "../utilities/Forms/Forms";
import Form from "../components/Form";
import { useMemo, useState } from "react";
import useFirestore from "../hooks/useFirestore";

const formVideoContext = React.createContext();
const inputsContext = React.createContext();
const stateFormVideoContext = React.createContext();
export { formVideoContext, inputsContext, stateFormVideoContext };

export default function FormVideoProvider(props) {
  const { children } = props;
  const { update, add } = useFirestore("users");
  const [inputs, setInputs] = useState([
    {
      Component: Form,
      name: "Create",
      closeInSubmit: true,
      autoCatchErrorByEmptyFields: true,
      submits: {
        default: { submit: add },
      },
      data: {
        initial: {
          title: "",
          color: "",
          fileVideo: "",
          fileThumbnail: "",
          description: {
            field: "",
            rules: [{ maxCharacters: 500 }],
          },
          category: {
            field: "",
            rules: [{ maxCharacters: 20 }],
          },
        },
        external: function () {
          return {
            idVideo: String(Date.now()),
          };
        },
      },
    },
    {
      Component: Form,
      name: "Edit",
      closeInSubmit: true,
      autoCatchErrorByEmptyFields: false,
      submits: {
        default: { submit: update },
      },
      data: {
        initial: {
          title: "",
          color: "",
          fileVideo: "",
          fileThumbnail: "",
          description: "",
          category: "",
        },
      },
    },
  ]);
  const [stateFormVideo, setStateFormVideo] = useState("");
  const stateFormVideoProvider = useMemo(
    () => ({ stateFormVideo, setStateFormVideo }),
    [stateFormVideo]
  );
  const inputsProvider = useMemo(() => ({ inputs, setInputs }), [inputs]);

  useEffect(() => {
    setInputs((previousInputs) => {
      previousInputs = [...previousInputs];
      Object.assign(previousInputs[0], {
        submits: {
          default: { submit: add },
        },
      });

      return previousInputs;
    });
  }, [add]);

  return (
    <stateFormVideoContext.Provider value={stateFormVideoProvider}>
      <inputsContext.Provider value={inputsProvider}>
        <Forms
          formState={[stateFormVideo, setStateFormVideo]}
          structure={(data, inputs) => {
            return (
              <FormVideo
                setStateFormVideo={setStateFormVideo}
                allData={data}
                inputs={inputs}
              />
            );
          }}
          inputs={inputs}
        />
        {children}
      </inputsContext.Provider>
    </stateFormVideoContext.Provider>
  );
}

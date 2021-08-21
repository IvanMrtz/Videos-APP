import useForm from "../../hooks/useForm";
import React from "react";
import { useState, useEffect, memo } from "react";

export default memo(function Forms(props) {
  const { submit, error, setError } = useForm();
  const [inputs, setInputs] = useState({ inputs: null, setInputs: null });
  const [target, setTarget] = useState();

  const formState = props.formState[0];
  const setFormState = props.formState[1];

  useEffect(() => {
    setTarget(ChangeAndSelectForm());
  }, [formState]);

  function ChangeAndSelectForm() {
    return props.inputs
      .map((Form) => {
        const Component = Form.Component;

        Object.entries(Form.data.initial).forEach(([key, val]) => {
          if (typeof val === "object" && val !== null) {
            Form.data.initial[key] = val.rules;
          }
        });

        if (formState === Form.name) {
          return (
            <Component
              statex={{ inputs: Form.data.initial, setInputs }}
              onSubmit={(data) =>{
                return submit({
                  inputsData: data,
                  setFormState: setFormState,
                  clearFieldsOnSubmit: Form.clearFieldsOnSubmit,
                  rulesOfFields: Form.data.initial,
                  autoCatchErrorByEmptyFields: Form.autoCatchErrorByEmptyFields,
                  autoCatchErrorByRules: Form.autoCatchErrorByRules,
                  removeError: Form.removeError,
                  closeInSubmit: Form.closeInSubmit,
                  submits: Form.submits,
                })
              }}
              name={Form.name}
              externalData={Form.data.external}
              key={Form.name}
            />
          );
        }
      })
      .filter((form) => !!form)[0];
  }

  if (formState) {
    if (target) {
      return props.structure(
        Object.assign(
          {},
          target.props.externalData
            ? typeof target.props.externalData === "function"
              ? { externalData: target.props.externalData() }
              : { externalData: target.props.externalData }
            : {
                warning:
                  "You did not put a function that provide external data.",
              },
          {
            manage: { error, setError },
            name: target.props.name,
            target,
            onSubmit: target.props.onSubmit,
          }
        ),
        inputs.inputs
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
});

import { useState } from "react";
import useValidate from "./useValidate";

export default function () {
  const [error, setError] = useState(null);
  const { validateEmptyFields, validateRules, evaluateEmptyFields } =
    useValidate();

  function submit(options) {
    let {
      inputsData = {},
      rulesOfFields = {},
      setInputs,
      initialState,
      setFormState = () => {},
      closeInSubmit = false,
      ignoreFalseValues = false,
      autoCatchErrorByEmptyFields = true,
      autoCatchErrorByRules = false,
      removeError = 4000,
      remove = false,
      submits = false,
      clearFieldsOnSubmit = false,
    } = options;
    let rulesOfFieldsParsed = {};
    console.log(inputsData)
    if (inputsData) {
      Object.entries(rulesOfFields).forEach(([key, val]) => {
        if (typeof val === "object" && val !== null) {
          rulesOfFieldsParsed[key] = val.rules;
        }
      });

      function showError(error) {
        setTimeout(() => {
          setError(null);
        }, removeError);

        setError(error.code ? `${error.code}: ${error.message}` : error);
      }

      delete inputsData.manage;

      if (autoCatchErrorByEmptyFields) {
        const errorEmptyField = validateEmptyFields(inputsData);

        if (errorEmptyField) {
          showError(errorEmptyField);
          return;
        }
      }
      if (autoCatchErrorByRules) {
        const errorRule = validateRules(inputsData, rulesOfFieldsParsed);

        if (errorRule) {
          showError(errorRule);
          return;
        }
      }

      if (ignoreFalseValues) {
        inputsData = evaluateEmptyFields(inputsData);
      }

      if (remove) {
        remove.forEach((toRemove) => {
          if (inputsData[toRemove]) {
            delete inputsData[toRemove];
          }
        });
      }
      
      if (clearFieldsOnSubmit) {
        if (setInputs.type === "state") {
          setInputs.handler(initialState);
        } else if (setInputs.type === "reducer") {
          setInputs.handler();
        }
      }

      if (submits) {
        Object.entries(submits).forEach(([fields, config]) => {
          const fieldsArray = fields.split("-");
          fieldsArray.forEach((field, count) => {
            if (inputsData[field]) {
              config.submit(inputsData[field], ...callbacks(config.onlyData));
              delete inputsData[field];
            } else if (
              fieldsArray.length - 1 === count &&
              field === "default"
            ) {
              config.submit(inputsData, ...callbacks(config.onlyData));
            }
          });
        });
      }

      function callbacks(onlyData) {
        return !onlyData
          ? [
              () => {
                if (closeInSubmit) {
                  setFormState("");
                }
              },
              (error) => {
                if (error) {
                  showError(error);
                }
              },
            ]
          : [];
      }
    }
  }

  return { submit, error, setError };
}

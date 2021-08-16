import { useState } from "react";
import useValidate from "./useValidate";

export default function () {
  const [error, setError] = useState(null);
  const { validateEmptyFields, validateRules} = useValidate();

  function submit(options) {
    const {
      inputsData,
      toSubmit,
      rulesOfFields,
      setFormState,
      closeInSubmit,
      autoCatchErrorByEmptyFields,
      autoCatchErrorByRules,
      removeError,
    } = options;

    console.log(rulesOfFields)

    function showError(error){
      setTimeout(() => {
        setError(null);
      }, removeError);

      setError(error.from ? `${error.from}: ${error.message}` : error);
    }

    delete inputsData.manage;
    
    if (autoCatchErrorByEmptyFields) {
      const errorEmptyField = validateEmptyFields(inputsData);
      
      if (errorEmptyField) {
        showError(errorEmptyField);
        return;
      } 
    }
    if(autoCatchErrorByRules){
      const errorRule = validateRules(inputsData, rulesOfFields);

      if(errorRule){
        showError(errorRule);
        return;
      }
    }

    toSubmit(inputsData, () => {
      if (closeInSubmit) {
        setFormState((state) => ({ ...state, form: null }));
      }
    }, (error) => {
      if (error) {
        showError(error);
      }
    });
  }

  return { submit, error, setError };
}

export default function () {
  function validateEmptyFields(inputs) {
    const keys = Object.keys(inputs);

    for (const key of keys) {
      if (!inputs[key]) {
        return { message: "Please fill the field", code: key };
      }
    }
    return false;
  }

  function evaluateEmptyFields(inputs) {
    const newInputs = {};

    Object.entries(inputs).forEach(([key, val]) => {
      if(val) {
        newInputs[key] = val;
      }
    })

    return newInputs;
  }

  function validateRules(inputs, rules) {
    /*          Add your owns rules             */

    const rulesAvailable = [
      { maxCharacters: maxCharactersRule, minCharacters: minCharactersRule },
    ];
    const keys = Object.keys(inputs);

    function maxCharactersRule(characters, amount, key) {
      return characters.length < amount
        ? false
        : { message: `Please put less than ${amount} characters`, code: key };
    }

    function minCharactersRule(characters, amount, key) {
      return characters.length > amount
        ? false
        : {
            message: `Please put greater than ${amount} characters`,
            code: key,
          };
    }

    for (const key of keys) {
      if (rules[key]) {
        for (const rule of rules[key]) {
          const ruleSelected = rulesAvailable.find(
            (el) => el[Object.keys(rule)[0]]
          );
          const [ruleName, ruleFunction] = Object.entries(ruleSelected)[0];
          if (ruleSelected) {
            if (typeof inputs[key] !== "string")
              return "Dev Error: The field is not a String";

            return ruleFunction(inputs[key], rule[ruleName], key);
          }
        }
      }
    }
  }

  return { validateEmptyFields, validateRules, evaluateEmptyFields };
}

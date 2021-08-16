export default function () {
  function validateEmptyFields(inputs) {
    const keys = Object.keys(inputs);

    for (const key of keys) {
      if (!inputs[key]) {
        return { message: "Please fill the field", from: key };
      }
    }
    return false;
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
        : { message: `Please put less than ${amount} characters`, from: key };
    }

    function minCharactersRule(characters, amount, key) {
      return characters.length > amount
        ? false
        : {
            message: `Please put greater than ${amount} characters`,
            from: key,
          };
    }
    console.log(rules)
    console.log(keys)
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

  return { validateEmptyFields, validateRules };
}

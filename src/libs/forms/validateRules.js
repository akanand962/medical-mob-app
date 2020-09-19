const EMAIL_REGX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const HCN_REGX = /[0-9]{4}-[0-9]{3}-[0-9]{3}-[A-Z]{2}/;
const validate = (value, rules, form) => {
  let valid = true;
  for (let rule in rules) {
    switch (rule) {
      case "isRequired":
        valid = valid && value.trim() !== "";
        break;
      case "isEmail":
        valid = valid && EMAIL_REGX.test(String(value).toLowerCase());
        break;
      case "minLength":
        valid = valid && value.trim().length >= rules[rule];
        break;
      case "maxLength":
        valid = valid && value.trim().length <= rules[rule];
        break;
      case "confirmPass":
        valid = valid && value === form[rules.confirmPass].value;
        break;
      case "isHealthCardNumber":
        valid = valid && HCN_REGX.test(String(value));
        break;
      default:
        valid = true;
    }
  }

  return valid;
};

export default validate;

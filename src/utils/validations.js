const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName && !lastName) {
    throw new Error("enter name");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("enter correct email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("enter strong password");
  }
};
module.exports = { validateSignUpData };


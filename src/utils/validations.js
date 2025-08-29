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
const validateForgotPasswordData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("enter strong password");
  }
  if (!emailId || !password) {
    throw new Error("Email and password are required");
  }
};

const validateProfileEditData =(req)=>{
  const ALLOWED_EDITS = [
    "age",
    "firstName",
    "lastName",
    "gender",
    "skills",
    "about"
  ];
  const isUpdatesAllowed = Object.keys(req.body).every((fields) => {
    return ALLOWED_EDITS.includes(fields);
  });
  return isUpdatesAllowed;
}
module.exports = { validateSignUpData,validateProfileEditData ,validateForgotPasswordData};


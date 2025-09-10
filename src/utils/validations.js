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
    "about",
    "photoUrl"
  ];
  const isUpdatesAllowed = Object.keys(req.body).every((fields) => {
    return ALLOWED_EDITS.includes(fields);
  });
  return isUpdatesAllowed;
}

const   sanitizeUser=(user) =>{
    if (!user) return null;
  
    return {
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      emailId: user?.emailId,
      age: user?.age,
      gender: user?.gender,
      about: user?.about,
      photoUrl: user?.photoUrl,
      skills: user?.skills,
      verified: user?.verified,
      lastSeen: user?.lastSeen,
      isOnline: user?.isOnline,
    };
  }
module.exports = { validateSignUpData,validateProfileEditData ,validateForgotPasswordData ,sanitizeUser};


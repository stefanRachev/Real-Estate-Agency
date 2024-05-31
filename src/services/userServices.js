const User = require("../models/User");
const jwt = require("../lib/jwt");
const bcrypt = require("bcrypt");
const { SECRET } = require("../constants");

exports.register = async (userData) => {
  if (userData.password !== userData.repeatPassword) {
    throw new Error("Passwords do not match");
  } else if (userData.password.length < 4) {
    throw new Error("The password should be at least 4 characters long");
  } else if (userData.username.length < 5) {
    throw new Error("The username should be at least 5 characters long");
  }

  const createdUser = await User.create(userData);
  return createdUser;
};

exports.login = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const payload = { _id: user._id, username: user.username };
  const token = await jwt.sign(payload, SECRET, { expiresIn: "3d" });

  return token;
};

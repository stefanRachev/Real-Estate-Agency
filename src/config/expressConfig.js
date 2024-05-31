const express = require("express");
const cookieParser = require("cookie-parser");
const { auth } = require("../middleware/authMiddleware");

const appConfig = (app) => {
  app.use(express.static("src/public"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(auth)
};

module.exports = appConfig;

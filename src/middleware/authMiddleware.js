const jwt = require("../lib/jwt");
const { SECRET } = require("../constants");
const House = require("../models/House");

exports.auth = async (req, res, next) => {
  const token = req.cookies["token"];

  if (token) {
    try {
      const decodedToken = await jwt.verify(token, SECRET);
      req.user = decodedToken;
      res.locals.user = decodedToken;
      res.locals.isAuthenticated = true;
      next();
    } catch (error) {
      console.log(error);
      res.clearCookie("token");
      res.redirect("/users/login");
      return;
    }
  } else {
    next();
  }
};

exports.isAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/users/login");
  }
  next();
};



exports.isOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/users/login");
    }

    const { housingId } = req.params;
    const { _id } = req.user;

    const housing = await House.findById(housingId).lean();

    if (!housing) {
      return res.status(404).send("Housing not found");
    }

    const isCreator = housing.owner.toString() === _id;
   

    if (isCreator) {
      next();
    } else {
      return res.status(403).send("You are not the creator of this housing");
    }
  } catch (error) {
    return res.status(500).send(`Error in isCreator middleware: ${error.message}`);
  }
};


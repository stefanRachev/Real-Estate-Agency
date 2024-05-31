const router = require("express").Router();
const homeController = require("./controllers/homeController");
const userController = require("./controllers/userControllers");
const houseController = require("./controllers/housesController");

router.use(homeController);
router.use("/users", userController);
router.use("/rents", houseController);

router.get("*", (req, res) => {
  res.redirect("/404");
});

module.exports = router;

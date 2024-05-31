const router = require("express").Router();
const { getLastThree } = require("../services/homeServices");
const {extractErrorMsgs} = require("../utils/errorHandler");

router.get("/", async (req, res) => {
  try {
    const LastThreeHousing = await getLastThree().lean();
    res.render("home", { LastThreeHousing });
  } catch (error) {
    const errorMessage = extractErrorMsgs(error);
    res.status(404).render("home", { errorMessage });
  }
});

router.get("/404", (req, res) => {
  res.render("404");
});

module.exports = router;

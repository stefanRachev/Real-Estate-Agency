const router = require("express").Router();
const userServices = require("../services/userServices");
const { extractErrorMsgs } = require("../utils/errorHandler");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  const { name, username, password, repeatPassword } = req.body;

  try {
    if (!name || !username || !password || !repeatPassword) {
      throw new Error("All fields are required");
    }

    const token = await userServices.register({
      name,
      username,
      password,
      repeatPassword,
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    const errorMessages = extractErrorMsgs(error);
    res.status(404).render("users/register", { errorMessages });
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw new Error("All fields are required");
    }

    const token = await userServices.login(username, password);

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  } catch (error) {
    const errorMessages = extractErrorMsgs(error);
    res.status(404).render("users/login", { errorMessages });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;

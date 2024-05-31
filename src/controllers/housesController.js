const router = require("express").Router();
const housingServices = require("../services/housingServices");
const { extractErrorMsgs } = require("../utils/errorHandler");
const { isAuth, isOwner } = require("../middleware/authMiddleware");

router.get("/housing-for-rent", async (req, res) => {
  try {
    const propertyForRent = await housingServices.getAll().lean();
    res.render("post/aprt-for-recent", { propertyForRent });
  } catch (error) {
    const errorMessages = extractErrorMsgs(error);
    res.status(404).render("/rents/housing-for-rent", { errorMessages });
  }
});

router.get("/create", isAuth, (req, res) => {
  res.render("post/create");
});

router.get("/search", (req, res) => {
  res.render("post/search");
});

router.post("/search", async (req, res) => {
  const searchType = housingServices.capitalizeFirstLetter(req.body.searchType);
  const searchResults = await housingServices.searchByType(searchType).lean();
  res.render("post/search", { searchResults });
});

router.post("/create", async (req, res) => {
  const { user } = req;
  const owner = user._id;
  const { name, type, year, city, homeImage, description, availablePieces } =
    req.body;

  const housingOffer = {
    name,
    type,
    year,
    city,
    homeImage,
    description,
    availablePieces,
    owner,
  };

  try {
    await housingServices.createHousing(housingOffer);
    res.redirect("/rents/housing-for-rent");
  } catch (error) {
    const errorMessages = extractErrorMsgs(error);
    res.status(404).render("post/create", { errorMessages });
  }
});

router.get("/:housingId/details", async (req, res) => {
  const housingId = req.params.housingId;
  const housing = await housingServices.getOne(housingId).lean();

  const user = req.user?._id || null;
  isCreator = housing.owner == req.user?._id;

  const tenantsObj = await housingServices.getTest(housingId);

  const tenants = tenantsObj.usersNames;
  const alreadyHired = tenantsObj.users
    .map((user) => user._id.toString())
    .some((u) => u == user);
  const noAvailablePieces = housing.availablePieces < 1 ? true : false;

  res.render("post/details", {
    ...housing,
    isCreator,
    user,
    tenants,
    noAvailablePieces,
    alreadyHired,
  });
});

router.get("/:housingId/rented-property", async (req, res) => {
  const { housingId } = req.params;
  const { _id } = req.user;

  const tenants = await housingServices.rentedAHome(housingId, _id);

  res.redirect(`/rents/${housingId}/details`);
});

router.get("/:housingId/edit", isOwner, async (req, res) => {
  const { housingId } = req.params;
  const housingData = await housingServices.getOne(housingId).lean();

  res.render("post/edit", { ...housingData });
});

router.post("/:housingId/edit", async (req, res) => {
  const { housingId } = req.params;
  const { name, type, year, city, homeImage, description, availablePieces } =
    req.body;
  const housingEditData = {
    name,
    type,
    year,
    city,
    homeImage,
    description,
    availablePieces,
  };

  try {
    await housingServices.updateOne(housingId, housingEditData);
    res.redirect(`/rents/${housingId}/details`);
  } catch (error) {
    const errorMessages = extractErrorMsgs(error);
    res.status(404).redirect(`/rents/${housingId}/edit`);
  }
});

router.get("/:housingId/delete", isOwner, async (req, res) => {
  const { housingId } = req.params;
  await housingServices.removeOne(housingId);
  res.redirect("/rents/housing-for-rent");
});

module.exports = router;

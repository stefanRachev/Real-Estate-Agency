const Housing = require("../models/House");
const User = require("../models/User");

exports.createHousing = (housingData) => Housing.create(housingData);

exports.getAll = () => Housing.find();

exports.getOne = (housingId) => Housing.findById(housingId);

exports.getTest = async (housingId) => {
  const housing = await Housing.findById(housingId);
  if (!housing) {
    throw new Error(`Housing with ID ${housingId} not found`);
  }
  const users = await User.find({
    _id: { $in: housing.rentedAHomeUsers },
  }).select("name");
  const usersNames = users.map((user) => user.name).join(", ");
  return {
    usersNames,
    users,
  };
};

exports.rentedAHome = async (housingId, userId) => {
  const housing = await this.getOne(housingId);

  const rented = housing.rentedAHomeUsers.find((v) => v.toString() === userId);
  if (rented) {
    return;
  }

  housing.rentedAHomeUsers.push(userId);
  housing.availablePieces -= 1;
  await housing.save();

  const userNames = await User.find({
    _id: { $in: housing.rentedAHomeUsers },
  }).select("name");

  return {
    userNames: userNames.map((user) => user.name),
    housing: housing,
  };
};

exports.updateOne = (housingId, housingEditData) =>
  Housing.findByIdAndUpdate(housingId, housingEditData, {
    runValidators: true,
  });

exports.searchByType = (searchType) => Housing.find({ type: searchType });

exports.capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

exports.removeOne = (housingId) => Housing.findByIdAndDelete(housingId);

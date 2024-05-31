const Housing = require("../models/House");


exports.getLastThree = () => Housing.find().sort({ _id: -1 }).limit(3)




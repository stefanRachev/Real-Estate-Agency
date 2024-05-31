const mongoose = require("mongoose");

const housingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 6,
  },
  type: {
    type: String,
    required: true,
    enum: ["Apartment", "Villa", "House"],
  },
  year: {
    type: Number,
    required: true,
    min: 1850,
    max: 2021,
  },
  city: {
    type: String,
    required: true,
    minLength: 4,
  },
  homeImage: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^https?:\/\//.test(value),
      message: "Home Image should start with http:// or https://",
    },
  },
  description: {
    type: String,
    required: true,
    maxLength: 60,
  },
  availablePieces: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  rentedAHomeUsers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model("User").findById(value);
        return user !== null;
      },
      message: "Invalid owner reference",
    },
  },
});

// housingSchema.pre("findByIdAndUpdate", function (next) {
//   this.options.runValidators = true;
//   next();
// });

const Housing = mongoose.model("Housing", housingSchema);

module.exports = Housing;

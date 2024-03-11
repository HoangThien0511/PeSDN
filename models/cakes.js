const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
var toppingSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    price_extra: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cakeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: { type: Currency, required: true, min: 0 },
    topping: [toppingSchema],
  },
  {
    timestamps: true,
  }
);

var Cakes = mongoose.model("Banh", cakeSchema);
module.exports = Cakes;

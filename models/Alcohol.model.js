const { Schema, model } = require("mongoose");


const alcoholSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    description: String,
    rating: Number,
    percentage: Number,
  },
  {
    timestamps: true
  }
);

module.exports = model("Alcohol", alcoholSchema);

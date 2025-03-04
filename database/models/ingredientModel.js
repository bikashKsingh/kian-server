const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, unique: true },
    image: { type: String, trim: true },

    priority: { type: Number, default: 0 },

    shortDescription: { type: String, default: "", trim: true },

    status: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("ingredient", modelSchema);

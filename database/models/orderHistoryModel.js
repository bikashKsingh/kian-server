const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    updatedBy: { type: String, enum: ["USER", "ADMIN"] }, // Admin or system user
    updateNotes: { type: String, default: "" },

    status: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("orderHistory", modelSchema);

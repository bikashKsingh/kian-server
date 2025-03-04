const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    mobile: { type: String, default: "" },
    password: { type: String, trim: true, required: true },
    otp: { type: String, trim: true },
    otpExpiredAt: { type: Date, trim: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiredAt;
        delete ret.isDeleted;
        return ret;
      },
    },
    toJSON: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.password;
        delete ret.otp;
        delete ret.otpExpiredAt;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash the password
adminSchema.pre("save", async function (next) {
  const user = this;
  try {
    // Generate a salt and hash the password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (adminPassword) {
  return await bcryptjs.compare(adminPassword, this.password);
};

// Method to hash passwords
adminSchema.methods.hashPassword = async function (adminPassword) {
  const salt = await bcryptjs.genSalt(12);
  return await bcryptjs.hash(adminPassword, salt);
};

module.exports = mongoose.model("admin", adminSchema);

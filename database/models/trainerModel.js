const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { GENDER } = require("../../constants/gender");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    userName: { type: String, unique: true },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trainerLevel",
      required: true,
    },
    profilePhoto: { type: String, trim: true },
    designation: { type: String, trim: true, default: "" },
    dob: { type: Date },
    gender: { type: String, enum: GENDER },
    // imageGallery: [{ type: String, trim: true }],
    video: { type: String, trim: true },
    email: { type: String, trim: true, required: true, unique: true },
    mobile: { type: String, default: "", required: true, unique: true },
    bio: { type: String, trim: true },
    specialities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trainerSpeciality",
      },
    ],
    interests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "trainerInterest",
        required: true,
      },
    ],
    certificates: [{ title: String, certificateFile: String }],
    kycDocuments: [{ title: String, documentFile: String }],

    // meeting link
    meetingLink: { type: String, trim: true, default: "" },

    // Address
    address: { type: String, trim: true, default: "" },
    locality: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },

    // Social
    facebook: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    x: { type: String, trim: true, default: "" },
    youtube: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },

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
modelSchema.pre("save", async function (next) {
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
modelSchema.methods.comparePassword = async function (requestPassword) {
  return await bcryptjs.compare(requestPassword, this.password);
};

// Method to hash passwords
modelSchema.methods.hashPassword = async function (requestPassword) {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(requestPassword, salt);
};

module.exports = mongoose.model("trainer", modelSchema);

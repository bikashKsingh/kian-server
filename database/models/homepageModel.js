const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    // About us Section
    aboutusTitle: { type: String, trim: true },
    aboutusSubTitle: { type: String, trim: true },
    aboutusImage: { type: String, trim: true },
    aboutusVideo: { type: String, trim: true },
    aboutusDescription: { type: String, trim: true },
    aboutusButtonText: { type: String, trim: true },
    aboutusButtonLink: { type: String, trim: true },

    // Marketing Section
    marketingTitle: { type: String, trim: true },
    marketingSubTitle: { type: String, trim: true },
    marketingDescription: { type: String, trim: true },
    marketingImage: { type: String, trim: true },
    marketingVideo: { type: String, trim: true },
    marketingButtonText: { type: String, trim: true },
    marketingButtonLink: { type: String, trim: true },

    // Featured Section
    featuredTitle: { type: String, trim: true },
    featuredSubTitle: { type: String, trim: true },
    featuredDescription: { type: String, trim: true },
    featuredTabs: [
      {
        tabTitle: String,
        image: String,
      },
    ],

    // Gallery Section
    galleryTitle: { type: String, trim: true },
    gallerySubTitle: { type: String, trim: true },
    galleryDescription: { type: String, trim: true },
    galleryVideos: [
      {
        type: String,
      },
    ],

    // Blog Section
    blogTitle: { type: String, trim: true },
    blogSubTitle: { type: String, trim: true },
    blogDescription: { type: String, trim: true },

    // Inquiry Section
    inquiryTitle: { type: String, trim: true },
    inquirySubTitle: { type: String, trim: true },
    inquiryDescription: { type: String, trim: true },
    inquiryImage: { type: String, trim: true },
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

module.exports = mongoose.model("homepage", modelSchema);

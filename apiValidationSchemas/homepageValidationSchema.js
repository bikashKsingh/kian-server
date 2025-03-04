const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  // Aboutus Section
  aboutusTitle: Joi.string().allow("").label("Aboutus Title"),
  aboutusSubTitle: Joi.string().allow("").label("Aboutus Sub Title"),
  aboutusImage: Joi.string().allow("").label("Aboutus Image"),
  aboutusVideo: Joi.string().allow("").label("Aboutus Video"),
  aboutusDescription: Joi.string().allow("").label("Aboutus Description"),
  aboutusButtonText: Joi.string().allow("").label("Aboutus Button Text"),
  aboutusButtonLink: Joi.string().allow("").label("Aboutus Button Link"),

  // Marketing Title

  marketingTitle: Joi.string().allow("").label("Marketing Section Title"),
  marketingSubTitle: Joi.string()
    .allow("")
    .label("Marketing Section Sub Title"),
  marketingDescription: Joi.string()
    .allow("")
    .label("Marketing Section Description"),
  marketingImage: Joi.string().allow("").label("Marketing Section Image"),
  marketingVideo: Joi.string().allow("").label("Marketing Section Video"),
  marketingButtonText: Joi.string()
    .allow("")
    .label("Marketing Section Button Text"),
  marketingButtonLink: Joi.string()
    .allow("")
    .label("Marketing Section Button Link"),

  // Featured Section
  featuredTitle: Joi.string().allow("").label("Featured Section Title"),
  featuredSubTitle: Joi.string().allow("").label("Featured Section Sub Title"),
  featuredDescription: Joi.string()
    .allow("")
    .label("Featured Section Description"),
  featuredTabs: Joi.array(),

  // Gallery Section
  galleryTitle: Joi.string().allow("").label("Gallery Section Title"),
  gallerySubTitle: Joi.string().allow("").label("Gallery Section Sub Title"),
  galleryDescription: Joi.string()
    .allow("")
    .label("Gallery Section Description"),
  galleryVideos: Joi.array(),

  // Blog Section
  blogTitle: Joi.string().allow("").label("Blog Section Title"),
  blogSubTitle: Joi.string().allow("").label("Blog Section Sub Title"),
  blogDescription: Joi.string().allow("").label("Blog Section Description"),

  // Inquiry Section
  inquiryTitle: Joi.string().allow("").label("Inquiry Section Title"),
  inquirySubTitle: Joi.string().allow("").label("Inquiry Section Sub Title"),
  inquiryDescription: Joi.string()
    .allow("")
    .label("Inquiry Section Description"),
  inquiryImage: Joi.string().allow("").label("Inquiry Section Image"),
});

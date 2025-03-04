const productModel = require("../database/models/productModel");
const sizeFinishModel = require("../database/models/sizeFinishModel");
const { serviceResponse, productMessage } = require("../constants/message");
const dbHelper = require("../helpers/dbHelper");
const _ = require("lodash");
const logFile = require("../helpers/logFile");
const { google } = require("googleapis");
const categoryModel = require("../database/models/categoryModel");
const subCategoryModel = require("../database/models/subCategoryModel");

// create
module.exports.create = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // Check if the product slug already exists
    const isSlugExist = await productModel.findOne({ slug: serviceData.slug });

    if (isSlugExist) {
      response.errors = {
        slug: productMessage.SLUG_ALREADY_EXISTS,
      };
      response.message = productMessage.SLUG_ALREADY_EXISTS;
      return response;
    }

    // if (serviceData.image) {
    //   const authenticate = () => {
    //     const auth = new google.auth.GoogleAuth({
    //       keyFile: process.env.GOOGLE_KEY_FILE || "./crown-google-api.json", // Use environment variable or default path
    //       scopes: ["https://www.googleapis.com/auth/drive"],
    //     });
    //     return auth;
    //   };

    //   const auth = authenticate();
    //   const drive = google.drive({ version: "v3", auth });

    //   try {
    //     const res = await drive.files.list({
    //       q: `'${serviceData.image}' in parents`, // Query files in the specified folder
    //       fields: "files(id, name)",
    //     });

    //     if (!res?.data?.files?.length) {
    //       throw new Error("No files found in the specified folder");
    //     }

    //     const images = {};
    //     for (let file of res.data.files) {
    //       const fileName = file?.name?.split(".")[0];
    //       if (fileName) images[fileName] = file.id;
    //     }

    //     const createThumbnailUrl = (fileId, size = 5000) =>
    //       `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;

    //     if (images["a4Image"]) {
    //       serviceData["a4Image"] = createThumbnailUrl(images["a4Image"]);
    //     }

    //     if (images["fullSheetImage"]) {
    //       serviceData["fullSheetImage"] = createThumbnailUrl(
    //         images["fullSheetImage"]
    //       );
    //     }

    //     if (images["highResolutionImage"]) {
    //       serviceData["highResolutionImage"] = createThumbnailUrl(
    //         images["highResolutionImage"]
    //       );
    //     }
    //   } catch (error) {
    //     logFile.write(
    //       `Error fetching files from Google Drive: ${error.message}`
    //     );
    //     throw new Error("Failed to fetch images from Google Drive");
    //   }
    // }

    // if (serviceData.sizes) {
    //   const sizeFinishes = await sizeFinishModel.find(
    //     {
    //       size: { $in: serviceData.sizes },
    //     },
    //     { _id: 1 }
    //   );

    //   serviceData.sizeFinishes = sizeFinishes;
    // }

    // const newData = new productModel(serviceData);
    // const result = (await newData.save()).populate();

    const newData = new productModel(serviceData);
    const savedResult = await newData.save();
    const result = await savedResult.populate([
      "category",
      "subCategory",
      "ingredients",
      "baseSize",
    ]);

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.isOkay = true;
      response.message = productMessage.CREATED;
    } else {
      response.message = productMessage.NOT_CREATED;
      response.errors.error = productMessage.NOT_CREATED;
    }
  } catch (error) {
    logFile.write(`Service: productService: create, Error: ${error}`);
    throw new Error(error.message);
  }
  return response;
};

// findById
module.exports.findById = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const result = await productModel
      .findById({ _id: serviceData.id })
      .populate({ path: "category", select: "name" })
      .populate({ path: "subCategory", select: "name" })
      .populate({ path: "baseSize", select: "title" })
      .populate({ path: "ingredients" })
      .populate({ path: "variants.size" });
    if (result) {
      // Perform further population on the result
      // const populatedResult = await productModel.populate(result, [
      //   {
      //     path: "sizeFinishes.size", // Populate a subfield within sizeFinishes
      //     select: "title", // Select specific fields
      //   },
      //   {
      //     path: "sizeFinishes.finishes", // Populate a subfield within sizeFinishes
      //     select: "shortName fullName", // Select specific fields
      //   },
      // ]);

      response.body = dbHelper.formatMongoData(result);
      response.message = productMessage.FETCHED;
      response.isOkay = true;
    } else {
      response.errors.error = productMessage.NOT_AVAILABLE;
      response.message = productMessage.NOT_AVAILABLE;
    }
    return response;
  } catch (error) {
    logFile.write(`Service : productService: findById, Error : ${error}`);
    throw new Error(error);
  }
};

// findAll
module.exports.findAll = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    let conditions = {};
    const {
      limit = 10,
      page = 1,
      searchQuery,
      slug = "",
      status = true,
      isDeleted = false,
      category,
      categorySlug = "",
      subCategory,
      subCategorySlug = "",
      categories = [],
      subCategories = [],
      sizes = [],
      categoryWise = "",
    } = serviceData;

    // SearchQuery
    if (searchQuery) {
      conditions = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { slug: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Status
    if (status == "All") {
      delete conditions.status;
    } else {
      conditions.status = status;
    }

    if (slug) conditions.slug = slug;

    if (category) conditions.category = category;
    if (subCategory) conditions.subCategor = subCategory;

    if (categorySlug) {
      const catInfo = await categoryModel.findOne({ slug: categorySlug });
      conditions.category = catInfo ? catInfo._id : null;
    }

    if (subCategorySlug) {
      const subCatInfo = await subCategoryModel.findOne({
        slug: subCategorySlug,
      });
      conditions.subCategory = subCatInfo ? subCatInfo._id : null;
    }

    if (categories?.length) {
      conditions.category = {
        $in: categories,
      };
    }

    if (subCategories.length) {
      conditions.subCategory = {
        $in: subCategories,
      };
    }

    if (sizes.length) {
      conditions.baseSize = { $in: sizes };
    }

    // DeletedAccount
    conditions.isDeleted = isDeleted;

    // count record
    const totalRecords = await productModel.countDocuments(conditions);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    const result = await productModel
      .find(conditions)
      .populate({ path: "category", select: "name slug" })
      .populate({ path: "subCategory", select: "name slug" })
      .populate({ path: "baseSize", select: "title" })
      .populate({ path: "ingredients" })
      .populate({ path: "variants.size" })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit));

    if (result) {
      // Perform further population on the result
      // const populatedResult = await productModel.populate(result, [
      //   {
      //     path: "sizeFinishes.size", // Populate a subfield within sizeFinishes
      //     select: "title", // Select specific fields
      //   },
      //   {
      //     path: "sizeFinishes.finishes", // Populate a subfield within sizeFinishes
      //     select: "shortName fullName", // Select specific fields
      //   },
      // ]);

      // Group the data by category
      if (categoryWise) {
        const groupedBySubCategory = {};

        // Use a for loop to iterate through the results
        for (const product of result) {
          const subCategory = product?.subCategory?._id;
          if (!subCategory) continue; // Skip product if no subCategory

          // Fetch subCategory details asynchronously
          const subCategoryDetails = await subCategoryModel.findById(
            subCategory
          );
          if (!subCategoryDetails) continue; // Skip if subCategory details not found

          // Initialize an empty array for the subCategory if not already present
          if (!groupedBySubCategory[subCategoryDetails.name]) {
            groupedBySubCategory[subCategoryDetails.name] = {
              subCategory: subCategoryDetails.name,
              slug: subCategoryDetails.slug,
              _id: subCategoryDetails._id,
              products: [],
            };
          }

          // Push the product into its respective subCategory group
          groupedBySubCategory[subCategoryDetails.name].products.push(product);
        }

        // Transform the grouped data into the required format
        const formattedResult = Object.keys(groupedBySubCategory).map(
          (subCategory) => ({
            subCategory: groupedBySubCategory[subCategory].subCategory,
            slug: groupedBySubCategory[subCategory].slug,
            _id: groupedBySubCategory[subCategory]._id,
            products: groupedBySubCategory[subCategory].products,
          })
        );

        response.body = formattedResult;
      } else {
        response.body = dbHelper.formatMongoData(result);
      }

      response.isOkay = true;
      response.page = parseInt(page);
      response.totalPages = totalPages;
      response.totalRecords = totalRecords;
      response.message = productMessage.FETCHED;
    } else {
      response.message = productMessage.NOT_FETCHED;
    }
  } catch (error) {
    logFile.write(`Service : productService: findAll, Error : ${error}`);

    throw new Error(error);
  }

  return response;
};

// update
module.exports.update = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id, body } = serviceData;

    // if (body.sizes) {
    //   let sizeFinishes = await sizeFinishModel.find(
    //     {
    //       size: { $in: body.sizes },
    //     },
    //     { _id: 1 }
    //   );

    //   body.sizeFinishes = sizeFinishes;
    // }

    const result = await productModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (result) {
      response.body = dbHelper.formatMongoData(result);
      response.message = productMessage.UPDATED;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_UPDATED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: update, Error : ${error}`);
    throw new Error(error);
  }
  return response;
};

// delete
module.exports.delete = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    const { id } = serviceData;
    // const result = await productModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    const result = await productModel.findByIdAndDelete(id, {
      new: true,
    });

    if (result) {
      response.message = productMessage.DELETED;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_DELETED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: delete, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

// deleteMultiple
module.exports.deleteMultiple = async (serviceData) => {
  const response = _.cloneDeep(serviceResponse);
  try {
    // const result = await productModel.findByIdAndUpdate(id, {
    //   isDeleted: true,
    //   status: false,
    // });

    // console.log(serviceData);

    const result = await productModel.deleteMany({
      _id: { $in: serviceData.ids },
    });

    if (result) {
      response.message = `${result.deletedCount} ${productMessage.DELETED}`;
      response.isOkay = true;
    } else {
      response.message = productMessage.NOT_DELETED;
      response.errors.id = productMessage.INVALID_ID;
    }
  } catch (error) {
    logFile.write(`Service : productService: deleteMultiple, Error : ${error}`);
    throw new Error(error);
  }

  return response;
};

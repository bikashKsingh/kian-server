const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const dbConnection = require("./database/connection");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
dotEnv.config();
// Connect to the database
dbConnection();

// Create a app
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Serve files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route to get all uploaded files
app.get("/files", (req, res) => {
  const uploadDir = path.join(__dirname, "uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read upload directory" });
    }

    const fileDetails = files.map((file) => {
      return {
        fileName: file,
        url: `${req.protocol}://${req.get("host")}/uploads/${file}`,
      };
    });

    res.json({
      message: "List of all uploaded files",
      files: fileDetails,
    });
  });
});

// router middleware
app.use("/api/v1/admins", require("./routes/adminRouter"));
app.use("/api/v1/categories", require("./routes/categoryRouter"));

app.use("/api/v1/carousels", require("./routes/carouselRouter"));
app.use("/api/v1/homepage", require("./routes/homepageRoutes"));

app.use("/api/v1/subCategories", require("./routes/subCategoryRouter"));
app.use("/api/v1/newsletters", require("./routes/newsLetterRouter"));

app.use("/api/v1/inquiries", require("./routes/inquiryRouter"));
app.use("/api/v1/productReviews", require("./routes/productReviewRouter"));

app.use("/api/v1/coupons", require("./routes/couponRouter"));
// app.use("/api/v1/trainers", require("./routes/trainerRouter"));
app.use("/api/v1/users", require("./routes/userRouter"));
app.use("/api/v1/userAddress", require("./routes/userAddressRouter"));
// app.use("/api/v1/plans", require("./routes/planRouter"));

// ----------- Settings -----------
app.use("/api/v1/paymentSettings", require("./routes/paymentSettingRouter"));
// ----------- End Settings -----------

app.use("/api/v1/decorSeries", require("./routes/decorSeriesRouter"));
app.use("/api/v1/sizes", require("./routes/sizeRouter"));
app.use("/api/v1/ingredients", require("./routes/ingredientRouter"));

// app.use("/api/v1/finishes", require("./routes/finishRouter"));
// app.use("/api/v1/sizeFinishes", require("./routes/sizeFinishRouter"));
app.use("/api/v1/products", require("./routes/productRouter"));
app.use("/api/v1/orders", require("./routes/orderRouter"));
app.use("/api/v1/orderHistories", require("./routes/orderHistoryRouter"));

// app.use("/api/v1/programPlans", require("./routes/programPlanRouter"));
// app.use(
//   "/api/v1/trainerDesignations",
//   require("./routes/trainerDesignationRouter")
// );

app.use("/api/v1/trainerLevels", require("./routes/trainerLevelRouter"));
app.use("/api/v1/documentFormats", require("./routes/documentFormatRouter"));
app.use("/api/v1/kycDocuments", require("./routes/kycDocumentRouter"));
app.use("/api/v1/fileUploads", require("./routes/fileUploadingRouter"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start listening the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is Running at ${PORT}`);
});

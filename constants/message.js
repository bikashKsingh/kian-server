module.exports = {
  defaultServerResponse: {
    status: 400,
    body: [],
    errors: {},
    message: "",
  },
  serviceResponse: {
    isOkay: false,
    body: null,
    errors: {},
    message: "",
  },
  databaseMessage: {
    INVALID_ID: "Object ID is invalid",
  },
  validationMessage: {
    VALIDATION_FAILED: "Validation Failed",
    TOKEN_MISSING: "Token is Missing, Login First",
    FAILED: "Validation failed",
  },

  authMessage: {},

  adminMessage: {
    CREATED: "Account created!",
    LOGGED_IN: "Account logged in",

    EMAIL_EXISTS: "Account with this email is already esixts",
    INVALID_EMAIL: "Invalid email id",

    NOT_CREATED: "Account not created!",
    PASSWORD_UPDATED: "Password updated!",
    PASSWORD_NOT_UPDATED: "Password not updated !",
    PASSWORD_NOT_MATCHED: "Old password is not matched !",
    NOT_UPDATED: "Profile not updated !",
    UPDATED: "Profile updated !",
    FOUND: "Account found !",
    NOT_FOUND: "Account not found !",
    FETCHED: "Account fetched !",
    NOT_FETCHED: "OOPS ! Profile not fetched !",

    INVALID_PASSWORD: "You entered wrong password",

    OTP_VERIFIED: "OTP verified",
    OTP_EXPIRED: "Wrong or expired OTP",
    OTP_NOT_VERIFIED: "OTP not verified",
  },

  userMessage: {
    CREATED: "Account created, An OTP sent to your email!",
    NOT_CREATED: "Account not created!",

    EMAIL_EXISTS: "Account with this email is already exist",
    INVALID_EMAIL: "You have entered Invalid email",

    MOBILE_EXISTS: "Account with this mobile is already exist",

    UPDATED: "Profile updated !",
    NOT_UPDATED: "Profile not updated !",

    FOUND: "Account found !",
    NOT_FOUND: "Account not found !",

    DELETED: "User deleted !",
    NOT_DELETED: "User not deleted !",

    FETCHED: "Account fetched !",
    NOT_FETCHED: "OOPS ! Profile not fetched !",

    LOGGED_IN: "Account logged in",

    PASSWORD_UPDATED: "Password updated!",
    PASSWORD_NOT_UPDATED: "Password not updated !",
    PASSWORD_NOT_MATCHED: "Old password is not matched !",

    INVALID_PASSWORD: "You entered wrong password",

    ACCOUNT_VERIFIED: "Account verified",
    ACCOUNT_NOT_VERIFIED: "Account not verified",

    OTP_VERIFIED: "OTP verified",
    OTP_EXPIRED: "Wrong or expired OTP",
    OTP_NOT_VERIFIED: "OTP not verified",

    INVALID_ID: "User id is invalid",
  },

  trainerMessage: {
    CREATED: "Account created!",
    LOGGED_IN: "Account logged in",
    EMAIL_EXISTS: "Account with this email is already esixts",
    NOT_CREATED: "Account not created!",
    PASSWORD_UPDATED: "Password updated!",
    PASSWORD_NOT_UPDATED: "Password not updated !",
    PASSWORD_NOT_MATCHED: "Old password is not matched !",
    NOT_UPDATED: "Profile not updated !",
    UPDATED: "Profile updated !",
    FOUND: "Account found !",
    NOT_FOUND: "Account not found !",
    FETCHED: "Account fetched !",
    NOT_FETCHED: "OOPS ! Profile not fetched !",

    INVALID_PASSWORD: "You entered wrong password",
    INVALID_ID: "Trainer ID is invalid",
    OTP_VERIFIED: "OTP verified",
    OTP_EXPIRED: "Wrong or expired OTP",
    OTP_NOT_VERIFIED: "OTP not verified",

    DELETED: "Trainer deleted!",
    NOT_DELETED: "Trainer not deleted !",
  },
  userAddressMessage: {
    CREATED: "Address added!",
    NOT_CREATED: "Address not added!",

    FETCHED: "Address fetched !",
    NOT_FETCHED: "Address not fetched !",

    UPDATED: "Address updated!",
    NOT_UPDATED: "Address not updated !",

    DELETED: "Address deleted!",
    NOT_DELETED: "Address not deleted !",

    ALREADY_EXISTS: "Address already exists !",
    NOT_AVAILABLE: "Address not available !",

    INVALID_ID: "Address ID is invalid",
  },
  categoryMessage: {
    CREATED: "Category created!",
    NOT_CREATED: "Category not created!",

    FETCHED: "Category fetched !",
    NOT_FETCHED: "Category not fetched !",

    UPDATED: "Category updated!",
    NOT_UPDATED: "Category not updated !",

    DELETED: "Category deleted!",
    NOT_DELETED: "Category not deleted !",

    ALREADY_EXISTS: "Category already exists !",
    NOT_AVAILABLE: "Category not available !",

    INVALID_ID: "Category ID is invalid",
  },

  ingredientMessage: {
    CREATED: "Ingredient created!",
    NOT_CREATED: "Ingredient not created!",

    FETCHED: "Ingredient fetched !",
    NOT_FETCHED: "Ingredient not fetched !",

    UPDATED: "Ingredient updated!",
    NOT_UPDATED: "Ingredient not updated !",

    DELETED: "Ingredient deleted!",
    NOT_DELETED: "Ingredient not deleted !",

    ALREADY_EXISTS: "Ingredient already exists !",
    NOT_AVAILABLE: "Ingredient not available !",

    INVALID_ID: "Ingredient ID is invalid",
  },

  carouselMessage: {
    CREATED: "Carousel created!",
    NOT_CREATED: "Carousel not created!",

    FETCHED: "Carousel fetched !",
    NOT_FETCHED: "Carousel not fetched !",

    UPDATED: "Carousel updated!",
    NOT_UPDATED: "Carousel not updated !",

    DELETED: "Carousel deleted!",
    NOT_DELETED: "Carousel not deleted !",

    ALREADY_EXISTS: "Carousel already exists !",
    NOT_AVAILABLE: "Carousel not available !",

    INVALID_ID: "Carousel ID is invalid",
  },

  homepageMessage: {
    CREATED: "Homepage data created!",
    NOT_CREATED: "Homepage data not created!",

    FETCHED: "Homepage data fetched !",
    NOT_FETCHED: "Homepage data not fetched !",

    UPDATED: "Homepage data updated!",
    NOT_UPDATED: "Homepage data not updated !",

    DELETED: "Homepage data deleted!",
    NOT_DELETED: "Homepage data not deleted !",

    ALREADY_EXISTS: "Homepage data already exists !",
    NOT_AVAILABLE: "Homepage data not available !",

    INVALID_ID: "Homepage data ID is invalid",
  },

  subCategoryMessage: {
    CREATED: "Sub Category created!",
    NOT_CREATED: "Sub Category not created!",

    FETCHED: "Sub Category fetched !",
    NOT_FETCHED: "Sub Category not fetched !",

    UPDATED: "Sub Category updated!",
    NOT_UPDATED: "Sub Category not updated !",

    DELETED: "Sub Category deleted!",
    NOT_DELETED: "Sub Category not deleted !",

    ALREADY_EXISTS: "Sub Category already exists !",
    NOT_AVAILABLE: "Sub Category not available !",

    INVALID_ID: "Sub Category ID is invalid",
  },

  programDurationMessage: {
    CREATED: "Program Duration created!",
    NOT_CREATED: "Program Duration not created!",

    FETCHED: "Program Duration fetched !",
    NOT_FETCHED: "Program Duration not fetched !",

    UPDATED: "Program Duration updated!",
    NOT_UPDATED: "Program Duration not updated !",

    DELETED: "Program Duration deleted!",
    NOT_DELETED: "Program Duration not deleted !",

    ALREADY_EXISTS: "Program Duration already exists !",
    NOT_AVAILABLE: "Program Duration not available !",

    INVALID_ID: "Program Duration ID is invalid",
  },

  planMessage: {
    CREATED: "Plan created!",
    NOT_CREATED: "Plan not created!",

    FETCHED: "Plan fetched !",
    NOT_FETCHED: "Plan not fetched !",

    UPDATED: "Plan updated!",
    NOT_UPDATED: "Plan not updated !",

    DELETED: "Plan deleted!",
    NOT_DELETED: "Plan not deleted !",

    ALREADY_EXISTS: "Plan already exists !",
    NOT_AVAILABLE: "Plan not available !",

    INVALID_ID: "Plan ID is invalid",
  },

  programPlanMessage: {
    CREATED: "Plan added!",
    NOT_CREATED: "Plan not added!",

    FETCHED: "Plan fetched !",
    NOT_FETCHED: "Plan not fetched !",

    UPDATED: "Plan updated!",
    NOT_UPDATED: "Plan not updated !",

    DELETED: "Plan deleted!",
    NOT_DELETED: "Plan not deleted !",

    ALREADY_EXISTS: "Plan already exists !",
    NOT_AVAILABLE: "Plan not available !",

    INVALID_ID: "Plan ID is invalid",
  },

  orderMessage: {
    CREATED: "Order added!",
    NOT_CREATED: "Order not added!",

    FETCHED: "Order fetched !",
    NOT_FETCHED: "Order not fetched !",

    UPDATED: "Order updated!",
    NOT_UPDATED: "Order not updated !",

    DELETED: "Order deleted!",
    NOT_DELETED: "Order not deleted !",

    ALREADY_EXISTS: "Order already exists !",
    NOT_AVAILABLE: "Order not available !",

    INVALID_ID: "Order ID is invalid",

    BOOKED: "Order booked!",
    NOT_BOOKED: "Order not booked!",
  },

  productMessage: {
    CREATED: "Product created!",
    NOT_CREATED: "Product not created!",

    FETCHED: "Product fetched !",
    NOT_FETCHED: "Product not fetched !",

    UPDATED: "Product updated!",
    NOT_UPDATED: "Product not updated !",

    DELETED: "Product deleted!",
    NOT_DELETED: "Product not deleted !",

    ALREADY_EXISTS: "Product already exists !",
    SLUG_ALREADY_EXISTS: "Duplicate Error : Product slug must be unique !",
    DECOR_NUMBER_ALREADY_EXISTS:
      "Duplicate Error : Product decor number must be unique !",

    NOT_AVAILABLE: "Product not available !",

    INVALID_ID: "Product ID is invalid",
  },

  newsletterMessage: {
    CREATED: "Successfully subscribed for newsletter!",
    NOT_CREATED: "Failed to subscribed for newsletter.",

    FETCHED: "Newsletter fetched!",
    NOT_FETCHED: "Newsletter not fetched !",

    UPDATED: "Newsletter email updated!",
    NOT_UPDATED: "Newsletter email not updated !",

    DELETED: "Newsletter deleted!",
    NOT_DELETED: "Newsletter not deleted !",

    ALREADY_EXISTS: "Newsletter email already exists !",
    NOT_AVAILABLE: "Newsletter email not available !",

    INVALID_ID: "Newsletter ID is invalid",
  },

  inquiryMessage: {
    CREATED: "Inquiry created!",
    NOT_CREATED: "Failed to create inquiry.",

    FETCHED: "Inquiry fetched!",
    NOT_FETCHED: "Inquiry not fetched !",

    UPDATED: "Inquiry updated!",
    NOT_UPDATED: "Inquiry not updated !",

    DELETED: "Inquiry deleted!",
    NOT_DELETED: "Inquiry not deleted !",

    ALREADY_EXISTS: "Inquiry already exists !",
    NOT_AVAILABLE: "Inquiry not available !",

    INVALID_ID: "Inquiry ID is invalid",
  },

  documentFormatMessage: {
    CREATED: "Document format created!",
    NOT_CREATED: "Failed to create Document format.",

    FETCHED: "Document format fetched!",
    NOT_FETCHED: "Document format not fetched !",

    UPDATED: "Document format updated!",
    NOT_UPDATED: "Document format not updated !",

    DELETED: "Document format deleted!",
    NOT_DELETED: "Document format not deleted !",

    ALREADY_EXISTS: "Document format already exists !",
    NOT_AVAILABLE: "Document format not available !",

    INVALID_ID: "Document format ID is invalid",
  },

  kycDocumentMessage: {
    CREATED: "KYC document created!",
    NOT_CREATED: "Failed to create KYC document.",

    FETCHED: "KYC document fetched!",
    NOT_FETCHED: "KYC document not fetched !",

    UPDATED: "KYC document updated!",
    NOT_UPDATED: "KYC document not updated !",

    DELETED: "KYC document deleted!",
    NOT_DELETED: "KYC document not deleted !",

    ALREADY_EXISTS: "KYC document already exists !",
    NOT_AVAILABLE: "KYC document not available !",

    INVALID_ID: "KYC document ID is invalid",
  },

  orderHistoryMessage: {
    CREATED: "Order history created!",
    NOT_CREATED: "Order history not created!",

    FETCHED: "Order history fetched !",
    NOT_FETCHED: "Order history not fetched !",

    UPDATED: "Order history updated!",
    NOT_UPDATED: "Order history not updated !",

    DELETED: "Order history deleted!",
    NOT_DELETED: "Order history not deleted !",

    ALREADY_EXISTS: "Order history already exists !",
    NOT_AVAILABLE: "Order history not available !",

    INVALID_ID: "Order history ID is invalid",
  },

  sizeMessage: {
    CREATED: "Size created!",
    NOT_CREATED: "Size not created!",

    FETCHED: "Size fetched !",
    NOT_FETCHED: "Size not fetched !",

    UPDATED: "Size updated!",
    NOT_UPDATED: "Size not updated !",

    DELETED: "Size deleted!",
    NOT_DELETED: "Size not deleted !",

    ALREADY_EXISTS: "Size already exists !",
    NOT_AVAILABLE: "Size not available !",

    INVALID_ID: "Size ID is invalid",
  },

  productReviewMessage: {
    CREATED: "Product Review created!",
    NOT_CREATED: "Product Review not created!",

    FETCHED: "Product Review fetched !",
    NOT_FETCHED: "Product Review not fetched !",

    UPDATED: "Product Review updated!",
    NOT_UPDATED: "Product Review not updated !",

    DELETED: "Product Review deleted!",
    NOT_DELETED: "Product Review not deleted !",

    ALREADY_EXISTS: "Product Review already exists !",
    NOT_AVAILABLE: "Product Review not available !",

    INVALID_ID: "Product Review ID is invalid",
  },

  finishMessage: {
    CREATED: "Finish created!",
    NOT_CREATED: "Finish not created!",

    FETCHED: "Finish fetched !",
    NOT_FETCHED: "Finish not fetched !",

    UPDATED: "Finish updated!",
    NOT_UPDATED: "Finish not updated !",

    DELETED: "Finish deleted!",
    NOT_DELETED: "Finish not deleted !",

    ALREADY_EXISTS: "Finish already exists !",
    NOT_AVAILABLE: "Finish not available !",

    INVALID_ID: "Finish ID is invalid",
  },

  sizeFinishMessage: {
    CREATED: "Size & Finish created!",
    NOT_CREATED: "Size & Finish not created!",

    FETCHED: "Size & Finish fetched !",
    NOT_FETCHED: "Size & Finish not fetched !",

    UPDATED: "Size & Finish updated!",
    NOT_UPDATED: "Size & Finish not updated !",

    DELETED: "Size & Finish deleted!",
    NOT_DELETED: "Size & Finish not deleted !",

    ALREADY_EXISTS: "Size & Finish already exists !",
    NOT_AVAILABLE: "Size & Finish not available !",

    INVALID_ID: "Size & Finish ID is invalid",
  },

  trainerLevelMessage: {
    CREATED: "Trainer level created!",
    NOT_CREATED: "Trainer level not created!",

    FETCHED: "Trainer level fetched !",
    NOT_FETCHED: "Trainer level not fetched !",

    UPDATED: "Trainer level updated!",
    NOT_UPDATED: "Trainer level not updated !",

    DELETED: "Trainer level deleted!",
    NOT_DELETED: "Trainer level not deleted !",

    ALREADY_EXISTS: "Trainer level already exists !",
    NOT_AVAILABLE: "Trainer level not available !",

    INVALID_ID: "Trainer level ID is invalid",
  },

  trainerDesignationMessage: {
    CREATED: "Trainer designation created!",
    NOT_CREATED: "Trainer designation not created!",

    FETCHED: "Trainer designation fetched !",
    NOT_FETCHED: "Trainer designation not fetched !",

    UPDATED: "Trainer designation updated!",
    NOT_UPDATED: "Trainer designation not updated !",

    DELETED: "Trainer designation deleted!",
    NOT_DELETED: "Trainer designation not deleted !",

    ALREADY_EXISTS: "Trainer designation already exists !",
    NOT_AVAILABLE: "Trainer designation not available !",

    INVALID_ID: "Trainer designation ID is invalid",
  },

  paymentSettingMessage: {
    CREATED: "Payment created!",
    NOT_CREATED: "Payment not created!",

    FETCHED: "Payment fetched !",
    NOT_FETCHED: "Payment not fetched !",

    UPDATED: "Payment updated!",
    NOT_UPDATED: "Payment not updated !",

    DELETED: "Payment deleted!",
    NOT_DELETED: "Payment not deleted !",

    ALREADY_EXISTS: "Payment already exists !",
    NOT_AVAILABLE: "Payment not available !",

    INVALID_ID: "Payment ID is invalid",
  },

  decorSeriesMessage: {
    CREATED: "Decor Series created!",
    NOT_CREATED: "Decor Series not created!",

    FETCHED: "Decor Series fetched !",
    NOT_FETCHED: "Decor Series not fetched !",

    UPDATED: "Decor Series updated!",
    NOT_UPDATED: "Decor Series not updated !",

    DELETED: "Decor Series deleted!",
    NOT_DELETED: "Decor Series not deleted !",

    ALREADY_EXISTS: "Decor Series already exists !",
    NOT_AVAILABLE: "Decor Series not available !",

    INVALID_ID: "Decor Series ID is invalid",
  },

  couponMessage: {
    CREATED: "Coupon created!",
    NOT_CREATED: "Coupon not created!",

    FETCHED: "Coupon fetched !",
    NOT_FETCHED: "Coupon not fetched !",

    UPDATED: "Coupon updated!",
    NOT_UPDATED: "Coupon not updated !",

    DELETED: "Coupon deleted!",
    NOT_DELETED: "Coupon not deleted !",

    ALREADY_EXISTS: "Coupon already exists !",
    NOT_AVAILABLE: "Coupon not available !",

    INVALID_ID: "Coupon ID is invalid",
  },
};

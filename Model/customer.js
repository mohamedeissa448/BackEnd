var mongoose = require("mongoose");
// var bcrypt   = require('bcrypt-nodejs');
var Hcm_CustomerHistorySchema = mongoose.Schema(
  {
    Customer_CheckedBy_User_Code: Number,
    Customer_CheckedDate: Date,
    Customer_EditedBy_User_Code: Number,
    Customer_EditingTime: Date,
    Customer_Name: String,
    Customer_Email: String,
    Customer_Password: String,
    Customer_Country_Code: Number,
    Customer_City: String,
    Customer_Address: String,
    Customer_StoreAddress: String,
    Customer_AddressGPSLocation: String,
    Customer_StoreGPSLocation: String,
    Customer_Phone: String,
    Customer_Contact: [
      {
        Customer_ContactTitle: String,
        Customer_ContactName: String,
        Customer_ContactTelphone: [String],
        Customer_ContactEmail: [String]
      },
      {
        toJSON: { virtuals: true }
      }
    ],
    Customer_LinkedTo_Supplier_Code: Number,
    Customer_FaceBook: String,
    Customer_PaymentMethod_Codes: [Number],
    Customer_WayOfDelivery_Codes: [Number],
    Customer_Agencies: [String],
    Customer_Certificates: [String],
    Customer_Category_IDs: [Number],
    Customer_ProductCategory_Code: [Number],
    Customer_SupplierType_Codes: [Number],
    Customer_Class_Code: Number,
    Customer_Rate: Number,
    Customer_IsActive: Number,
    Customer_SellingAreaCodes: [Number],
    Customer_SellingAreaNames: [String],
    Customer_ExtraField1: String,
    Customer_ExtraField2: String,
    Customer_ExtraField3: String,
    Customer_ExtraField4: String,
    Customer_ExtraField5: String
  },
  {
    toJSON: { virtuals: true }
  }
);
//Customer_Class_Code
Hcm_CustomerHistorySchema.virtual("HistoryCustomerClass", {
  ref: "hcm_lut_classes",
  localField: "Customer_Class_Code",
  foreignField: "Class_Code",
  justOne: true // for 1-to-1 relationships
});
Hcm_CustomerHistorySchema.virtual("HistoryCategory", {
  ref: "hcm_categories",
  localField: "Customer_Category_IDs",
  foreignField: "Category_ID",
  justOne: false // for many-to-1 relationships
});
Hcm_CustomerHistorySchema.virtual("Historyproductcategory", {
  ref: "hcm_lut_porduct_category",
  localField: "Customer_ProductCategory_Code",
  foreignField: "ProductCategory_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_CustomerHistorySchema.virtual("HistoryCustomerType", {
  ref: "hcm_lut_supplier_types",
  localField: "Customer_SupplierType_Codes",
  foreignField: "SupplierType_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerHistorySchema.virtual("HistoryCustomerClass", {
  ref: "hcm_lut_classes",
  localField: "Customer_Class_Code",
  foreignField: "Class_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_CustomerHistorySchema.virtual("Historycountry", {
  ref: "hcm_countries",
  localField: "Customer_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_CustomerHistorySchema.virtual("HistoryPaymentMethod", {
  ref: "hcm_lut_payment_method",
  localField: "Customer_PaymentMethod_Codes",
  foreignField: "PaymentMethod_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerHistorySchema.virtual("HistoryWayOfDeliver", {
  ref: "hcm_lut_ways_of_deliver",
  localField: "Customer_WayOfDelivery_Codes",
  foreignField: "WayOfDelivary_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerHistorySchema.virtual("HistorySellingArea", {
  ref: "hcm_lut_sell_area",
  localField: "Customer_SellingAreaCodes",
  foreignField: "SellingArea_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerHistorySchema.virtual("HistoryEditedUser", {
  ref: "hcm_user",
  localField: "Customer_EditedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_CustomerHistorySchema.virtual("HistoryCheckedUser", {
  ref: "hcm_user",
  localField: "Customer_CheckedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for many-to-1 relationships
});

var Hcm_CustomerSchema = mongoose.Schema(
  {
    Customer_Code: Number,
    Customer_Name: String,
    Customer_Email: String,
    Customer_Password: String,
    Customer_Country_Code: Number,
    Customer_City: String,
    Customer_Address: String,
    Customer_StoreAddress: String,
    Customer_AddressGPSLocation: String,
    Customer_StoreGPSLocation: String,
    Customer_Phone: String,
    Customer_Contact: [
      {
        Customer_ContactTitle: String,
        Customer_ContactName: String,
        Customer_ContactTelphone: [String],
        Customer_ContactEmail: [String]
      },
      {
        toJSON: { virtuals: true }
      }
    ],
    Customer_LinkedTo_Supplier_Code: Number,
    Customer_FaceBook: String,
    Customer_PaymentMethod_Codes: [Number],
    Customer_WayOfDelivery_Codes: [Number],
    Customer_Agencies: [String],
    Customer_Certificates: [String],
    Customer_Category_IDs: [Number],
    Customer_ProductCategory_Code: [Number],
    Customer_SupplierType_Codes: [Number],
    Customer_Class_Code: Number,
    Customer_Rate: Number,
    Customer_IsActive: Number,
    Customer_SellingAreaCodes: [Number],
    Customer_SellingAreaNames: [String],
    Customer_ExtraField1: String,
    Customer_ExtraField2: String,
    Customer_ExtraField3: String,
    Customer_ExtraField4: String,
    Customer_ExtraField5: String,
    Customer_IsChecked: {
      type: Boolean,
      default: false
    },
    Decline_Comment:{
      type :String,
      default:""
    },
    Customer_DeclinedBy_User_Code: Number,
    Customer_EditedBy_User_Code: Number,
    Customer_EditingTime: Date,
    history: [Hcm_CustomerHistorySchema],
    Customer_Documents:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'hcm_lut_document'
    }],
  },

  {
    toJSON: { virtuals: true }
  }
);

Hcm_CustomerSchema.virtual("DeclinedUser", {
  ref: "hcm_user",
  localField: "Customer_DeclinedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for 1-to-1 relationships
});
Hcm_CustomerSchema.methods.verifyPassword = function(password) {
  if (password.localeCompare(this.Customer_Password) == 0) return 1;
  else return 0;
};

Hcm_CustomerSchema.virtual("Category", {
  ref: "hcm_categories",
  localField: "Customer_Category_IDs",
  foreignField: "Category_ID",
  justOne: false // for many-to-1 relationships
});
Hcm_CustomerSchema.virtual("productcategory", {
  ref: "hcm_lut_porduct_category",
  localField: "Customer_ProductCategory_Code",
  foreignField: "ProductCategory_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_CustomerSchema.virtual("CustomerType", {
  ref: "hcm_lut_supplier_types",
  localField: "Customer_SupplierType_Codes",
  foreignField: "SupplierType_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerSchema.virtual("CustomerClass", {
  ref: "hcm_lut_classes",
  localField: "Customer_Class_Code",
  foreignField: "Class_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_CustomerSchema.virtual("country", {
  ref: "hcm_countries",
  localField: "Customer_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_CustomerSchema.virtual("PaymentMethod", {
  ref: "hcm_lut_payment_method",
  localField: "Customer_PaymentMethod_Codes",
  foreignField: "PaymentMethod_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerSchema.virtual("WayOfDeliver", {
  ref: "hcm_lut_ways_of_deliver",
  localField: "Customer_WayOfDelivery_Codes",
  foreignField: "WayOfDelivary_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_CustomerSchema.virtual("sellingArea", {
  ref: "hcm_lut_sell_area",
  localField: "Customer_SellingAreaCodes",
  foreignField: "SellingArea_Code",
  justOne: false // for many-to-1 relationships
});

// Hcm_SupplierSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

var Customer = (module.exports = mongoose.model(
  "hcm_customer",
  Hcm_CustomerSchema
));

module.exports.getLastCode = function(callback) {
  Customer.findOne({}, callback).sort({ Customer_Code: -1 });
};

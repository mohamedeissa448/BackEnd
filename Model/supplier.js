var mongoose = require("mongoose");
// var bcrypt   = require('bcrypt-nodejs');
var Hcm_SupplierFinancialTransactionSchema =new mongoose.Schema({
  
  SupplierFinancialTransaction_SysDate                   : { // automatic record the insert date
      type:Date,
      default:    new Date(),
  },
  SupplierFinancialTransaction_Date                      : Date, // As Defined in the action
  SupplierFinancialTransaction_MathSign                  : Number, // (-1 for Payments or returns) and (1 for Purchasing)
  SupplierFinancialTransaction_Amount                    : Number ,
  SupplierFinancialTransaction_Bill                      : { // filled if Bill
      type:mongoose.Schema.Types.ObjectId,
      ref:'hcm_bill'
  },
  SupplierFinancialTransaction_BillReturn                : { // filled if Bill return
      type:mongoose.Schema.Types.ObjectId,
      ref:'hcm_bill_return'
  },
  SupplierFinancialTransaction_Payment                   : { // filled if Payment
    type:mongoose.Schema.Types.ObjectId,
    ref:'hcm_supplier_payment'
  },
  
  SupplierFinancialTransaction_Type                      : String, // Bill, Bill return, Payment
});
var Hcm_SupplierHistorySchema = mongoose.Schema(
  {
    Supplier_CheckedBy_User_Code: Number,
    Supplier_CheckedDate: Date,
    Supplier_EditedBy_User_Code: Number,
    Supplier_EditingTime: Date,
    Supplier_IsSupplier: Number,
    Supplier_IsManufacturer: Number,
    Supplier_Name: String,
    Supplier_Email: String,
    Supplier_Password: String,
    Supplier_Country_Code: Number,
    Supplier_City: String,
    Supplier_Address: String,
    Supplier_StoreAddress: String,
    Supplier_AddressGPSLocation: String,
    Supplier_StoreGPSLocation: String,
    Supplier_Phone: String,
    Supplier_Contact: [
      {
        Supplier_ContactTitle: String,
        Supplier_ContactName: String,
        Supplier_ContactTelphone: [String],
        Supplier_ContactEmail: [String]
      },
      {
        toJSON: { virtuals: true }
      }
    ],
    Supplier_LinkedTo_Supplier_Code: Number,
    Supplier_FaceBook: String,
    Supplier_PaymentMethod_Codes: [Number],
    Supplier_WayOfDelivery_Codes: [Number],
    Supplier_Agencies: [String],
    Supplier_Certificates: [String],
    Supplier_Category_IDs: [Number],
    Supplier_ProductCategory_Code: [Number],
    Supplier_SupplierType_Codes: [Number],
    Supplier_Class_Code: Number,
    Supplier_Rate: Number,
    Supplier_IsActive: Number,
    Supplier_SellingAreaCodes: [Number],
    Supplier_SellingAreaNames: [String],
    Supplier_ExtraField1: String,
    Supplier_ExtraField2: String,
    Supplier_ExtraField3: String,
    Supplier_ExtraField4: String,
    Supplier_ExtraField5: String
  },
  {
    toJSON: { virtuals: true }
  }
);
//Supplier
Hcm_SupplierHistorySchema.virtual("HistorySupplierClass", {
  ref: "hcm_lut_classes",
  localField: "Supplier_Class_Code",
  foreignField: "Class_Code",
  justOne: true // for 1-to-1 relationships
});
Hcm_SupplierHistorySchema.virtual("HistoryCategory", {
  ref: "hcm_categories",
  localField: "Supplier_Category_IDs",
  foreignField: "Category_ID",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierHistorySchema.virtual("Historyproductcategory", {
  ref: "hcm_lut_porduct_category",
  localField: "Supplier_ProductCategory_Code",
  foreignField: "ProductCategory_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierHistorySchema.virtual("HistorySupplierType", {
  ref: "hcm_lut_supplier_types",
  localField: "Supplier_SupplierType_Codes",
  foreignField: "SupplierType_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_SupplierHistorySchema.virtual("HistorySupplierClass", {
  ref: "hcm_lut_classes",
  localField: "Supplier_Class_Code",
  foreignField: "Class_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_SupplierHistorySchema.virtual("Historycountry", {
  ref: "hcm_countries",
  localField: "Supplier_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});

Hcm_SupplierHistorySchema.virtual("HistoryPaymentMethod", {
  ref: "hcm_lut_payment_method",
  localField: "Supplier_PaymentMethod_Codes",
  foreignField: "PaymentMethod_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_SupplierHistorySchema.virtual("HistoryWayOfDeliver", {
  ref: "hcm_lut_ways_of_deliver",
  localField: "Supplier_WayOfDelivery_Codes",
  foreignField: "WayOfDelivary_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_SupplierHistorySchema.virtual("HistorySellingArea", {
  ref: "hcm_lut_sell_area",
  localField: "Supplier_SellingAreaCodes",
  foreignField: "SellingArea_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_SupplierHistorySchema.virtual("HistoryEditedUser", {
  ref: "hcm_user",
  localField: "Supplier_EditedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_SupplierHistorySchema.virtual("HistoryCheckedUser", {
  ref: "hcm_user",
  localField: "Supplier_CheckedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for many-to-1 relationships
});

var Hcm_SupplierSchema = mongoose.Schema(
  {
    Supplier_Code: Number,
    Supplier_Name: String,
    Supplier_Email: String,
    Supplier_Password: String,
    Supplier_Country_Code: Number,
    Supplier_City: String,
    Supplier_Address: String,
    Supplier_StoreAddress: String,
    Supplier_AddressGPSLocation: String,
    Supplier_StoreGPSLocation: String,
    Supplier_Phone: String,
    Supplier_Contact: [
      {
        Supplier_ContactTitle: String,
        Supplier_ContactName: String,
        Supplier_ContactTelphone: [String],
        Supplier_ContactEmail: [String]
      },
      {
        toJSON: { virtuals: true }
      }
    ],
    Supplier_LinkedTo_Customer_Code: Number,
    Supplier_FaceBook: String,
    Supplier_PaymentMethod_Codes: [Number],
    Supplier_WayOfDelivery_Codes: [Number],
    Supplier_TimeOfDelivery: String,
    Supplier_Agencies: [String],
    Supplier_Certificates: [String],
    Supplier_Category_IDs: [Number],
    Supplier_ProductCategory_Code:[Number],//eissa:product categories in sys-setup
    Supplier_SupplierType_Codes: [Number],
    Supplier_Class_Code: Number,
    Supplier_Rate: Number,
    Supplier_IsActive: Number,
    Supplier_SellingAreaCodes: [Number],
    Supplier_SellingAreaNames: [String],
    Supplier_IsSupplier: Number,
    Supplier_IsManufacturer: Number,
    Supplier_ExtraField1: String,
    Supplier_ExtraField2: String,
    Supplier_ExtraField3: String,
    Supplier_ExtraField4: String,
    Supplier_ExtraField5: String,
    Supplier_IsChecked: {
      type: Boolean,
      default: false
    },
    Decline_Comment:{
      type :String,
      default:""
    },
    Supplier_DeclinedBy_User_Code: Number,
    Supplier_EditedBy_User_Code: Number,
    Supplier_EditingTime: Date,
    history: [Hcm_SupplierHistorySchema],
    Supplier_FinancialTransaction : [Hcm_SupplierFinancialTransactionSchema],
    Supplier_Documents:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'hcm_lut_document'
    }]
  },
  {
    toJSON: { virtuals: true }
  }
);

Hcm_SupplierSchema.virtual("DeclinedUser", {
  ref: "hcm_user",
  localField: "Supplier_DeclinedBy_User_Code",
  foreignField: "User_Code",
  justOne: true // for 1-to-1 relationships
});
Hcm_SupplierSchema.methods.verifyPassword = function(password) {
  if (password.localeCompare(this.Supplier_Password) == 0) return 1;
  else return 0;
};
Hcm_SupplierSchema.virtual("Category", {
  ref: "hcm_categories",
  localField: "Supplier_Category_IDs",
  foreignField: "Category_ID",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("productcategory", {
  ref: "hcm_lut_porduct_category",
  localField: "Supplier_ProductCategory_Code",
  foreignField: "ProductCategory_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("SupplierType", {
  ref: "hcm_lut_supplier_types",
  localField: "Supplier_SupplierType_Codes",
  foreignField: "SupplierType_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("supplierclass", {
  ref: "hcm_lut_classes",
  localField: "Supplier_Class_Code",
  foreignField: "Class_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("country", {
  ref: "hcm_countries",
  localField: "Supplier_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("sellingArea", {
  ref: "hcm_lut_sell_area",
  localField: "Supplier_SellingAreaCodes",
  foreignField: "SellingArea_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("PaymentMethod", {
  ref: "hcm_lut_payment_method",
  localField: "Supplier_PaymentMethod_Codes",
  foreignField: "PaymentMethod_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_SupplierSchema.virtual("WayOfDelivery", {
  ref: "hcm_lut_ways_of_deliver",
  localField: "Supplier_WayOfDelivery_Codes",
  foreignField: "WayOfDelivary_Code",
  justOne: false // for many-to-1 relationships
});
Hcm_SupplierSchema.virtual("SupplierClass", {
  ref: "hcm_lut_classes",
  localField: "Supplier_Class_Code",
  foreignField: "Class_Code",
  justOne: false // for many-to-1 relationships
});

// Hcm_SupplierSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

var Suppliers = (module.exports = mongoose.model(
  "hcm_supplier",
  Hcm_SupplierSchema
));

module.exports.getLastCode = function(callback) {
  Suppliers.findOne({}, callback).sort({ Supplier_Code: -1 });
};

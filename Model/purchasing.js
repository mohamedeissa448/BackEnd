var mongoose = require("mongoose");

var Hcm_CashSchema=new mongoose.Schema({
  Paying_Date: Date,
  Number_Of_Days_From_Purchasing_To_Paying: Number,
  Amount_Of_Paying: Number,
})

var Hcm_ChequeSchema=new mongoose.Schema({
  Number_Of_Days_From_Purchasing_To_Paying: Number,
  Cheque_Date: Date,
  Amount_Of_Paying: Number,
})

var Hcm_PurchasingSchema =new mongoose.Schema({
    Product_Code: Number,
    Product_Name: String,
    Supplier_Code: Number,//unique for each product in store
    Supplier_Name: String,//unique for each product in store
    Product_Manufacturer_Name: String,//unique for each product in store
    Product_Manufacturer_Code: Number,//unique for each product in store//could be removed
    Product_Origin_Country_Code: Number,//unique for each product in store
    Product_BatchNumber: String,//unique for each product in store
    Product_Date_Of_Production: Date,//unique for each product in store
    Product_Date_Of_Expiration: Date,//unique for each product in store
    Product_Purchasing_Date: Date,
    Product_Weight_Unit_Code:Number,
    Product_Package_Weight:Number,
    Product_Number_Of_Packages:Number,
    Product_Quantity:Number,//الكميه الكليه او الرصيد
    Product_Incoming_Bill_Is_taxed:Boolean,
    Product_Incoming_Bill_Number: String,//لو مش ضريبيه نزود واحد علي اخر رقم موجود في السيستم
    Product_Incoming_Supplier_Permission_Number: String,//لو مش ضريبيه نزود واحد علي اخر رقم موجود في السيست
    Product_Incoming_HighChem_Permission_Number: {//اذن امين المخزنةmust be updated when adding or editing store in store controller file
      type:String,
      default: ''
    },
    Price_Of_Unit_Before_Taxes:{
      type: Number,
      default: 0
    },
    Amount_Of_Taxes:{//as a percentage,example 14
      type: Number,
      default: 0
    },
    Total_Price_Before_Taxes:{
      type: Number,
      default: 0
    },
    Taxes_Value:{
      type: Number,
      default: 0
    },
    Total_Price_After_Taxes:{
      type: Number,
      default: 0
    },
    Cash_Payments:[Hcm_CashSchema],
    Cheque_Payments:[Hcm_ChequeSchema],
    Total_Paid_Price:{ //مجموع ماتم سداده must be update by the sum of cashes and cheques amount of paying from payment model
     type: Number,
     default: 0
    },
    Extra1: String,
    Extra2: String,
    Extra3: String,
    Extra4: String,
    Extra5: String,
    PurchasingProduct_CreatedByUser: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "hcm_user" 
    }
  },
  {
    toJSON: { virtuals: true }
  }
    );

Hcm_PurchasingSchema.virtual("weight", {
    ref: "hcm_lut_weight",
    localField: "Product_Weight_Unit_Code",
    foreignField: "Weight_Code",
    justOne: true // for 1-to-1 relationships
  });
  Hcm_PurchasingSchema.virtual("country", {
    ref: "hcm_countries",
    localField: "Product_Origin_Country_Code",
    foreignField: "Country_Code",
    justOne: true // for 1-to-1 relationships
  });
  Hcm_PurchasingSchema.virtual("Manufacturer", {
    ref: "hcm_supplier",
    localField: "Product_Manufacturer_Code",
    foreignField: "Supplier_Code",
    justOne: false // for many-to-1 relationships
  });
  var purchase = (module.exports = mongoose.model(
    "Purchasing",
    Hcm_PurchasingSchema
  ));

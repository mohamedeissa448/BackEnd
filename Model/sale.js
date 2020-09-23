var mongoose = require("mongoose");
var Hcm_InfoSchema=new mongoose.Schema({
  Name: String,
  Address: String,
  ID_Number: String,
  Position: String
});

var Hcm_CashSchema=new mongoose.Schema({
  Paying_Date: Date,
  Number_Of_Days_From_Selling_To_Be_Paid: Number,
  Amount_Of_Paying: Number,
 // HigChem_Delivering_Cash_Number: String,
 // Supplier_Recieving_Cash_Number: String,
 // HigChem_Safe_Keeper_Name: String,
 // Supplier_Reciever_Info:  Hcm_InfoSchema
})
var Hcm_ChequeDetailsSchema=new mongoose.Schema({
  Bank_Name :String,
  Bank_Branch :String,
  Cheque_Number :String,
  Cheque_Date: Date //تاريخ الاستحقاق
})
var Hcm_ChequeSchema=new mongoose.Schema({
  Number_Of_Days_From_Selling_To_Be_Paid: Number,
  Cheque_Date: Date,
  Amount_Of_Paying: Number,
 // HigChem_Delivering_Cheque_Number: String,
 // Supplier_Recieving_Cheque_Number: String,
 // HigChem_Safe_Keeper_Name: String,
 // Supplier_Reciever_Info:  Hcm_InfoSchema,
 // Cheque_Details: Hcm_ChequeDetailsSchema
})

var Hcm_SaleSchema =new mongoose.Schema({
  //only these two are useful for searches
    Product_Code: Number,
    Product_Name: String,
    //Supplier_Code: Number,//unique for each product in store
    //Supplier_Name: String,//unique for each product in store
    //Product_Manufacturer_Name: String,//unique for each product in store
   // Product_Manufacturer_Code: Number,//unique for each product in store//could be removed
   // Product_Origin_Country_Code: Number,//unique for each product in store
   // Product_BatchNumber: String,//unique for each product in store
   // Product_Date_Of_Production: Date,//unique for each product in store
   // Product_Date_Of_Expiration: Date,//unique for each product in store
    Product_Selling_Date: Date,
    Product_ID_In_Store:{
        type:mongoose.Schema.Types.ObjectId
    },
    Product_Sold_To_Customer_Code:Number,//refers to the customer code in hcn_customer model
    Product_Sold_To_Customer_Name: String, //important for searches and كشف حساب العميل
    Product_Weight_Unit_Code:Number,
    Product_Package_Weight:Number,
    Product_Number_Of_Packages:Number,
    Product_Quantity:Number,//الكميه الكليه او الرصيد
    Product_OutGoing_Bill_Is_taxed:Boolean,
    Product_OutGoing_Bill_Number: String,//لو مش ضريبيه نزود واحد علي اخر رقم موجود في السيستم
    Product_OutGoing_Customer_Permission_Number: String,//لو مش ضريبيه نزود واحد علي اخر رقم موجود في السيست
    //Product_OutGoing_HighChem_Permission_Number: String,
    Price_Of_Unit_Before_Taxes:{
      type: Number,
      default: 0
    },
    Amount_Of_Taxes:{
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
    Total_Receivable_Price:{//مجموع ماتم الحصول عليه must be update by the sum of cashes and cheques amount of paying from receivable model
      type: Number,
      default: 0
    },
    Cash_Payments:[Hcm_CashSchema],
    Cheque_Payments:[Hcm_ChequeSchema],
    Extra1: String,
    Extra2: String,
    Extra3: String,
    Extra4: String,
    Extra5: String,
    SellingProduct_CreatedByUser: { 
        type: mongoose.Schema.Types.ObjectId
    }
  },
  {
    toJSON: { virtuals: true }
  }
);

Hcm_SaleSchema.virtual("product_In_Store", {
    ref: "StoreProduct",
    localField: "Product_ID_In_Store",
    foreignField: "_id",
    justOne: true // for 1-to-1 relationships
});
Hcm_SaleSchema.virtual("customer", {
    ref: "hcm_customer",
    localField: "Product_Sold_To_Customer_Code",
    foreignField: "Customer_Code",
    justOne: true // for 1-to-1 relationships
});
Hcm_SaleSchema.virtual("weight", {
    ref: "hcm_lut_weight",
    localField: "Product_Weight_Unit_Code",
    foreignField: "Weight_Code",
    justOne: true // for 1-to-1 relationships
  });
  Hcm_SaleSchema.virtual("country", {
    ref: "hcm_countries",
    localField: "Product_Origin_Country_Code",
    foreignField: "Country_Code",
    justOne: true // for 1-to-1 relationships
  });
  Hcm_SaleSchema.virtual("Manufacturer", {
    ref: "hcm_supplier",
    localField: "Product_Manufacturer_Code",
    foreignField: "Supplier_Code",
    justOne: false // for many-to-1 relationships
  });
  Hcm_SaleSchema.virtual("user", {
    ref: "hcm_user",
    localField: "SellingProduct_CreatedByUser",
    foreignField: "_id",
    justOne: true // for 1-to-1 relationships
  });
  var saleProduct = (module.exports = mongoose.model(
    "Sale",
    Hcm_SaleSchema
  ));

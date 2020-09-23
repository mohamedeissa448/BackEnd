var mongoose = require("mongoose");

var Hcm_OutGoingSchema = mongoose.Schema({
    Sale_ID:{ //refers to the id of the sale document that this product has been sold
      type:mongoose.Schema.Types.ObjectId
    },
    Product_OutGoing_Quantity: Number,
    Product_OutGoing_Bill_Is_taxed:Boolean,
    Product_OutGoing_Bill_Number: String,
    Product_OutGoing_Customer_Permission_Number: String,  
    Product_OutGoing_HighChem_Permission_Number: String ,
    Product_OutGoing_Date: Date
});
var Hcm_StoreProductSchema = mongoose.Schema({
    Store_Code:Number,
    Store_Name:String,
    Product_Storing_Date: Date,
    Product_Purchasing_ID:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Purchasing",
    },
    Product_Incoming_HighChem_Permission_Number: String,//اذن امين المخزن
    Product_OutGoing: [ Hcm_OutGoingSchema ],
    Product_Current_Quantity: Number,/*first its value is the quantity that has been purchases,then its value is 
    subtracted by the sum of Product_OutGoing_Quantity properties in Product_OutGoing array 
    Very Important :should be updated when purcasing document ,which its id is stored in Product_Purchasing_ID, is updated*/
    StoreProduct_CreatedByUser: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "hcm_user" 
    },
    Extra1: String,
    Extra2: String,
    Extra3: String,
    Extra4: String,
    Extra5: String,
    //only useful for searches,should be updated when purcasing document ,which its id is stored in Product_Purchasing_ID, is updated
    Product_Code: Number,
    Product_Name: String,
    Supplier_Code: Number,
    Supplier_Name: String,
    Product_Incoming_Bill_Number: String,
    Product_Incoming_Supplier_Permission_Number: String,
    Product_BatchNumber: String,
    Product_Origin_Country_Code : Number,
    Product_Date_Of_Expiration : Date,
    Product_Number_Of_Packages :Number
},
{
  toJSON: { virtuals: true }
}
);

Hcm_StoreProductSchema.virtual("sales", {
  ref: "Sale",
  localField: "Product_OutGoing.Sale_ID",
  foreignField: "_id",
  justOne: false // for 1-to-1 relationships
});

Hcm_StoreProductSchema.virtual("purchasing", {
  ref: "Purchasing",
  localField: "Product_Purchasing_ID",
  foreignField: "_id",
  justOne: true // for 1-to-1 relationships
});
Hcm_StoreProductSchema.virtual("country", {
  ref: "hcm_countries",
  localField: "Product_Origin_Country_Code",
  foreignField: "Country_Code",
  justOne: true // for many-to-1 relationships
});

  
  var storeProduct = (module.exports = mongoose.model(
    "StoreProduct",
    Hcm_StoreProductSchema
  ));

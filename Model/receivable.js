var mongoose = require("mongoose");
var Hcm_InfoSchema=new mongoose.Schema({
  Name: String,
  Address: String,
  ID_Number: String,
  Position: String
});

var Hcm_CashSchema=new mongoose.Schema({
  Paying_Date: Date,
  Amount_Of_Paying: Number,
  HigChem_Receiving_Cash_Number: String,
  Customer_Delivering_Cash_Number: String,
  HigChem_Safe_Keeper_Name: String,
  Customer_Deliverer_Info:  Hcm_InfoSchema
})
var Hcm_ChequeDetailsSchema=new mongoose.Schema({
  Bank_Name :String,
  Bank_Branch :String,
  Cheque_Number :String,
  Cheque_Date: Date //تاريخ الاستحقاق
})
var Hcm_ChequeSchema=new mongoose.Schema({
  Amount_Of_Paying: Number,
  HigChem_Receiving_Cheque_Number: String,
  Customer_Delivering_Cheque_Number: String,
  HigChem_Safe_Keeper_Name: String,
  Customer_Deliverer_Info:  Hcm_InfoSchema,
  Cheque_Details: Hcm_ChequeDetailsSchema
})

var Hcm_ReceivableSchema =new mongoose.Schema({
    Product_Selling_ID:{
        type:mongoose.Schema.Types.ObjectId,
    },
    Payment_Method_Name: String,
    Cash_Payment:Hcm_CashSchema,
    Cheque_Payment:Hcm_ChequeSchema,
    Receivable_CreatedByUser: { 
        type: mongoose.Schema.Types.ObjectId,
    }
  },
  {
    toJSON: { virtuals: true }
  }
    );

Hcm_ReceivableSchema.virtual("selling", {
    ref: "Sale",
    localField: "Product_Selling_ID",
    foreignField: "_id",
    justOne: true // for 1-to-1 relationships
  });
  Hcm_ReceivableSchema.virtual("user", {
    ref: "hcm_user",
    localField: "Receivable_CreatedByUser",
    foreignField: "_id",
    justOne: true // for 1-to-1 relationships
  });
  var Receivable = (module.exports = mongoose.model(
    "Receivable",
    Hcm_ReceivableSchema
  ));

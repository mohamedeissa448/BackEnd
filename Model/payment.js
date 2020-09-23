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
  HigChem_Delivering_Cash_Number: String,
  Supplier_Recieving_Cash_Number: String,
  HigChem_Safe_Keeper_Name: String,
  Supplier_Reciever_Info:  Hcm_InfoSchema
})
var Hcm_ChequeDetailsSchema=new mongoose.Schema({
  Bank_Name :String,
  Bank_Branch :String,
  Cheque_Number :String,
  Cheque_Date: Date //تاريخ الاستحقاق
})
var Hcm_ChequeSchema=new mongoose.Schema({
  Amount_Of_Paying: Number,
  HigChem_Delivering_Cheque_Number: String,
  Supplier_Recieving_Cheque_Number: String,
  HigChem_Safe_Keeper_Name: String,
  Supplier_Reciever_Info:  Hcm_InfoSchema,
  Cheque_Details: Hcm_ChequeDetailsSchema
})

var Hcm_PaymentSchema =new mongoose.Schema({
    Product_Purchasing_ID:{
        type:mongoose.Schema.Types.ObjectId,
    },
    Payment_Method_Name: String,
    Cash_Payment:Hcm_CashSchema,
    Cheque_Payment:Hcm_ChequeSchema,
    Payment_CreatedByUser: { 
        type: mongoose.Schema.Types.ObjectId,
    }
  },
  {
    toJSON: { virtuals: true }
  }
    );

Hcm_PaymentSchema.virtual("purchasing", {
    ref: "Purchasing",
    localField: "Product_Purchasing_ID",
    foreignField: "_id",
    justOne: true // for 1-to-1 relationships
  });
  Hcm_PaymentSchema.virtual("user", {
    ref: "hcm_user",
    localField: "Payment_CreatedByUser",
    foreignField: "_id",
    justOne: true // for 1-to-1 relationships
  });
  var payment = (module.exports = mongoose.model(
    "Payment",
    Hcm_PaymentSchema
  ));

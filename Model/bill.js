var mongoose = require('mongoose');
var ProductIncreaseSchema = require('./general-schemas/product-increase-schema'); 

var BillSchema =new mongoose.Schema({
    
    Bill_Code     	                : Number, //auto increment
    Bill_SysDate                   : { // automatic record the insert date
        type:Date,
        default:    new Date(),
    },
    Bill_Date                      : Date, // selected by user
    Bill_Note                      : String,
    Bill_DoneBy_User               : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_user'
    },
    Bill_Supplier               : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_supplier'
    },
    Bill_TaxAmount                 : Number,
    Bill_TotalAmount               : Number,//total cost of products (auto calculated on interface)
    Bill_FinalAmount               : Number,//total cost of products + tax
    Bill_PaymentMethod        : {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'hcm_lut_payment_method'
    },
    Bill_Products                  : [ProductIncreaseSchema],
});

Bill = module.exports = mongoose.model('hcm_bill',BillSchema);

module.exports.getLastCode = function(callback){
    
    Bill.findOne({},callback).sort({Bill_Code:-1});
}
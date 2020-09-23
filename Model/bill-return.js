var mongoose = require('mongoose');
var ProductDecreaseSchema = require('./general-schemas/product-decrease-schema'); 

var BillReturnSchema =new mongoose.Schema({
    
    BillReturn_Code     	                : Number, //auto increment
    BillReturn_SysDate                   : { // automatic record the insert date
        type:Date,
        default:    new Date(),
    },
    BillReturn_Date                      : Date, // selected by user
    BillReturn_Note                      : String,
    BillReturn_DoneBy_User               : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_user'
    },
    Bill_Supplier               : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_supplier'
    },
    BillReturn_Products                  : [ProductDecreaseSchema],
});

BillReturn = module.exports = mongoose.model('hcm_bill_return',BillReturnSchema);

module.exports.getLastCode = function(callback){
    
    BillReturn.findOne({},callback).sort({BillReturn_Code:-1});
}
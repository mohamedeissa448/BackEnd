var mongoose = require('mongoose');
var ProductIncreaseSchema = require('./general-schemas/product-increase-schema'); 

var IncreaseInventorySchema =new mongoose.Schema({
    
    IncreaseInventory_Code     	                : Number, //auto increment
    IncreaseInventory_SysDate                   : { // automatic record the insert date
        type:Date,
        default:    new Date(),
    },
    IncreaseInventory_Date                      : Date, // selected by user
    IncreaseInventory_Note                      : String,
    IncreaseInventory_DoneBy_User               : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_user'
    },
    IncreaseInventory_Products                  : [ProductIncreaseSchema],
});

IncreaseInventory = module.exports = mongoose.model('hcm_increase_inventory',IncreaseInventorySchema);

module.exports.getLastCode = function(callback){
    
    IncreaseInventory.findOne({},callback).sort({IncreaseInventory_Code:-1});
}
var mongoose = require('mongoose');
var ProductDecreaseSchema = require('./general-schemas/product-decrease-schema'); 

var DecreaseInventorySchema =new mongoose.Schema({
    
    DecreaseInventory_Code     	                : Number, //auto increment
    DecreaseInventory_SysDate                   : { // automatic record the insert date
        type:Date,
        default:    new Date(),
    },
    DecreaseInventory_Date                      : Date, // selected by user
    DecreaseInventory_Note                      : String,
    DecreaseInventory_DoneBy_User               : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_user'
    },
    DecreaseInventory_Products                  : [ProductDecreaseSchema],
});

DecreaseInventory = module.exports = mongoose.model('hcm_decrease_inventory',DecreaseInventorySchema);

module.exports.getLastCode = function(callback){
    
    DecreaseInventory.findOne({},callback).sort({DecreaseInventory_Code:-1});
}
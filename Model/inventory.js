var mongoose = require('mongoose');

var Hcm_InventorySchema = mongoose.Schema({
    
	Inventory_Code    		      : Number,
    Inventory_Name     	   	      : String,
    Inventory_Location            : String,
    Inventory_Related_To_Company  : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "hcm_company" 
    },
    Inventory_Related_To_Branch   : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "hcm_Branch"
    },
    Inventory_Keeper              : String, // امين المخزن
   

});


var Inventory = module.exports = mongoose.model('hcm_Inventory', Hcm_InventorySchema);

module.exports.getLastCode = function(callback){
    
    Inventory.findOne({},callback).sort({Inventory_Code:-1});
}
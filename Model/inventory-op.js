var mongoose = require('mongoose');
var productsSchema = mongoose.Schema({
    Product_Code               : Number,
    Product_Name               : String,
    Product_Weight_Unit_Code   : {
        type :mongoose.Schema.Types.ObjectId,
        ref  : 'hcm_lut_weight'
    },
    Product_Quantity           : Number,
});
//الارصده الافتتاحيه
var Hcm_Inventory_OperationSchema = mongoose.Schema({
    
	Inventory_Operation_Code    		       : Number,
    Inventory_Operation_Date    	   	       : Date,
    Inventory_Operation_SysDate                : { // automatic record the insert date
        type: Date,
        default:    new Date(),
    },
    Inventory_Operation_Info                   : String,
    Inventory_Operation_Related_To_Company     : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "hcm_company" 
    },
    Inventory_Operation_Related_To_Branch      : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "hcm_Branch"
    },
    Inventory_Operation_Related_To_Inventory    : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "hcm_Inventory"
    },
    Inventory_Operation_Products                : [productsSchema],
    Inventory_Operation_Approved                : {
        type    : Boolean,
        default : false
    }
});


var Inventory_Operation = module.exports = mongoose.model('hcm_Inventory_Operation', Hcm_Inventory_OperationSchema);

module.exports.getLastCode = function(callback){
    
    Inventory_Operation.findOne({},callback).sort({Inventory_Operation_Code:-1});
}
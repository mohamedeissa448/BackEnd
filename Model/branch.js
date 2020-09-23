var mongoose = require('mongoose');

var Hcm_BranchSchema = mongoose.Schema({
    
	Branch_Code    		      : Number,
    Branch_Name     	   	  : String,
    Branch_Location           : String,
    Branch_Related_To_Company : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "hcm_company" 
    },
    Branch_Type_Of_Business   : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "hcm_lut_type_of_business"
    },
    Branch_Accountant         : String, //الشخص المسؤول
   
    Branch_Has_Inventories    : Boolean

});


var Branch = module.exports = mongoose.model('hcm_Branch', Hcm_BranchSchema);

module.exports.getLastCode = function(callback){
    
    Branch.findOne({},callback).sort({Branch_Code:-1});
}
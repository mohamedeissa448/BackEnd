var mongoose = require('mongoose');

var Hcm_TypeOfBusinessSchema = mongoose.Schema({
    
	Type_Of_Business_Code     	    :Number,
    Type_Of_Business_Name     	    : String,
    Type_Of_Business_Description    :String,
    Type_Of_Business_IsActive       :{
        type : Boolean,
        default : true
    },
    
});


TypeOfBusiness = module.exports = mongoose.model('hcm_lut_type_of_business', Hcm_TypeOfBusinessSchema);

module.exports.getLastCode = function(callback){
    
    TypeOfBusiness.findOne({},callback).sort({Type_Of_Business_Code:-1});
}


var mongoose = require('mongoose');

var Hcm_CountriesSchema = mongoose.Schema({
    
	Country_Code     	:Number,
    Country_Name     	:{
	       type: String,
	       required: true
	  },
    Country_IsActive	:Number,
    Country_Tcode		:String
    
});


var Countries = module.exports = mongoose.model('hcm_countries', Hcm_CountriesSchema);


module.exports.getLastCode = function(callback){
    
    Countries.findOne({},callback).sort({Country_Code:-1});
}
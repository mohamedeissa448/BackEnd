var mongoose = require('mongoose');

var Hcm_CompanySchema = mongoose.Schema({
    
	Company_Code    		: Number,
    Company_Name     		: String,
    Company_Telephone       : String,
    Company_WebSite    		: String,
    Company_Email           : String,
    Company_Info            : String,
   
});


var Company = module.exports = mongoose.model('hcm_company', Hcm_CompanySchema);

module.exports.getLastCode = function(callback){
    
    Company.findOne({},callback).sort({Company_Code:-1});
}
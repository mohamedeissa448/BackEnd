var mongoose = require('mongoose');

var Hcm_ReleaseTypeSchema = mongoose.Schema({
    
	ReleaseType_Code     	  :Number,
    ReleaseType_Name     	  : String,
    ReleaseType_Description   :String,
    ReleaseType_IsActive      :Number,
    
});


ReleaseType = module.exports = mongoose.model('hcm_lut_release_type', Hcm_ReleaseTypeSchema);


module.exports.getLastCode = function(callback){
    
    ReleaseType.findOne({},callback).sort({ReleaseType_Code:-1});
}
var mongoose = require('mongoose');

var Hcm_StorageTypeSchema = mongoose.Schema({
    
	StorageType_Code     	  :Number,
    StorageType_Name     	  : String,
    StorageType_Description    :String,
    StorageType_IsActive       :Number,
    
});


StorageType = module.exports = mongoose.model('hcm_lut_storage_type', Hcm_StorageTypeSchema);


module.exports.getLastCode = function(callback){
    
    StorageType.findOne({},callback).sort({StorageType_Code:-1});
}
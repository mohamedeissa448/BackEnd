var mongoose = require('mongoose');

var Hcm_CertificateSchema = mongoose.Schema({
    
	Certificate_Code     	   :Number,
    Certificate_Name     	   :String,
    Certificate_Description    :String,
    Certificate_IsActive       :Number,
});


Certificate = module.exports = mongoose.model('hcm_lut_certificate', Hcm_CertificateSchema);


module.exports.getLastCode = function(callback){
    
    Certificate.findOne({},callback).sort({Certificate_Code:-1});
}
var mongoose = require('mongoose');

var Hcm_DocumentSchema = mongoose.Schema({
    
    Document_Name           :String,
    Document_Url    	   :String,
    Document_Description    :String,
    Document_End_Date       :String,
});


Document = module.exports = mongoose.model('hcm_lut_document', Hcm_DocumentSchema);

module.exports.getLastCode = function(callback){
    
    Certificate.findOne({},callback).sort({Certificate_Code:-1});
}
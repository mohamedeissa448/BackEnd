var mongoose = require('mongoose');

var Hcm_PackingSchema = mongoose.Schema({
    
	Packing_Code     	  :Number,
    Packing_Name     	  : String,
    Packing_Description   :String,
    Packing_IsActive      :Number,
    
});


Packing = module.exports = mongoose.model('hcm_lut_packing', Hcm_PackingSchema);

module.exports.getLastCode = function(callback){
    
    Packing.findOne({},callback).sort({Packing_Code:-1});
}
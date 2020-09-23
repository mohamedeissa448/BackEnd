var mongoose = require('mongoose');

var Hcm_WeightSchema = mongoose.Schema({
    
	Weight_Code     	  :Number,
    Weight_Name     	  : String,
    Weight_Description  :String,
    Weight_IsActive     :Number,    
});


Weight = module.exports = mongoose.model('hcm_lut_weight', Hcm_WeightSchema);


module.exports.getLastCode = function(callback){
    
    Weight.findOne({},callback).sort({Weight_Code:-1});
}
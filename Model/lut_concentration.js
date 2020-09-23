var mongoose = require('mongoose');

var Hcm_ConcentrationSchema = mongoose.Schema({
    
	Concentration_Code     	  :Number,
    Concentration_Name     	  : String,
    Concentration_Description  :String,
    Concentration_IsActive     :Number,    
});


Concentration = module.exports = mongoose.model('hcm_lut_concentration', Hcm_ConcentrationSchema);


module.exports.getLastCode = function(callback){
    
    Concentration.findOne({},callback).sort({Concentration_Code:-1});
}
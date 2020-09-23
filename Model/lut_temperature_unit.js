var mongoose = require('mongoose');

var Hcm_TemperatureUnitSchema = mongoose.Schema({
    
	TemperatureUnit_Code     	   :Number,
    TemperatureUnit_Name     	   :String,
    TemperatureUnit_Description    :String,
    TemperatureUnit_IsActive       :Number,
    
});


TemperatureUnit = module.exports = mongoose.model('hcm_lut_temperature_unit', Hcm_TemperatureUnitSchema);


module.exports.getLastCode = function(callback){
    
    TemperatureUnit.findOne({},callback).sort({TemperatureUnit_Code:-1});
}
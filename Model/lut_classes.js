var mongoose = require('mongoose');

var Hcm_ClassesSchema = mongoose.Schema({
    
	Class_Code     	     :Number,
    Class_Name     	     :String,
    Class_Description    :String,
    Class_IsActive       :Number,
    
});


Classes = module.exports = mongoose.model('hcm_lut_classes', Hcm_ClassesSchema);


module.exports.getLastCode = function(callback){
    
    Classes.findOne({},callback).sort({Class_Code:-1});
}
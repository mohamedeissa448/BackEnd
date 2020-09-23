var mongoose = require('mongoose');

var Hcm_FormSchema = mongoose.Schema({
    
	Form_Code     	  :Number,
    Form_Name     	  : String,
    Form_Description  :String,
    Form_IsActive     :Number,    
});


Form = module.exports = mongoose.model('hcm_lut_form', Hcm_FormSchema);


module.exports.getLastCode = function(callback){
    
    Form.findOne({},callback).sort({Form_Code:-1});
}
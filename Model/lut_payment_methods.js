var mongoose = require('mongoose');

var Hcm_PaymentMethodsSchema = mongoose.Schema({
    
	PaymentMethod_Code     	  :Number,
    PaymentMethod_Name     	  : String,
    PaymentMethod_Description    :String,
    PaymentMethod_IsActive       :Number,
    
});


PaymentMethods = module.exports = mongoose.model('hcm_lut_payment_method', Hcm_PaymentMethodsSchema);



module.exports.getLastCode = function(callback){
    
    PaymentMethods.findOne({},callback).sort({PaymentMethod_Code:-1});
}
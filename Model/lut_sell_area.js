var mongoose = require('mongoose');

var Hcm_SellingAreaSchema = mongoose.Schema({
    
	SellingArea_Code     	  :Number,
    SellingArea_Name     	  : String,
    SellingArea_Description   :String,
    SellingArea_IsActive      :Number,
    
});


SellingArea = module.exports = mongoose.model('hcm_lut_sell_area', Hcm_SellingAreaSchema);


module.exports.getLastCode = function(callback){
    
    SellingArea.findOne({},callback).sort({SellingArea_Code:-1});
}
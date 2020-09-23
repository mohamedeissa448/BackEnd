var mongoose = require('mongoose');

var Hcm_CategorySchema = mongoose.Schema({
    
	Category_ID     		: Number,
    Category_Name     		: String,
    Category_Description    : String,
    Category_IsActive     	: Number,
    //Category_FieldList      : [String],
   
});


var Category = module.exports = mongoose.model('hcm_categories', Hcm_CategorySchema);

module.exports.getLastCode = function(callback){
    
    Category.findOne({},callback).sort({Category_ID:-1});
}
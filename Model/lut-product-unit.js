var mongoose = require('mongoose');

var ProductUnitSchema = mongoose.Schema({
    
    ProductUnit_Name     	        : String,
    ProductUnit_Description         : String,
    ProductUnit_IsActive            : {
        type:Boolean,
        default:true,
    }
});


const productUnit = mongoose.model('hcm_lut_product_unit', ProductUnitSchema);
module.exports = productUnit;

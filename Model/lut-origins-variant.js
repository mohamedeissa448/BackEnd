var mongoose = require('mongoose');

var ProductOriginSchema = mongoose.Schema({
    
    ProductOrigin_Name     	        : String,
    ProductOrigin_Description         : String,
    ProductOrigin_IsActive            : {
        type:Boolean,
        default:true,
    }
});


const ProductOrigin = mongoose.model('hcm_lut_origin_variants', ProductOriginSchema);
module.exports = ProductOrigin;

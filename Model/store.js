var mongoose = require('mongoose');
var storeSchema =new mongoose.Schema({
    
    Store_Product        : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_product'
    },
    Origin_Variant                  : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_lut_origin_variants'
    },
    Expiration_Variant              : Date,
    Store_Quantity       : Number, // Using Small Unit only
    Store_Cost           : Number,
    Store_StoragePlace   : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_storage_places'
    },
    Store_PendingQuantity: {
        type: Number, // should be increased based on creating orders. and decreased if order is canceled or shiped.
        default : 0
    }
});
const store=mongoose.model('hcm_store',storeSchema);
module.exports=store;
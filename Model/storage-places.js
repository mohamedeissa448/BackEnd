var mongoose = require('mongoose');

var storagePlacesSchema =new mongoose.Schema({
    
    StoragePlace_Identifier         : {type: String, unique : true, required : true,dropDups: true  }, // Not Auto, Should be unique and inserted by User
    StoragePlace_DisplayName        : String,
    StoragePlace_Parent             : { // ref to itself
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_storage_places',
        default: null
    },
    StoragePlace_SubLevelTitle      :String
    
   
});
const storage_places=mongoose.model('hcm_storage_places',storagePlacesSchema);
module.exports=storage_places;
var mongoose = require('mongoose');
var ProductDecreaseSchema = require('./general-schemas/product-decrease-schema'); 


var OrderSchema =new mongoose.Schema({
    
    Order_Code     	                : Number, //auto increment
    Order_SysDate                   : { // automatic record the insert date
        type:Date,
        default:    new Date(),
    },
    Order_Date                                  : Date, // selected by user
    Order_Note                                  : String,
    Order_TotalProductSellingAmount             : Number, // total selling price of all product in the order (Auto Calculated form product model)
    Order_TotalProductCostAmount                : Number, // total cost of all product in the order (Auto Calculated form Store model)

    Order_CreatedType                           : String, // AffiliateSeller or DirectCustomer ... For now only AffiliateSeller is used
    
    Order_Customer                              : { // should be Inserted if customer not in the database 
        type:mongoose.Schema.Types.ObjectId,
        ref:'hcm_customer'
    },
    Order_Products                              : [ProductDecreaseSchema],
    Order_Status                                : String, // Created (quantity Is Pending), Assigned,  Shipped (Quantity is released form store), Cancelled (canceled before Shipped and quantitiy is removed from pending), Returned (), Collected
    Order_DoneBy_User                           :{
        type :mongoose.Schema.Types.ObjectId,
        ref  : "hcm_user"
    }
});

Order = module.exports = mongoose.model('hcm_order',OrderSchema);

module.exports.getLastCode = function(callback){
    Order.findOne({},callback).sort({Order_Code:-1});
}
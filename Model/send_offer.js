var mongoose = require('mongoose');

var Hcm_SendOfferSchema = mongoose.Schema({
   
		SendOffer_Code        	        :Number,
        SendOffer_Create_Date           :Date,
        SendOffer_Valid_Till            :Date,
        SendOffer_Title                 :String,

        SendOffer_Product           		:[{
            Product_ID          :Number,
            Quantity_Required   :Number,
            Weight_ID           :Number,
            Price               :Number,
        },{
            toJSON: { virtuals: true }
        }],

        SendOffer_Place_of_Delivery           :String,
        SendOffer_Taxes_Types                 :String,
        SendOffer_Method_of_Payment           :String,
        SendOffer_Delivery_Time               :String,
        SendOffer_Delivery_Cost               :String,
        SendOffer_Work_Time_Off               :String,
        
        SendOffer_Customer               :[{
            Customer_ID                 :Number,
            Customer_Email              :String,
            Price_Status                :Number, 
        },{
            toJSON: { virtuals: true }
        }],

        SendOffer_Status    	        :Number,
},{
    toJSON: { virtuals: true }
});


Hcm_SendOfferSchema.virtual('Customer',{
    ref: 'hcm_customer',
    localField: 'SendOffer_Customer.Customer_ID',
    foreignField: 'Customer_Code',
    justOne: false // for many-to-1 relationships
});

Hcm_SendOfferSchema.virtual('Product',{
    ref: 'hcm_product',
    localField: 'SendOffer_Product.Product_ID',
    foreignField: 'Product_Code',
    justOne: false // for many-to-1 relationships
});


Hcm_SendOfferSchema.virtual('Weight',{
    ref: 'hcm_lut_weight',
    localField: 'SendOffer_Product.Weight_ID',
    foreignField: 'Weight_Code',
    justOne: false // for many-to-1 relationships
});

// Hcm_SendOfferSchema.virtual('Supplier',{
//     ref: 'hcm_supplier',
//     localField: 'RequestPrice_Supplier.Supplier_ID',
//     foreignField: 'Supplier_Code',
//     justOne: false // for many-to-1 relationships
// });

var SendOffer = module.exports = mongoose.model('hcm_send_offer', Hcm_SendOfferSchema);

module.exports.getLastCode = function(callback){
    
    SendOffer.findOne({},callback).sort({SendOffer_Code:-1});
}
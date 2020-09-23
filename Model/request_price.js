var mongoose = require('mongoose');

var Hcm_RequestPriceSchema = mongoose.Schema({
   
		RequestPrice_Code        	        :Number,
        RequestPrice_Customer_ID    	    :Number,
        RequestPrice_Create_Date            :Date,
        RequestPrice_Product           		:[{
            Product_ID          :Number,
            Quantity_Required   :Number,
            Weight_ID           :Number,

        },{
            toJSON: { virtuals: true }
        }],

        RequestPrice_Supplier               :[{
            Supplier_ID                 :Number,
            Supplier_Email              :String,
            Valid_Till                  :Date,
            Price_Status                :Number, 
            Place_of_Delivery           :String,
            Taxes_Types                 :String,
            Method_of_Payment           :String,
            Delivery_Time               :String,
            Delivery_Cost               :String,
            Work_Time_Off               :String,
            Details                       :[{
                Product_ID          :Number,
                Price               :Number,
                Quantity_Available  :Number,
                Weight_ID           :Number,
                Note                :String,
            }]
        },{
            toJSON: { virtuals: true }
        }],

        RequestPrice_Status    	        :Number,
},{
    toJSON: { virtuals: true }
});


Hcm_RequestPriceSchema.virtual('Customer',{
    ref: 'hcm_customer',
    localField: 'RequestPrice_Customer_ID',
    foreignField: 'Customer_Code',
    justOne: false // for many-to-1 relationships
});

Hcm_RequestPriceSchema.virtual('Product',{
    ref: 'hcm_product',
    localField: 'RequestPrice_Product.Product_ID',
    foreignField: 'Product_Code',
    justOne: false // for many-to-1 relationships
});


Hcm_RequestPriceSchema.virtual('Weight',{
    ref: 'hcm_lut_weight',
    localField: 'RequestPrice_Product.Weight_ID',
    foreignField: 'Weight_Code',
    justOne: false // for many-to-1 relationships
});

Hcm_RequestPriceSchema.virtual('Supplier',{
    ref: 'hcm_supplier',
    localField: 'RequestPrice_Supplier.Supplier_ID',
    foreignField: 'Supplier_Code',
    justOne: false // for many-to-1 relationships
});

var RequestPrice = module.exports = mongoose.model('hcm_request_price', Hcm_RequestPriceSchema);

module.exports.getLastCode = function(callback){
    
    RequestPrice.findOne({},callback).sort({RequestPrice_Code:-1});
}
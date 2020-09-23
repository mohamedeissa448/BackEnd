var mongoose = require("mongoose");

//start of supporting Schemas
var CustomerOrderProductSchema = mongoose.Schema({
  Order_Product_Name: String,
  Order_Product: { type: mongoose.Schema.Types.ObjectId, ref: "hcm_product" },
  Order_RequestedQuantity: Number,
  Order_RequestedQuantityWeightUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hcm_lut_weight"
  },
  Order_Note: String
});

var SupplierPricingProductSchema = mongoose.Schema({
  Pricing_Product_Name: String,
  Pricing_Product: [
    { type: mongoose.Schema.Types.ObjectId, ref: "hcm_product" }
  ],
  Pricing_RequestedQuantity: Number,
  Pricing_RequestedQuantityWeightUnit: [
    { type: mongoose.Schema.Types.ObjectId, ref: "hcm_lut_weight" }
  ],
  Pricing_AvilableQuantity: Number,
  Pricing_AvilableQuantityWeightUnit: [
    { type: mongoose.Schema.Types.ObjectId, ref: "hcm_lut_weight" }
  ],
  Pricing_ProductNote: String
});

var CustomerOrderSupplierSchema = mongoose.Schema({
  SupplierPricing_Supplier: [
    { type: mongoose.Schema.Types.ObjectId, ref: "hcm_supplier" }
  ],
  SupplierPricing_Status: Number, // 1 means Sent to supplier, 2 means supplier provided his pricing
  SupplierPricing_Valid_Till: Date,
  SupplierPricing_PlaceOfDelivery: String,
  SupplierPricing_TaxesTypes: String,
  SupplierPricing_MethodOfPayment: String,
  SupplierPricing_DeliveryTime: String,
  SupplierPricing_DeliveryCost: String,
  SupplierPricing_WorkTimeOff: String,
  SupplierPricing_Product: [SupplierPricingProductSchema],
  SupplierPricing_Note: String
});

var CustomerOrderHcmProductSchema = mongoose.Schema({
  HcmOffer_Product_Name: String,
  HcmOffer_Product: [
    { type: mongoose.Schema.Types.ObjectId, ref: "hcm_product" }
  ],
  HcmOffer_AvilableQuantity: Number,
  HcmOffer_AvilableQuantityWeightUnit: [
    { type: mongoose.Schema.Types.ObjectId, ref: "hcm_lut_weight" }
  ],
  HcmOffer_ProductNote: String
});
//End of supporting Schemas ============================================

// Main Schema
var Hcm_CustomerOrderSchema = mongoose.Schema(
  {
    // start intiate Order fields
    CustomerOrder_Code: Number,
    CustomerOrder_Customer:[{ type: mongoose.Schema.Types.ObjectId, ref: "hcm_customer" }],
    CustomerOrder_Date: Date,
    CustomerOrder_CreatedDate: { type: Date, default: Date.now },
    CustomerOrder_CreatedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "hcm_user" },
    CustomerOrder_Products: [CustomerOrderProductSchema],
    CustomerOrder_Status: Number, // 1 means order Pending, 2 Sent to supplier, 3 replied to customer
    //end Of intiate Order fields

    //start of selecting Supplier Fields
    CustomerOrder_Supplier: [CustomerOrderSupplierSchema],
    CustomerOrder_SelectingSuppliersDate: Date,
    CustomerOrder_SelectingSuppliersByUser: { type: mongoose.Schema.Types.ObjectId, ref: "hcm_user" },
    //end Of selecting Supplier Fields

    //start of creating final offer for the customer
    CustomerOrder_HcmOfferProduct: [CustomerOrderHcmProductSchema],
    CustomerOrder_HcmOfferCreatedDate: Date,
    CustomerOrder_HcmOfferByUser: { type: mongoose.Schema.Types.ObjectId, ref: "hcm_user" },
    CustomerOrder_HcmOfferValidTill: Date,
    CustomerOrder_HcmOfferPlaceOfDelivery: String,
    CustomerOrder_HcmOfferTaxesTypes: String,
    CustomerOrder_HcmOfferMethodOfPayment: String,
    CustomerOrder_HcmOfferDeliveryTime: String,
    CustomerOrder_HcmOfferDeliveryCost: String,
    CustomerOrder_HcmOfferWorkTimeOff: String
    //end of final offer for the customer
  },
  {
    toJSON: { virtuals: true }
  }
);

var CustomerOrder = (module.exports = mongoose.model(
  "hcm_customer_order",
  Hcm_CustomerOrderSchema
));

module.exports.getLastCode = function(callback) {
  CustomerOrder.findOne({}, callback).sort({ CustomerOrder_Code: -1 });
};

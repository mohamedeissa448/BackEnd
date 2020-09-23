const mongoose = require("mongoose");
var Hcm_customer_user_schema = mongoose.Schema({
  customer_user_code: Number,
  customer_code: Number,
  email: String,
  password: String,
  displayName: String,
  isOwner: Boolean
});
module.exports = mongoose.moe;

var CustomerUser = (module.exports = mongoose.model(
  "Hcm_customer_users ",
  Hcm_customer_user_schema
));

module.exports.getLastCode = function(callback) {
  CustomerUser.findOne({}, callback).sort({ Customer_Code: -1 });
};

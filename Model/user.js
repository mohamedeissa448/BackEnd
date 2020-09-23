var mongoose = require("mongoose");
// var bcrypt   = require('bcrypt-nodejs');
var passwordHash = require("password-hash");

var Hcm_UserSchema = mongoose.Schema({
  User_Code: Number,
  User_Name: String,
  User_Password: String,
  User_DisplayName: String,
  User_Permissions: [String],
  User_Access_All_Customers: Number,
  User_Allowed_Customers: [Number],
  User_Access_All_Suppliers: Number,
  User_Allowed_Suppliers: [Number],
  User_Access_All_Products: Number,
  User_Allowed_Products: [Number],
  User_IsActive: Number
});

Hcm_UserSchema.methods.verifyPassword = function(password) {
  if (passwordHash.verify(password, this.User_Password) == 1) return 1;
  else return 0;
};
Hcm_UserSchema.methods.updatePassword = function(password) {
  this.User_Password = passwordHash.generate(password);
  this.save();
};

Hcm_UserSchema.virtual("customer", {
  ref: "hcm_customer",
  localField: "User_Allowed_Customers",
  foreignField: "Customer_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_UserSchema.virtual("supplier", {
  ref: "hcm_supplier",
  localField: "User_Allowed_Suppliers",
  foreignField: "Supplier_Code",
  justOne: false // for many-to-1 relationships
});

Hcm_UserSchema.virtual("product", {
  ref: "hcm_product",
  localField: "User_Allowed_Products",
  foreignField: "Product_Code",
  justOne: false // for many-to-1 relationships
});

User = module.exports = mongoose.model("hcm_user", Hcm_UserSchema);

module.exports.getLastCode = function(callback) {
  User.findOne({}, callback).sort({ User_Code: -1 });
};

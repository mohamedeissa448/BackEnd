var express = require("express");
var router = express.Router();
var customerUserController = require("../Controller/customerUserController");
var UserController = require("../Controller/userController");
var CategoryController = require("../Controller/categoryController");
var ProductController = require("../Controller/productController");
var SupplierController = require("../Controller/supplierController");
var SetupController = require("../Controller/lutSetupController");
var CustomerController = require("../Controller/customerController");
var SearchController = require("../Controller/searchController");
var SystemSettingsController = require("../Controller/systemSettingController");

var RequestPriceController = require("../Controller/requestpriceController");
var SendOfferController = require("../Controller/sendofferController");
var CustomerOrderController = require("../Controller/customerOrderController");
var storeController = require("../Controller/storeController");
var purchasingController = require("../Controller/purchasingController");
var paymentController = require("../Controller/paymentController");
var saleController = require("../Controller/saleController");
var receivableController = require("../Controller/receivableController")
var CompanyController = require("../Controller/companyController");
var BranchController = require("../Controller/branchController");
var InventoryController = require("../Controller/inventoryController");
var InventoryOperationController = require("../Controller/inventoryOperationController");
var storagePlacesController = require("../Controller/storagePlacesController");
var increaseInventoryController = require("../Controller/increaseInventoryController")
var decreaseInventoryController = require("../Controller/decreaseInventoryController");
var supplierBillController = require("../Controller/supplierBillController");
var supplierReturnBillController = require("../Controller/supplierReturnBillController");
var orderController = require("../Controller/orderController");

var passport = require("passport");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var type = upload.single("upfile");
var async = require("asyncawait/async");
var await = require("asyncawait/await");

var URL = "http://app.highchem.net/#!/";
var WorkingHours =
  "Working days: Sunday to Thursday, Working Hours 08:00AM - 05:00PM";

router.post("/login", type, function(req, res, next) {
  passport.authenticate("login", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(info);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(info);
      }
      else{
        user.User_Password = '';
        return res.send(user);
      }
      
    });
  })(req, res, next);
});

router.get("/getCategories", type, function(req, res) {
  var Categories = async(function() {
    await(CategoryController.getCategories(req, res));
  });
  Categories();
});
router.get("/getCategoriesNumber", type, function(req, res) {
  var Categories = async(function() {
    await(CategoryController.getCategoriesNumber(req, res));
  });
  Categories();
});
router.post("/getCategory", type, function(req, res) {
  var Category = async(function() {
    await(CategoryController.getCategory(req, res));
  });
  Category();
});

router.post("/getCategoryByname", type, function(req, res) {
  var GetCategoryByname = async(function() {
    await(CategoryController.getCategoryByname(req, res));
  });
  GetCategoryByname();
});

router.post("/AddCategory", type, function(req, res) {
  var AddCategory = async(function() {
    CategoryController.addCategory(req, res);
  });
  AddCategory();
});

router.post("/EditCategory", type, function(req, res) {
  var EditCategory = async(function() {
    CategoryController.editCategory(req, res);
  });
  EditCategory();
});

router.get("/getProductsForPurchasingForm", type, function(req, res) {
  var Products = async(function() {
    await(ProductController.getProductsForPurchasingForm(req, res));
  });
  Products();
});

router.get("/getProducts", type, function(req, res) {
  var Products = async(function() {
    await(ProductController.getProducts(req, res));
  });
  Products();
});
/*****eissa            */
router.post("/getProductHistory", type, function(req, res) {
  var Product = async(function() {
    await(ProductController.getProductHistory(req, res));
  });
  Product();
});
router.post("/checkProduct", type, function(req, res) {
  var Product = async(function() {
    await(ProductController.checkProduct(req, res));
  });
  Product();
});
router.post("/declineProduct", type, function(req, res) {
  var Product = async(function() {
    await(ProductController.declineProduct(req, res));
  });
  Product();
});
router.post("/getDeclinedProductComment", type, function(req, res) {
  var Product = async(function() {
    await(ProductController.getDeclinedProductComment(req, res));
  });
  Product();
});
router.post("/getCustomeProductsFieldByUserCode", type, function(req, res) {
  var CustomeProducts = async(function() {
    await(ProductController.getCustomeProductsFieldByUserCode(req, res));
  });
  CustomeProducts();
});
router.post("/ASCOrdergetCustomeProductsFieldByUserCode", type, function(req, res) {
  var CustomeProducts = async(function() {
    await(ProductController.ASCOrdergetCustomeProductsFieldByUserCode(req, res));
  });
  CustomeProducts();
});

router.post("/DESCOrdergetCustomeProductsFieldByUserCode", type, function(req, res) {
  var CustomeProducts = async(function() {
    await(ProductController.DESCOrdergetCustomeProductsFieldByUserCode(req, res));
  });
  CustomeProducts();
});

router.get("/getCustomeProductsField", type, function(req, res) {
  var CustomeProducts = async(function() {
    await(ProductController.getCustomeProductsField(req, res));
  });
  CustomeProducts();
});

router.post("/getAllProduct", type, function(req, res) {
  var Product = async(function() {
    console.log("xx")
    await(ProductController.getAllProduct(req, res));
  });
  Product();
});

router.post("/getAllProductButMinified", type, function(req, res) {
  var Product = async(function() {
    console.log("xx")
    await(ProductController.getAllProductButMinified(req, res));
  });
  Product();
});

router.post("/product/getCategoriedProducts", type, function(req, res) {
  var getCategoriedProducts = async(function() {
    await(ProductController.getCategoriedProducts(req, res));
  });
  getCategoriedProducts();
});
router.post("/product/getProductCategoriedProducts", type, function(req, res) {
  var getProductCategoriedProducts = async(function() {
    await(ProductController.getProductCategoriedProducts(req, res));
  });
  getProductCategoriedProducts();
});
router.post("/product/getSellingAreasProducts", type, function(req, res) {
  var getSellingAreasProducts = async(function() {
    await(ProductController.getSellingAreasProducts(req, res));
  });
  getSellingAreasProducts();
});
router.post("/deleteProductCategoryID", type, function(req, res) {
  var deleteProductCategoryID = async(function() {
    await(ProductController.deleteProductCategoryID(req, res));
  });
  deleteProductCategoryID();
});
router.post("/deleteProductProductCategoryID", type, function(req, res) {
  var deleteProductProductCategoryID = async(function() {
    await(ProductController.deleteProductProductCategoryID(req, res));
  });
  deleteProductProductCategoryID();
});
router.post("/deleteProductSellingAreaCodeAndName", type, function(req, res) {
  var deleteProductSellingAreaCodeAndName = async(function() {
    await(ProductController.deleteProductSellingAreaCodeAndName(req, res));
  });
  deleteProductSellingAreaCodeAndName();
});
router.post("/editProductCategoryIDs", type, function(req, res) {
  var editProductCategoryIDs = async(function() {
    await(ProductController.editProductCategoryIDs(req, res));
  });
  editProductCategoryIDs();
});
router.post("/editProductProductCategoryIDs", type, function(req, res) {
  var editProductProductCategoryIDs = async(function() {
    await(ProductController.editProductProductCategoryIDs(req, res));
  });
  editProductProductCategoryIDs();
});
router.post("/editProductSellingAreaCodeAndName", type, function(req, res) {
  var editProductSellingAreaCodeAndName = async(function() {
    await(ProductController.editProductSellingAreaCodeAndName(req, res));
  });
  editProductSellingAreaCodeAndName();
});


router.get("/getProductsNumber", type, function(req, res) {
  var Product = async(function() {
    await(ProductController.getProductsNumber(req, res));
  });
  Product();
});
router.get("/getCheckedProductsNumber", type, function(req, res) {
  var Product = async(function() {
    await(ProductController.getCheckedProductsNumber(req, res));
  });
  Product();
});
router.post("/SearchProduct", type, function(req, res) {
  var Search = async(function() {
    await(ProductController.searchProduct(req, res));
  });
  Search();
});

router.post("/AddProduct", type, function(req, res) {
  var AddProduct = async(function() {
    ProductController.addProduct(req, res);
  });
  AddProduct();
});

router.post("/EditProduct", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.editProduct(req, res));
  });
  EditProduct();
});
router.post("/editProductSuppliers", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.editProductSuppliers(req, res));
  });
  EditProduct();
});
router.post("/editProductCustomers", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.editProductCustomers(req, res));
  });
  EditProduct();
});

/*Eissa*/
router.post("/editProductSupplierCodes", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.editProductSupplierCodes(req, res));
  });
  EditProduct();
});
router.post("/removeProductSupplierCodes", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.removeProductSupplierCodes(req, res));
  });
  EditProduct();
});
router.post("/editProductCustomerCodes", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.editProductCustomerCodes(req, res));
  });
  EditProduct();
});
router.post("/removeProductCustomerCodes", type, function(req, res) {
  var EditProduct = async(function() {
    await(ProductController.removeProductCustomerCodes(req, res));
  });
  EditProduct();
});
router.post("/CopyProduct", type, function(req, res) {
  var CopyProduct = async(function() {
    ProductController.copyProduct(req, res);
  });
  CopyProduct();
});

router.post("/removeProduct", type, function(req, res) {
  var RemoveProduct = async(function() {
    ProductController.removeProduct(req, res);
  });
  RemoveProduct();
});
/****Eissa start for product documents*/
router.post("/product/addDocuments", function(req, res) {
  var addDocuments = async(function() {
    await(ProductController.addDocuments(req, res));
  });
  addDocuments();
});
router.post("/product/getDocuments", function(req, res) {
  var getDocuments = async(function() {
    await(ProductController.getDocuments(req, res));
  });
  getDocuments();
});
router.post("/product/deleteDocument", function(req, res) {
  var deleteDocument = async(function() {
    await(ProductController.deleteDocument(req, res));
  });
  deleteDocument();
});
/****Eissa end for product documents*/
/****Eissa start for supplier documents*/
router.post("/supplier/addDocuments", function(req, res) {
  var addDocuments = async(function() {
    await(SupplierController.addDocuments(req, res));
  });
  addDocuments();
});
router.post("/supplier/getDocuments", function(req, res) {
  var getDocuments = async(function() {
    await(SupplierController.getDocuments(req, res));
  });
  getDocuments();
});
router.post("/supplier/deleteDocument", function(req, res) {
  var deleteDocument = async(function() {
    await(SupplierController.deleteDocument(req, res));
  });
  deleteDocument();
});

/****Eissa end for supplier documents*/
router.post("/supplier/getCategoriedSuppliers", type, function(req, res) {
  var getCategoriedSuppliers = async(function() {
    await(SupplierController.getCategoriedSuppliers(req, res));
  });
  getCategoriedSuppliers();
});
router.post("/supplier/getProductCategoriedSuppliers", type, function(req, res) {
  var getProductCategoriedSuppliers = async(function() {
    await(SupplierController.getProductCategoriedSuppliers(req, res));
  });
  getProductCategoriedSuppliers();
});
//get all suppliers for a specific selling area
router.post("/supplier/getSellingAreasSuppliers", type, function(req, res) {
  var getSellingAreasSuppliers = async(function() {
    await(SupplierController.getSellingAreasSuppliers(req, res));
  });
  getSellingAreasSuppliers();
});
router.post("/deleteSupplierCategoryID", type, function(req, res) {
  var deleteSupplierCategoryID = async(function() {
    await(SupplierController.deleteSupplierCategoryID(req, res));
  });
  deleteSupplierCategoryID();
});
router.post("/deleteSupplierProductCategoryID", type, function(req, res) {
  var deleteSupplierProductCategoryID = async(function() {
    await(SupplierController.deleteSupplierProductCategoryID(req, res));
  });
  deleteSupplierProductCategoryID();
});
router.post("/deleteSupplierSellingAreaCodeAndName", type, function(req, res) {
  var deleteSupplierSellingAreaCodeAndName = async(function() {
    await(SupplierController.deleteSupplierSellingAreaCodeAndName(req, res));
  });
  deleteSupplierSellingAreaCodeAndName();
});
router.post("/editSupplierCategoryIDs", type, function(req, res) {
  var editSupplierCategoryIDs = async(function() {
    await(SupplierController.editSupplierCategoryIDs(req, res));
  });
  editSupplierCategoryIDs();
});
router.post("/editSupplierProductCategoryIDs", type, function(req, res) {
  var editSupplierProductCategoryIDs = async(function() {
    await(SupplierController.editSupplierProductCategoryIDs(req, res));
  });
  editSupplierProductCategoryIDs();
});
router.post("/editSupplierSellingAreaCodeAndName", type, function(req, res) {
  var editSupplierSellingAreaCodeAndName = async(function() {
    await(SupplierController.editSupplierSellingAreaCodeAndName(req, res));
  });
  editSupplierSellingAreaCodeAndName();
});


/****Eissa start for customer documents*/
router.post("/customer/addDocuments", function(req, res) {
  var addDocuments = async(function() {
    await(CustomerController.addDocuments(req, res));
  });
  addDocuments();
});

router.post("/customer/getDocuments", function(req, res) {
  var getDocuments = async(function() {
    await(CustomerController.getDocuments(req, res));
  });
  getDocuments();
});
router.post("/customer/deleteDocument", function(req, res) {
  var deleteDocument = async(function() {
    await(CustomerController.deleteDocument(req, res));
  });
  deleteDocument();
});
/****Eissa end for customer documents*/

router.get("/getSupplier", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getSupplier(req, res));
  });
  Supplier();
});
router.get("/getSuppliersNumber", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getSuppliersNumber(req, res));
  });
  Supplier();
});
router.get("/getCheckedSuppliersNumber", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getCheckedSuppliersNumber(req, res));
  });
  Supplier();
});
router.get("/getManufacturer", type, function(req, res) {
  var GetManufacturer = async(function() {
    await(SupplierController.getManufacturer(req, res));
  });
  GetManufacturer();
});
/*******************Eissa */
router.post("/getSupplierHistory", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getSupplierHistory(req, res));
  });
  Supplier();
});
router.post("/checkSupplier", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.checkSupplier(req, res));
  });
  Supplier();
});
router.post("/declineSupplier", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.declineSupplier(req, res));
  });
  Supplier();
});
router.post("/getDeclinedSupplierComment", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getDeclinedSupplierComment(req, res));
  });
  Supplier();
});
router.post("/getAllSupplierByUserCode", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getAllSupplierByUserCode(req, res));
  });
  Supplier();
});
router.post("/ASCOrdergetAllSupplierByUserCode", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.ASCOrdergetAllSupplierByUserCode(req, res));
  });
  Supplier();
});
router.post("/DESCOrdergetAllSupplierByUserCode", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.DESCOrdergetAllSupplierByUserCode(req, res));
  });
  Supplier();
});
router.get("/getAllSupplier", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getAllSuppliers(req, res));
  });
  Supplier();
});
router.post("/getupplierContactsByID", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.getupplierContactsByID(req, res));
  });
  Supplier();
});
router.post("/checkSupplierByEmail", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.checkSupplierByEmail(req, res));
  });
  Supplier();
});
router.post("/checkSupplierByEmailAndID", type, function(req, res) {
  var Supplier = async(function() {
    await(SupplierController.checkSupplierByEmailAndID(req, res));
  });
  Supplier();
});

router.post("/searchSupplier", type, function(req, res) {
  var SearchSupplier = async(function() {
    await(SupplierController.searchSupplier(req, res));
  });
  SearchSupplier();
});

router.post("/getSupplierById", type, function(req, res) {
  var GetSupplierById = async(function() {
    await(SupplierController.getSupplierById(req, res));
  });
  GetSupplierById();
});

router.get("/getCountries", type, function(req, res) {
  var Countries = async(function() {
    await(SetupController.getCountries(req, res));
  });
  Countries();
});
router.post("/getCountriesByName", type, function(req, res) {
  var Countries = async(function() {
    await(SetupController.getCountriesByName(req, res));
  });
  Countries();
});
router.get("/getSupplierTypes", type, function(req, res) {
  var SupplierTypes = async(function() {
    await(SetupController.getSupplierTypes(req, res));
  });
  SupplierTypes();
});
router.get("/getSupplierTypesNumber", type, function(req, res) {
  var SupplierTypes = async(function() {
    await(SetupController.getSupplierTypesNumber(req, res));
  });
  SupplierTypes();
});
router.post("/getSupplierTypesByName", type, function(req, res) {
  var SupplierTypes = async(function() {
    await(SetupController.getSupplierTypesByName(req, res));
  });
  SupplierTypes();
});

router.get("/getPaymentMethods", type, function(req, res) {
  var PaymentMethods = async(function() {
    await(SetupController.getPaymentMethods(req, res));
  });
  PaymentMethods();
});
router.post("/getPaymentMethodsByName", type, function(req, res) {
  var PaymentMethods = async(function() {
    await(SetupController.getPaymentMethodsByName(req, res));
  });
  PaymentMethods();
});

router.get("/getWaysOfDelivery", type, function(req, res) {
  var WaysOfDelivery = async(function() {
    await(SetupController.getWaysOfDelivery(req, res));
  });
  WaysOfDelivery();
});

router.post("/getWaysOfDeliveryByName", type, function(req, res) {
  var WaysOfDelivery = async(function() {
    await(SetupController.getWaysOfDeliveryByName(req, res));
  });
  WaysOfDelivery();
});

router.get("/getClasses", type, function(req, res) {
  var Classes = async(function() {
    await(SetupController.getClasses(req, res));
  });
  Classes();
});
router.get("/getClassesNumber", type, function(req, res) {
  var Classes = async(function() {
    await(SetupController.getClassesNumber(req, res));
  });
  Classes();
});

router.post("/getClassByName", type, function(req, res) {
  var GetClassByName = async(function() {
    await(SetupController.getClassByName(req, res));
  });
  GetClassByName();
});

router.get("/getForm", type, function(req, res) {
  var Form = async(function() {
    await(SetupController.getForm(req, res));
  });
  Form();
});
router.get("/getFormsNumber", type, function(req, res) {
  var Form = async(function() {
    await(SetupController.getFormsNumber(req, res));
  });
  Form();
});
router.post("/getFormByName", type, function(req, res) {
  var Form = async(function() {
    await(SetupController.getFormByName(req, res));
  });
  Form();
});

router.get("/getPacking", type, function(req, res) {
  var Packing = async(function() {
    await(SetupController.getPacking(req, res));
  });
  Packing();
});
router.post("/getPackingByName", type, function(req, res) {
  var Packing = async(function() {
    await(SetupController.getPackingByName(req, res));
  });
  Packing();
});

router.get("/getProductCategory", type, function(req, res) {
  var ProductCategory = async(function() {
    await(SetupController.getProductCategory(req, res));
  });
  ProductCategory();
});
router.get("/getProductCategoriesNumber", type, function(req, res) {
  var ProductCategory = async(function() {
    await(SetupController.getProductCategoriesNumber(req, res));
  });
  ProductCategory();
});

router.post("/getProductCategoryByName", type, function(req, res) {
  var ProductCategory = async(function() {
    await(SetupController.getProductCategoryByName(req, res));
  });
  ProductCategory();
});

router.get("/getReleaseType", type, function(req, res) {
  var ReleaseType = async(function() {
    await(SetupController.getReleaseType(req, res));
  });
  ReleaseType();
});
router.get("/getReleaseTypesNumber", type, function(req, res) {
  var ReleaseType = async(function() {
    await(SetupController.getReleaseTypesNumber(req, res));
  });
  ReleaseType();
});
router.post("/getReleaseTypeByName", type, function(req, res) {
  var ReleaseType = async(function() {
    await(SetupController.getReleaseTypeByName(req, res));
  });
  ReleaseType();
});

router.get("/getStorageType", type, function(req, res) {
  var StorageType = async(function() {
    await(SetupController.getStorageType(req, res));
  });
  StorageType();
});
router.post("/getStorageTypeByName", type, function(req, res) {
  var StorageType = async(function() {
    await(SetupController.getStorageTypeByName(req, res));
  });
  StorageType();
});

router.get("/getSellingArea", type, function(req, res) {
  var SellingArea = async(function() {
    await(SetupController.getSellingArea(req, res));
  });
  SellingArea();
});
router.get("/getSellingAreasNumber", type, function(req, res) {
  var SellingArea = async(function() {
    await(SetupController.getSellingAreasNumber(req, res));
  });
  SellingArea();
});

router.post("/getSellingAreaByName", type, function(req, res) {
  var SellingArea = async(function() {
    await(SetupController.getSellingAreaByName(req, res));
  });
  SellingArea();
});

router.get("/getWeight", type, function(req, res) {
  var Weight = async(function() {
    await(SetupController.getWeight(req, res));
  });
  Weight();
});
router.post("/getWeightByName", type, function(req, res) {
  var Weight = async(function() {
    await(SetupController.getWeightByName(req, res));
  });
  Weight();
});

router.get("/getConcentration", type, function(req, res) {
  var Concentration = async(function() {
    await(SetupController.getConcentration(req, res));
  });
  Concentration();
});
router.get("/getConcentrationsNumber", type, function(req, res) {
  var Concentration = async(function() {
    await(SetupController.getConcentrationsNumber(req, res));
  });
  Concentration();
});
router.post("/getConcentrationByName", type, function(req, res) {
  var Concentration = async(function() {
    await(SetupController.getConcentrationByName(req, res));
  });
  Concentration();
});

router.get("/getCertificate", type, function(req, res) {
  var GetCertificate = async(function() {
    await(SetupController.getCertificate(req, res));
  });
  GetCertificate();
});
router.get("/getCertificatesNumber", type, function(req, res) {
  var GetCertificate = async(function() {
    await(SetupController.getCertificatesNumber(req, res));
  });
  GetCertificate();
});
router.get("/getTemperatureUnit", type, function(req, res) {
  var GetTemperatureUnit = async(function() {
    await(SetupController.getTemperatureUnit(req, res));
  });
  GetTemperatureUnit();
});

router.post("/AddCountry", type, function(req, res) {
  var AddCountry = async(function() {
    SetupController.addCountry(req, res);
  });
  AddCountry();
});

router.post("/EditCountry", type, function(req, res) {
  var EditCountry = async(function() {
    await(SetupController.editCountry(req, res));
  });
  EditCountry();
});

router.post("/AddSupplierType", type, function(req, res) {
  var AddSupplierType = async(function() {
    SetupController.addSupplierType(req, res);
  });
  AddSupplierType();
});

router.post("/EditSupplierType", type, function(req, res) {
  var EditSupplierType = async(function() {
    await(SetupController.editSupplierType(req, res));
  });
  EditSupplierType();
});

router.post("/AddSupplierClass", type, function(req, res) {
  var AddSupplierClass = async(function() {
    SetupController.addSupplierClass(req, res);
  });
  AddSupplierClass();
});

router.post("/EditSupplierClass", type, function(req, res) {
  var EditSupplierClass = async(function() {
    await(SetupController.editSupplierClass(req, res));
  });
  EditSupplierClass();
});

router.post("/AddPaymentMethod", type, function(req, res) {
  var AddPaymentMethod = async(function() {
    SetupController.addPaymentMethod(req, res);
  });
  AddPaymentMethod();
});

router.post("/EditPaymentMethod", type, function(req, res) {
  var EditPaymentMethod = async(function() {
    await(SetupController.editPaymentMethod(req, res));
  });
  EditPaymentMethod();
});

router.post("/AddWaysOfDelivery", type, function(req, res) {
  var AddWaysOfDelivery = async(function() {
    SetupController.addWaysOfDelivery(req, res);
  });
  AddWaysOfDelivery();
});

router.post("/EditWaysOfDelivery", type, function(req, res) {
  var EditWaysOfDelivery = async(function() {
    await(SetupController.editWaysOfDelivery(req, res));
  });
  EditWaysOfDelivery();
});

router.post("/AddForm", type, function(req, res) {
  var AddForm = async(function() {
    SetupController.addForm(req, res);
  });
  AddForm();
});

router.post("/EditForm", type, function(req, res) {
  var EditForm = async(function() {
    await(SetupController.editForm(req, res));
  });
  EditForm();
});

router.post("/AddPacking", type, function(req, res) {
  var AddPacking = async(function() {
    SetupController.addPacking(req, res);
  });
  AddPacking();
});

router.post("/EditPacking", type, function(req, res) {
  var EditPacking = async(function() {
    await(SetupController.editPacking(req, res));
  });
  EditPacking();
});

router.post("/AddProductCategory", type, function(req, res) {
  var AddProductCategory = async(function() {
    SetupController.addProductCategory(req, res);
  });
  AddProductCategory();
});

router.post("/EditProductCategory", type, function(req, res) {
  var EditProductCategory = async(function() {
    await(SetupController.editProductCategory(req, res));
  });
  EditProductCategory();
});

router.post("/AddReleaseType", type, function(req, res) {
  var AddReleaseType = async(function() {
    SetupController.addReleaseType(req, res);
  });
  AddReleaseType();
});

router.post("/EditReleaseType", type, function(req, res) {
  var EditReleaseType = async(function() {
    await(SetupController.editReleaseType(req, res));
  });
  EditReleaseType();
});

router.post("/AddStorageType", type, function(req, res) {
  var AddStorageType = async(function() {
    SetupController.addStorageType(req, res);
  });
  AddStorageType();
});

router.post("/EditStorageType", type, function(req, res) {
  var EditStorageType = async(function() {
    await(SetupController.editStorageType(req, res));
  });
  EditStorageType();
});

router.post("/AddSellingArea", type, function(req, res) {
  var AddSellingArea = async(function() {
    SetupController.addSellingArea(req, res);
  });
  AddSellingArea();
});

router.post("/EditSellingArea", type, function(req, res) {
  var EditSellingArea = async(function() {
    await(SetupController.editSellingArea(req, res));
  });
  EditSellingArea();
});

router.post("/AddWeight", type, function(req, res) {
  var AddWeight = async(function() {
    SetupController.addWeight(req, res);
  });
  AddWeight();
});

router.post("/EditWeight", type, function(req, res) {
  var EditWeight = async(function() {
    await(SetupController.editWeight(req, res));
  });
  EditWeight();
});

router.post("/AddConcentration", type, function(req, res) {
  var AddConcentration = async(function() {
    SetupController.addConcentration(req, res);
  });
  AddConcentration();
});

router.post("/EditConcentration", type, function(req, res) {
  var EditConcentration = async(function() {
    await(SetupController.editConcentration(req, res));
  });
  EditConcentration();
});

router.post("/AddCertificate", type, function(req, res) {
  var AddCertificate = async(function() {
    SetupController.addCertificate(req, res);
  });
  AddCertificate();
});

router.post("/EditCertificate", type, function(req, res) {
  var EditCertificate = async(function() {
    await(SetupController.editCertificate(req, res));
  });
  EditCertificate();
});

router.post("/getCertificateByname", type, function(req, res) {
  var GetCertificateByname = async(function() {
    await(SetupController.getCertificateByname(req, res));
  });
  GetCertificateByname();
});

router.post("/AddTemperatureUnit", type, function(req, res) {
  var AddTemperatureUnit = async(function() {
    SetupController.addTemperatureUnit(req, res);
  });
  AddTemperatureUnit();
});

router.post("/EditTemperatureUnit", type, function(req, res) {
  var EditTemperatureUnit = async(function() {
    await(SetupController.editTemperatureUnit(req, res));
  });
  EditTemperatureUnit();
});

router.post("/getTemperatureUnitByname", type, function(req, res) {
  var GetTemperatureUnitByname = async(function() {
    await(SetupController.getTemperatureUnitByname(req, res));
  });
  GetTemperatureUnitByname();
});
router.get("/getTypesOfBusiness", type, function(req, res) {
  var TypeOfBusiness = async(function() {
    await(SetupController.getTypesOfBusiness(req, res));
  });
  TypeOfBusiness();
});

router.post("/getTypesOfBusinessByName", type, function(req, res) {
  var TypeOfBusiness = async(function() {
    await(SetupController.getTypesOfBusinessByName(req, res));
  });
  TypeOfBusiness();
});
router.post("/addTypeOfBusiness", type, function(req, res) {
  var TypeOfBusiness = async(function() {
    await(SetupController.addTypeOfBusiness(req, res));
  });
  TypeOfBusiness();
});
router.post("/editTypeOfBusiness", type, function(req, res) {
  var TypeOfBusiness = async(function() {
    await(SetupController.editTypeOfBusiness(req, res));
  });
  TypeOfBusiness();
});
/**  origin variant */
router.post("/addOriginVariant", type, function(req, res) {
  var OriginVariant = async(function() {
    await(SetupController.addOriginVariant(req, res));
  });
  OriginVariant();
});
router.post("/editOriginVariant", type, function(req, res) {
  var OriginVariant = async(function() {
    await(SetupController.editOriginVariant(req, res));
  });
  OriginVariant();
});
router.get("/getOriginVariants", type, function(req, res) {
  var OriginVariant = async(function() {
    await(SetupController.getOriginVariants(req, res));
  });
  OriginVariant();
});
router.post("/getOriginVariantsByName", type, function(req, res) {
  var OriginVariant = async(function() {
    await(SetupController.getOriginVariantsByName(req, res));
  });
  OriginVariant();
});
/**  product unit */
router.post("/addProductUnit", type, function(req, res) {
  var ProductUnit = async(function() {
    await(SetupController.addProductUnit(req, res));
  });
  ProductUnit();
});
router.post("/editProductUnit", type, function(req, res) {
  var ProductUnit = async(function() {
    await(SetupController.editProductUnit(req, res));
  });
  ProductUnit();
});
router.get("/getProductUnitsByName", type, function(req, res) {
  var ProductUnit = async(function() {
    await(SetupController.getProductUnitsByName(req, res));
  });
  ProductUnit();
});
router.get("/getProductUnits", type, function(req, res) {
  var ProductUnit = async(function() {
    await(SetupController.getProductUnits(req, res));
  });
  ProductUnit();
});
/********************* */

router.post("/AddSupplier", type, function(req, res) {
  var AddSupplier = async(function() {
    SupplierController.addSupplier(req, res);
  });
  AddSupplier();
});

router.post("/copySupplierIntoCustomer", type, function(req, res) {
  var CopySupplier = async(function() {
    SupplierController.CopySupplierIntoCustomer(req, res);
  });
  CopySupplier();
});
router.post("/getUnlinkedSuppliers", type, function(req, res) {
  var GetSupplierlist = async(function() {
    SupplierController.getUnlinkedSuppliers(req, res);
  });
  GetSupplierlist();
});

router.post("/EditSupplier", type, function(req, res) {
  var EditSupplier = async(function() {
    await(SupplierController.editSupplier(req, res));
  });
  EditSupplier();
});

router.post("/EditSupplierContact", type, function(req, res) {
  var EditSupplierContact = async(function() {
    await(SupplierController.editSupplierContact(req, res));
  });
  EditSupplierContact();
});

router.post("/AddUser", type, function(req, res) {
  var addUser = async(function() {
    UserController.addUser(req, res);
  });
  addUser();
});

router.get("/getAllUsers", type, function(req, res) {
  var Users = async(function() {
    await(UserController.getAllUsers(req, res));
  });
  Users();
});
router.get("/getAllUsersNumber", type, function(req, res) {
  var Users = async(function() {
    await(UserController.getAllUsersNumber(req, res));
  });
  Users();
});

router.get("/getActiveUsers", type, function(req, res) {
  var Users = async(function() {
    await(UserController.getActiveUsers(req, res));
  });
  Users();
});
router.post("/editUserPermissions", type, function(req, res) {
  var EditUserPermissions = async(function() {
    await(UserController.editUserPermissions(req, res));
  });
  EditUserPermissions();
});
router.post("/changeMyPassword", type, function(req, res) {
  var ChangeMyPassword = async(function() {
    await(UserController.changeMyPassword(req, res));
  });
  ChangeMyPassword();
});
router.post("/changePassword", type, function(req, res) {
  var ChangePassword = async(function() {
    await(UserController.changePassword(req, res));
  });
  ChangePassword();
});

//************** System Setting **********************************
router.get("/getMasterPermisions", function(req, res) {
  var GetMasterPermisions = async(function() {
    await(SystemSettingsController.getMasterPermisions(req, res));
  });
  GetMasterPermisions();
});

//************** Customer **********************************

router.post("/getCustomerHistory", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getCustomerHistory(req, res));
  });
  Customer();
});
router.post("/checkCustomer", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.checkCustomer(req, res));
  });
  Customer();
});
router.post("/declineCustomer", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.declineCustomer(req, res));
  });
  Customer();
});
router.post("/getDeclinedCustomerComment", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getDeclinedCustomerComment(req, res));
  });
  Customer();
});
router.get("/getCustomer", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getCustomer(req, res));
  });
  Customer();
});
router.post("/customer/getCategoriedCustomers", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getCategoriedCustomers(req, res));
  });
  Customer();
});
router.post("/customer/getProductCategoriedCustomers", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getProductCategoriedCustomers(req, res));
  });
  Customer();
});
router.post("/customer/getSellingAreasCustomers", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getSellingAreasCustomers(req, res));
  });
  Customer();
});
router.post("/editCustomerCategoryIDs", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.editCustomerCategoryIDs(req, res));
  });
  Customer();
});
router.post("/editCustomerProductCategoryIDs", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.editCustomerProductCategoryIDs(req, res));
  });
  Customer();
});
router.post("/editCustomerSellingAreaCodeAndName", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.editCustomerSellingAreaCodeAndName(req, res));
  });
  Customer();
});
router.post("/deleteCustomerCategoryID", type, function(req, res) {
  var deleteCustomerCategoryID = async(function() {
    await(CustomerController.deleteCustomerCategoryID(req, res));
  });
  deleteCustomerCategoryID();
});
router.post("/deleteCustomerProductCategoryID", type, function(req, res) {
  var deleteCustomerProductCategoryID = async(function() {
    await(CustomerController.deleteCustomerProductCategoryID(req, res));
  });
  deleteCustomerProductCategoryID();
});
router.post("/deleteCustomerSellingAreaCodeAndName", type, function(req, res) {
  var deleteCustomerSellingAreaCodeAndName = async(function() {
    await(CustomerController.deleteCustomerSellingAreaCodeAndName(req, res));
  });
  deleteCustomerSellingAreaCodeAndName();
});
///////////Eissa
router.get("/getCustomerDocuments", type, function(req, res) {
  var getCustomerDocuments = async(function() {
    await(CustomerController.getCustomerDocuments(req, res));
  });
  getCustomerDocuments();
});
router.get("/getCustomerLite", type, function(req, res) {
  var Customer = async(function() {
    await(CustomerController.getCustomerLite(req, res));
  });
  Customer();
});

router.post("/searchCustomer", type, function(req, res) {
  var Search = async(function() {
    await(CustomerController.searchCustomer(req, res));
  });
  Search();
});

router.get("/getAllCustomer", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.getAllCustomer(req, res));
  });
  Customeres();
});
router.get("/getCustomersNumber", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.getCustomersNumber(req, res));
  });
  Customeres();
});
router.get("/getCheckedCustomersNumber", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.getCheckedCustomersNumber(req, res));
  });
  Customeres();
});
router.post("/getAllCustomersMiniDataByUserCode", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.getAllCustomersMiniDataByUserCode(req, res));
  });
  Customeres();
});

/*******Eissa */
router.get("/getAllCustomerByPageNumber", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.getAllCustomerByPageNumber(req, res));
  });
  Customeres();
});
router.post("/getAllCustomersByUserCode", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.getAllCustomersByUserCode(req, res));
  });
  Customeres();
});
router.post("/ASCOrdergetAllCustomersByUserCode", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.ASCOrdergetAllCustomersByUserCode(req, res));
  });
  Customeres();
});
router.post("/DESCOrdergetAllCustomersByUserCode", type, function(req, res) {
  var Customeres = async(function() {
    await(CustomerController.DESCOrdergetAllCustomersByUserCode(req, res));
  });
  Customeres();
});
router.post("/addCustomer", type, function(req, res) {
  var AddCustomer = async(function() {
    CustomerController.addCustomer(req, res);
  });
  AddCustomer();
});
/***********Eissa */
router.post("/changePassword", type, function(req, res) {
  var changePass = async(function() {
    customerUserController.changePassword(req, res);
  });
  changePass();
});
router.post("/resetPassword", type, function(req, res) {
  var resetPass = async(function() {
    customerUserController.resetPassword(req, res);
  });
  resetPass();
});

router.post("/copyCustomerIntoSupplier", type, function(req, res) {
  var CopyCustomer = async(function() {
    CustomerController.CopyCustomerIntoSupplier(req, res);
  });
  CopyCustomer();
});
router.post("/linkCustomerWithSupplier", type, function(req, res) {
  var LinkCustomer = async(function() {
    CustomerController.linkCustomerWithSupplier(req, res);
  });
  LinkCustomer();
});

router.post("/EditCustomer", type, function(req, res) {
  var EditCustomer = async(function() {
    await(CustomerController.editCustomer(req, res));
  });
  EditCustomer();
});

router.post("/EditCustomerContact", type, function(req, res) {
  var EditCustomerContact = async(function() {
    await(CustomerController.editCustomerContact(req, res));
  });
  EditCustomerContact();
});

/****************** Search *********************/

router.post("/getCustomerByProductID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getCustomerByProductID(req, res));
  });
  Search();
});

router.post("/getSupplierByProductID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getSupplierByProductID(req, res));
  });
  Search();
});

router.post("/getProductBySupplierID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getProductBySupplierID(req, res));
  });
  Search();
});

router.post("/getCustomerByName", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getCustomerByName(req, res));
  });
  Search();
});

router.post("/getSupplierByName", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getSupplierByName(req, res));
  });
  Search();
});

router.post("/getProductByName", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getProductByName(req, res));
  });
  Search();
});

router.post("/getCustomerByCategoryID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getCustomerByCategoryID(req, res));
  });
  Search();
});

router.post("/getSupplierByCategoryID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getSupplierByCategoryID(req, res));
  });
  Search();
});

router.post("/getProductByCategoryID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getProductByCategoryID(req, res));
  });
  Search();
});

router.post("/getProductByProductCategoryID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getProductByProductCategoryID(req, res));
  });
  Search();
});

router.post("/getSupplierDataByProductID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getSupplierDataOnlyByProductID(req, res));
  });
  Search();
});

router.post("/getCustomerDataByProductID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getCustomerDataOnlyByProductID(req, res));
  });
  Search();
});

router.post("/getProductDataByCustomerID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getProductDataOnlyByCustomerID(req, res));
  });
  Search();
});
router.post("/getProductDataBySupplierID", type, function(req, res) {
  var Search = async(function() {
    await(SearchController.getProductDataOnlyBySupplierID(req, res));
  });
  Search();
});


/***********************request price***************************/
router.get("/getAllRequestPrice", type, function(req, res) {
  var GetAllRequestPrice = async(function() {
    await(RequestPriceController.getAllRequestPrice(req, res));
  });
  GetAllRequestPrice();
});
router.get("/getAllRequestPricesNumber", type, function(req, res) {
  var GetAllRequestPrice = async(function() {
    await(RequestPriceController.getAllRequestPricesNumber(req, res));
  });
  GetAllRequestPrice();
});

router.post("/addRequestPrice", type, function(req, res) {
  var AddRequestPrice = async(function() {
    RequestPriceController.addRequestPrice(req, res, URL);
  });
  AddRequestPrice();
});

router.post("/updateRequestPrice", type, function(req, res) {
  var UpdateRequestPrice = async(function() {
    RequestPriceController.updateRequestPrice(req, res);
  });
  UpdateRequestPrice();
});

router.post("/getRequestPriceByID", type, function(req, res) {
  var GetRequestPriceByID = async(function() {
    await(RequestPriceController.getRequestPriceByID(req, res));
  });
  GetRequestPriceByID();
});

/***********************Send Offer***************************/
router.get("/getAllSendOffer", type, function(req, res) {
  var GetAllSendOffer = async(function() {
    await(SendOfferController.getAllSendOffer(req, res));
  });
  GetAllSendOffer();
});
router.get("/getAllSendOffersNumber", type, function(req, res) {
  var GetAllSendOffer = async(function() {
    await(SendOfferController.getAllSendOffersNumber(req, res));
  });
  GetAllSendOffer();
});

router.post("/addSendOffer", type, function(req, res) {
  var AddSendOffer = async(function() {
    SendOfferController.addSendOffer(req, res, URL, WorkingHours);
  });
  AddSendOffer();
});

// router.post('/updateRequestPrice', type,function(req, res) {
//     var UpdateRequestPrice = async (function (){
//         SendOfferController.updateRequestPrice(req,res)
//     });
//     UpdateRequestPrice();
// });

router.post("/getProductByID", type, function(req, res) {
  var GetProductByID = async(function() {
    await(SendOfferController.getProductByID(req, res));
  });
  GetProductByID();
});
router.post("/getEncryptedID", type, function(req, res) {
  var getEncryptedID = async(function() {
    await(SendOfferController.getEncryptedID(req, res));
  });
  getEncryptedID();
});

/* Eissa****************************************************/
router.post("/editUserAccessCustomers", function(req, res) {
  var editUserAccessCustomers = async(function() {
    await(UserController.updateUserAccessCustomers(req, res));
  });
  editUserAccessCustomers();
});

router.post("/editUserAccessSuppliers", function(req, res) {
  var editUserAccessSuppliers = async(function() {
    await(UserController.updateUserAccessSuppliers(req, res));
  });
  editUserAccessSuppliers();
});

router.post("/editUserAccessProducts", function(req, res) {
  var editUserAccessProducts = async(function() {
    await(UserController.updateUserAccessProducts(req, res));
  });
  editUserAccessProducts();
});

/////////////////////////////////////////
router.post("/getUserAccessCustomers", function(req, res) {
  var getUserAccessCustomers = async(function() {
    await(UserController.retrieveUserAccessCustomers(req, res));
  });
  getUserAccessCustomers();
});

router.post("/getUserAccessSuppliers", function(req, res) {
  var getUserAccessSuppliers = async(function() {
    await(UserController.retrieveUserAccessSuppliers(req, res));
  });
  getUserAccessSuppliers();
});

router.post("/getUserAccessProducts", function(req, res) {
  var getUserAccessProducts = async(function() {
    await(UserController.retrieveUserAccessProducts(req, res));
  });
  getUserAccessProducts();
});

/**************************Customer Order **********/
router.post("/addCustomerOrder", function(req, res) {
  var addCustomerOrder = async(function() {
    await(CustomerOrderController.addCustomerOrder(req, res));
  });
  addCustomerOrder();
});
router.post("/updateCustomerOrderProducts", function(req, res) {
  var updateCustomerOrderProducts = async(function() {
    await(CustomerOrderController.updateCustomerOrderProducts(req, res));
  });
  updateCustomerOrderProducts();
});
router.post("/updateCustomerOrderProductsIDsAndNames", function(req, res) {
  var updateCustomerOrderProductsIDsAndNames = async(function() {
    await(CustomerOrderController.updateCustomerOrderProductsIDsAndNames(req, res));
  });
  updateCustomerOrderProductsIDsAndNames();
});
router.post("/getCustomerOrdersByUserId", function(req, res) {
  var getCustomerOrders = async(function() {
    await(CustomerOrderController.getCustomerOrdersByUserId(req, res));
  });
  getCustomerOrders();
});

/*********************** Stores routes */
router.post("/addStoreProduct", function(req, res) {
  var addStoreProduct = async(function() {
    await(storeController.addStoreProduct(req, res));
  });
  addStoreProduct();
});
router.post("/editStoreProductByID", function(req, res) {
  var editStoreProductByID = async(function() {
    await(storeController.editStoreProductByID(req, res));
  });
  editStoreProductByID();
});
router.post("/getAllStoreProducts", function(req, res) {
  var getAllStoreProducts = async(function() {
    await(storeController.getAllStoreProducts(req, res));
  });
  getAllStoreProducts();
});
router.post("/ASCOrderGetAllStoreProducts", function(req, res) {
  var ASCOrderGetAllStoreProducts = async(function() {
    await(storeController.ASCOrderGetAllStoreProducts(req, res));
  });
  ASCOrderGetAllStoreProducts();
});
router.post("/DESCOrderGetAllStoreProducts", function(req, res) {
  var DESCOrderGetAllStoreProducts = async(function() {
    await(storeController.DESCOrderGetAllStoreProducts(req, res));
  });
  DESCOrderGetAllStoreProducts();
});
router.post("/getAllStoreProductsAllowedToUser", function(req, res) {
  var getAllStoreProductsAllowedToUser = async(function() {
    await(storeController.getAllStoreProductsAllowedToUser(req, res));
  });
  getAllStoreProductsAllowedToUser();
});
router.post("/ASCOrderGetAllStoreProductsAllowedToUser", function(req, res) {
  var ASCOrderGetAllStoreProductsAllowedToUser = async(function() {
    await(storeController.ASCOrderGetAllStoreProductsAllowedToUser(req, res));
  });
  ASCOrderGetAllStoreProductsAllowedToUser();
});
router.post("/DESCOrderGetAllStoreProductsAllowedToUser", function(req, res) {
  var DESCOrderGetAllStoreProductsAllowedToUser = async(function() {
    await(storeController.DESCOrderGetAllStoreProductsAllowedToUser(req, res));
  });
  DESCOrderGetAllStoreProductsAllowedToUser();
});
router.post("/getStoreProductsByUserId", function(req, res) {
  var getStoreProductsByUserId = async(function() {
    await(storeController.getStoreProductsByUserId(req, res));
  });
  getStoreProductsByUserId();
});
router.post("/getOneStoreProductById", function(req, res) {
  var getOneStoreProductById = async(function() {
    await(storeController.getOneStoreProductById(req, res));
  });
  getOneStoreProductById();
})
router.post("/searchStore", function(req, res) {
  var searchStore = async(function() {
    await(storeController.searchStore(req, res));
  });
  searchStore();
});
router.post("/addProductOutGoingToProductInStore", function(req, res) {
  var addProductOutGoingToProductInStore = async(function() {
    await(storeController.addProductOutGoingToProductInStore(req, res));
  });
  addProductOutGoingToProductInStore();
});

/*********************** Purchasing routes */
router.post("/addPurchasingProduct", function(req, res) {
  var addPurchasingProduct = async(function() {
    await(purchasingController.addPurchasingProduct(req, res));
  });
  addPurchasingProduct();
});
router.post("/editPurchasingProductById", function(req, res) {
  var editPurchasingProductById = async(function() {
    await(purchasingController.editPurchasingProductById(req, res));
  });
  editPurchasingProductById();
});
router.post("/getPurchasingProductsByUserId", function(req, res) {
  var getPurchasingProductsByUserId = async(function() {
    await(purchasingController.getPurchasingProductsByUserId(req, res));
  });
  getPurchasingProductsByUserId();
});
router.post("/getAllPurchasings", function(req, res) {
  var getAllPurchasings = async(function() {
    await(purchasingController.getAllPurchasings(req, res));
  });
  getAllPurchasings();
});
router.post("/ASCOrderGetAllPurchasings", function(req, res) {
  var ASCOrderGetAllPurchasings = async(function() {
    await(purchasingController.ASCOrderGetAllPurchasings(req, res));
  });
  ASCOrderGetAllPurchasings();
});
router.post("/DESCOrderGetAllPurchasings", function(req, res) {
  var DESCOrderGetAllPurchasings = async(function() {
    await(purchasingController.DESCOrderGetAllPurchasings(req, res));
  });
  DESCOrderGetAllPurchasings();
});
router.post("/getAllPurchasingsForAccounting", function(req, res) {
  var getAllPurchasingsForAccounting = async(function() {
    await(purchasingController.getAllPurchasingsForAccounting(req, res));
  });
  getAllPurchasingsForAccounting();
});
router.post("/ASCOrderGetAllPurchasingsForAccounting", function(req, res) {
  var ASCOrderGetAllPurchasingsForAccounting = async(function() {
    await(purchasingController.ASCOrderGetAllPurchasingsForAccounting(req, res));
  });
  ASCOrderGetAllPurchasingsForAccounting();
});
router.post("/DESCOrderGetAllPurchasingsForAccounting", function(req, res) {
  var DESCOrderGetAllPurchasingsForAccounting = async(function() {
    await(purchasingController.DESCOrderGetAllPurchasingsForAccounting(req, res));
  });
  DESCOrderGetAllPurchasingsForAccounting();
});
router.get("/getAllPurchasingsForStatistics", function(req, res) {
  var getAllPurchasingsForStatistics = async(function() {
    await(purchasingController.getAllPurchasingsForStatistics(req, res));
  });
  getAllPurchasingsForStatistics();
});
router.get("/getAllPurchasingsBills", function(req, res) {
  var getAllPurchasingsBills = async(function() {
    await(purchasingController.getAllPurchasingsBills(req, res));
  });
  getAllPurchasingsBills();
});
router.post("/getAllPurchaseProductsOfAspecificBill", function(req, res) {
  var getAllPurchaseProductsOfAspecificBill = async(function() {
    await(purchasingController.getAllPurchaseProductsOfAspecificBill(req, res));
  });
  getAllPurchaseProductsOfAspecificBill();
});
router.post("/getOnePurchasingProductById", function(req, res) {
  var getOnePurchasingProductById = async(function() {
    await(purchasingController.getOnePurchasingProductById(req, res));
  });
  getOnePurchasingProductById();
});
router.post("/searchPurchasing", function(req, res) {
  var searchPurchasing = async(function() {
    await(purchasingController.searchPurchasing(req, res));
  });
  searchPurchasing();
});

/************************Payment routes */

router.post("/addPayment", function(req, res) {
  var addPayment = async(function() {
    await(paymentController.addPayment(req, res));
  });
  addPayment();
});

router.post("/addPaymentsForOneBillOrMore", function(req, res) {
  var addPaymentsForOneBillOrMore = async(function() {
    await(paymentController.addPaymentsForOneBillOrMore(req, res));
  });
  addPaymentsForOneBillOrMore();
});

router.post("/getAllPaymentsForSpecificProductPurchasing", function(req, res) {
  var getAllPaymentsForSpecificProductPurchasing = async(function() {
    await(paymentController.getAllPaymentsForSpecificProductPurchasing(req, res));
  });
  getAllPaymentsForSpecificProductPurchasing();
});
router.post("/updatePaymentsForAspecificPurchasingProduct", function(req, res) {
  var updatePaymentsForAspecificPurchasingProduct = async(function() {
    await(paymentController.updatePaymentsForAspecificPurchasingProduct(req, res));
  });
  updatePaymentsForAspecificPurchasingProduct();
});

/************************Sales routes */

router.post("/addSellingProduct", function(req, res) {
  var addSellingProduct = async(function() {
    await(saleController.addSellingProduct(req, res));
  });
  addSellingProduct();
});
router.post("/getAllSalesProducts", function(req, res) {
  var getAllSalesProducts = async(function() {
    await(saleController.getAllSalesProducts(req, res));
  });
  getAllSalesProducts();
});
router.post("/ASCOrderGetAllSalesProducts", function(req, res) {
  var ASCOrderGetAllSalesProducts = async(function() {
    await(saleController.ASCOrderGetAllSalesProducts(req, res));
  });
  ASCOrderGetAllSalesProducts();
});
router.post("/DESCOrderGetAllSalesProducts", function(req, res) {
  var DESCOrderGetAllSalesProducts = async(function() {
    await(saleController.DESCOrderGetAllSalesProducts(req, res));
  });
  DESCOrderGetAllSalesProducts();
});
router.post("/getSalesProductsByUserId", function(req, res) {
  var getSalesProductsByUserId = async(function() {
    await(saleController.getSalesProductsByUserId(req, res));
  });
  getSalesProductsByUserId();
});
router.get("/getAllSales", function(req, res) {
  var getAllSales = async(function() {
    await(saleController.getAllSales(req, res));
  });
  getAllSales();
});
router.post("/getAllSalesForAccounting", function(req, res) {
  var getAllSalesForAccounting = async(function() {
    await(saleController.getAllSalesForAccounting(req, res));
  });
  getAllSalesForAccounting();
});
router.post("/ASCOrderGetAllSalesForAccounting", function(req, res) {
  var ASCOrderGetAllSalesForAccounting = async(function() {
    await(saleController.ASCOrderGetAllSalesForAccounting(req, res));
  });
  ASCOrderGetAllSalesForAccounting();
});
router.post("/DESCOrderGetAllSalesForAccounting", function(req, res) {
  var DESCOrderGetAllSalesForAccounting = async(function() {
    await(saleController.DESCOrderGetAllSalesForAccounting(req, res));
  });
  DESCOrderGetAllSalesForAccounting();
});
router.get("/getAllSalesForStatistics", function(req, res) {
  var getAllSalesForStatistics = async(function() {
    await(saleController.getAllSalesForStatistics(req, res));
  });
  getAllSalesForStatistics();
});
router.get("/getAllSalesBills", function(req, res) {
  var getAllSalesBills = async(function() {
    await(saleController.getAllSalesBills(req, res));
  });
  getAllSalesBills();
});
router.post("/searchSales", function(req, res) {
  var searchSales = async(function() {
    await(saleController.searchSales(req, res));
  });
  searchSales();
});
router.post("/getOneSaleProductById", function(req, res) {
  var getOneSaleProductById = async(function() {
    await(saleController.getOneSaleProductById(req, res));
  });
  getOneSaleProductById();
});
router.post("/getAllSalesProductByProduct_ID_In_Store", function(req, res) {
  var getAllSalesProductByProduct_ID_In_Store = async(function() {
    await(saleController.getAllSalesProductByProduct_ID_In_Store(req, res));
  });
  getAllSalesProductByProduct_ID_In_Store();
});
router.post("/editSaleProductById", function(req, res) {
  var editSaleProductById = async(function() {
    await(saleController.editSaleProductById(req, res));
  });
  editSaleProductById();
});

/************************ Receivables routes */

router.post("/addReceivable", function(req, res) {
  var addReceivable = async(function() {
    await(receivableController.addReceivable(req, res));
  });
  addReceivable();
});

router.post("/addReceivablesForOneBillOrMore", function(req, res) {
  var addReceivablesForOneBillOrMore = async(function() {
    await(receivableController.addReceivablesForOneBillOrMore(req, res));
  });
  addReceivablesForOneBillOrMore();
})

router.post("/getAllReceivablesForSpecificProductSelling", function(req, res) {
  var getAllReceivablesForSpecificProductSelling = async(function() {
    await(receivableController.getAllReceivablesForSpecificProductSelling(req, res));
  });
  getAllReceivablesForSpecificProductSelling();
});

/************************ Company routes */
router.get("/companies/getAll", type, function(req, res) {
  var Company = async(function() {
    await(CompanyController.getAll(req, res));
  });
  Company();
});
router.post("/companies/addCompany", type, function(req, res) {
  var Company = async(function() {
    await(CompanyController.addCompany(req, res));
  });
  Company();
});
router.post("/companies/editCompanyByCode", type, function(req, res) {
  var Company = async(function() {
    await(CompanyController.editCompanyByCode(req, res));
  });
  Company();
});
router.post("/companies/searchCompany", type, function(req, res) {
  var Company = async(function() {
    await(CompanyController.searchCompany(req, res));
  });
  Company();
});

/************************ Company Branches routes */
router.get("/branches/getAll", type, function(req, res) {
  var Branch = async(function() {
    await(BranchController.getAll(req, res));
  });
  Branch();
});
router.post("/branches/addBranch", type, function(req, res) {
  var Branch = async(function() {
    await(BranchController.addBranch(req, res));
  });
  Branch();
});
router.post("/branches/editBranchByCode", type, function(req, res) {
  var Branch = async(function() {
    await(BranchController.editBranchByCode(req, res));
  });
  Branch();
});
router.post("/branches/searchBranch", type, function(req, res) {
  var Branch = async(function() {
    await(BranchController.searchBranch(req, res));
  });
  Branch();
});
/************************ Inventory  routes */
router.get("/inventories/getAll", type, function(req, res) {
  var Inventory = async(function() {
    await(InventoryController.getAll(req, res));
  });
  Inventory();
});
router.post("/inventories/addInventory", type, function(req, res) {
  var Inventory = async(function() {
    await(InventoryController.addInventory(req, res));
  });
  Inventory();
});
router.post("/inventories/editInventoryByCode", type, function(req, res) {
  var Inventory = async(function() {
    await(InventoryController.editInventoryByCode(req, res));
  });
  Inventory();
});
router.post("/inventories/searchInventory", type, function(req, res) {
  var Inventory = async(function() {
    await(InventoryController.searchInventory(req, res));
  });
  Inventory();
});
/************************ Inventory Operations routes */
router.get("/inventoryOperations/getAll", type, function(req, res) {
  var InventoryOperation = async(function() {
    await(InventoryOperationController.getAll(req, res));
  });
  InventoryOperation();
});
router.post("/inventoryOperations/addInventoryOperation", type, function(req, res) {
  var InventoryOperation = async(function() {
    await(InventoryOperationController.addInventoryOperation(req, res));
  });
  InventoryOperation();
});
router.post("/inventoryOperations/editInventoryOperationByCode", type, function(req, res) {
  var InventoryOperation = async(function() {
    await(InventoryOperationController.editInventoryOperationByCode(req, res));
  });
  InventoryOperation();
});
router.post("/inventoryOperations/searchInventoryOperation", type, function(req, res) {
  var InventoryOperation = async(function() {
    await(InventoryOperationController.searchInventoryOperation(req, res));
  });
  InventoryOperation();
});

/*********Storage Places */
router.post("/storagePlaces/addStoragePlace", type, function(req, res) {
  var StoragePlace = async(function() {
    await(storagePlacesController.addStoragePlace(req, res));
  });
  StoragePlace();
});
router.post("/storagePlaces/editStoragePlaceById", type, function(req, res) {
  var StoragePlace = async(function() {
    await(storagePlacesController.editStoragePlaceById(req, res));
  });
  StoragePlace();
});
router.get("/storagePlaces/getAll", type, function(req, res) {
  var StoragePlace = async(function() {
    await(storagePlacesController.getAll(req, res));
  });
  StoragePlace();
});
router.post("/storagePlaces/getOneById", type, function(req, res) {
  var StoragePlace = async(function() {
    await(storagePlacesController.getOneById(req, res));
  });
  StoragePlace();
});

/*****     Increase inventory routes       ******* */
router.post("/increaseInventory/addIncreaseInventory", type, function(req, res) {
  var IncreaseInventory = async(function() {
    await(increaseInventoryController.addIncreaseInventory(req, res));
  });
  IncreaseInventory();
});
router.post("/increaseInventory/searchIncreaseInventory", type, function(req, res) {
  var IncreaseInventory = async(function() {
    await(increaseInventoryController.searchIncreaseInventory(req, res));
  });
  IncreaseInventory();
});
router.get("/increaseInventory/getAll", type, function(req, res) {
  var IncreaseInventory = async(function() {
    await(increaseInventoryController.getAll(req, res));
  });
  IncreaseInventory();
});
router.post("/increaseInventory/getOneById", type, function(req, res) {
  var IncreaseInventory = async(function() {
    await(increaseInventoryController.getOneById(req, res));
  });
  IncreaseInventory();
});

/*****     Decrease inventory routes       ******* */
router.post("/decreaseInventory/addDecreaseInventory", type, function(req, res) {
  var DecreaseInventory = async(function() {
    await(decreaseInventoryController.addDecreaseInventory(req, res));
  });
  DecreaseInventory();
});
router.post("/decreaseInventory/searchDecreaseInventory", type, function(req, res) {
  var DecreaseInventory = async(function() {
    await(decreaseInventoryController.searchDecreaseInventory(req, res));
  });
  DecreaseInventory();
});
router.get("/decreaseInventory/getAll", type, function(req, res) {
  var DecreaseInventory = async(function() {
    await(decreaseInventoryController.getAll(req, res));
  });
  DecreaseInventory();
});
router.post("/decreaseInventory/getOneById", type, function(req, res) {
  var DecreaseInventory = async(function() {
    await(decreaseInventoryController.getOneById(req, res));
  });
  DecreaseInventory();
});
/********       Supplier Bill                   */ 
router.post("/supplier-bill/addBill", type, function(req, res) {
  var Bill = async(function() {
    await(supplierBillController.addBill(req, res));
  });
  Bill();
});
router.post("/supplier-bill/searchBills", type, function(req, res) {
  var Bill = async(function() {
    await(supplierBillController.searchBills(req, res));
  });
  Bill();
});
router.get("/supplier-bill/getAll", type, function(req, res) {
  var Bill = async(function() {
    await(supplierBillController.getAll(req, res));
  });
  Bill();
});
router.post("/supplier-bill/getOneById", type, function(req, res) {
  var Bill = async(function() {
    await(supplierBillController.getOneById(req, res));
  });
  Bill();
});

/********       Supplier Return Bill                   */ 
router.post("/supplier-return-bill/addBill", type, function(req, res) {
  var ReturnBill = async(function() {
    await(supplierReturnBillController.addBill(req, res));
  });
  ReturnBill();
});
router.post("/supplier-return-bill/searchBills", type, function(req, res) {
  var ReturnBill = async(function() {
    await(supplierReturnBillController.searchBills(req, res));
  });
  ReturnBill();
});
router.get("/supplier-return-bill/getAll", type, function(req, res) {
  var ReturnBill = async(function() {
    await(supplierReturnBillController.getAll(req, res));
  });
  ReturnBill();
});
router.post("/supplier-return-bill/getOneById", type, function(req, res) {
  var ReturnBill = async(function() {
    await(supplierReturnBillController.getOneById(req, res));
  });
  ReturnBill();
});
/********      Order                  */ 
router.post("/orders/addOrder", type, function(req, res) {
  var Order = async(function() {
    await(orderController.addOrder(req, res));
  });
  Order();
});
router.post("/orders/editOrder", type, function(req, res) {
  var Order = async(function() {
    await(orderController.editOrder(req, res));
  });
  Order();
});
router.post("/orders/deleteProductInOrder", type, function(req, res) {
  var Order = async(function() {
    await(orderController.deleteProductInOrder(req, res));
  });
  Order();
});
router.post("/orders/searchOrders", type, function(req, res) {
  var Order = async(function() {
    await(orderController.searchOrders(req, res));
  });
  Order();
});
router.get("/orders/getAll", type, function(req, res) {
  var Order = async(function() {
    await(orderController.getAll(req, res));
  });
  Order();
});
router.post("/orders/getOneById", type, function(req, res) {
  var Order = async(function() {
    await(orderController.getOneById(req, res));
  });
  Order();
});
module.exports = router;

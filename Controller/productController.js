var Product = require("../Model/product");
var User = require("../Model/user");
var RequestPrice = require("../Model/request_price");
var SendOffer = require("../Model/send_offer");
var Document=require("../Model/document");
var fs = require('fs-js'); 
var path = require("path");
var multer = require("multer");
var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./public/documents");
  },
  filename: function(req, file, cb) {
    function makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }

    var datetimestamp = Date.now();
    var arr=file.originalname.split('.');
    cb(null, file.fieldname + "-" + datetimestamp + makeid(5)+ "." + arr[arr.length-1]);
    console.log("fieldname", file.fieldname);
  }
});
var upload = multer({
  //multer settings
  storage: storage,
}).any()
// var asyncLoop = require('node-async-loop');
// var async = require('asyncawait/async');
// var await = require('asyncawait/await');

module.exports = {
  /*eissa*/
  getProductHistory: function(request, res) {
    console.log("body", request.body);
    Product.find({ Product_Code: request.body.Product_Code })
      .select("history")
      .populate({ path: "history.HistoryCategory", select: "Category_Name" })
      .populate({
        path: "history.Historycountry",
        select: "Country_Name Country_Tcode"
      })
      //Historyproductclass
      .populate({
        path: "history.Historyproductclass",
        select: "Class_Name"
      })
      .populate({
        path: "history.Historycertification",
        select: "Certificate_Name Certificate_Description Certificate_IsActive"
      })
      .populate({
        path: "history.HistorySupplier"
        // select: ""
      })
      .populate({
        path: "history.HistoryManufacturer"
        //select: ""
      })
      .populate({
        path: "history.Historyproductform"
        //select: ""
      })
      .populate({
        path: "history.Historyproductpacking"
        //select: ""
      })
      .populate({
        path: "history.Historyproductrelease"
        //select: ""
      })
      .populate({
        path: "history.Historyproductstrage"
        //select: ""
      })
      .populate({
        path: "history.Historyproductcategory"
        //select: ""
      })
      .populate({
        path: "history.Historycustomer"
        //select: ""
      })
      .populate({
        path: "history.Historyweight"
        //select: ""
      })
      .populate({
        path: "history.Historyconcentration"
        //select: ""
      })
      .populate({
        path: "history.HistoryEditedUser",
        select: "User_Name"
      })
      .populate({
        path: "history.HistoryCheckedUser",
        select: "User_Name"
      })
      .populate({
        path: "history.HistorySellingArea",
        select: "SellingArea_Name"
      })

      .lean()
      .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err,
            proceed: false
          });
        } else if (product.length > 0) {
          res.send({
            history: product[0].history,
            proceed: true
          });
        } else {
          return res.send({
            message:
              "No product exist with User_Code provided in request body!",
            proceed: false
          });
        }
      });
  },
  checkProduct: function(request, res) {
    console.log("body", request.body);
    //we need to first: add existing product to history property of that product,
    //second:make property Product_IsChecked of that product to true
    Product.find({ Product_Code: request.body.Product_Code })
      .select("-history -Product_IsChecked -_id") //select all except history and Product_IsChecked and _id
      .lean()
      .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (product.length > 0) {
          let historyObject = product[0];
          historyObject["Product_CheckedBy_User_Code"] =
            request.body["User_Code"];
            console.log("1")
          User.find({ User_Code: request.body["User_Code"] })
            .select("User_Name")
            .lean()
            .exec(function(err, user) {
              if (err) {
                return res.send({
                  message: err
                });
              } else if (user.length > 0) {
                console.log("our user is:", user[0]);
                historyObject["Product_CheckedDate"] = new Date();
                console.log("our history object is:", historyObject);
                var newvalues = {
                  $set: {
                    Product_IsChecked: true
                  },
                  $push: { history: historyObject }
                };
                console.log("historyObject", historyObject);
                var myquery = { Product_Code: request.body.Product_Code };
                Product.findOneAndUpdate(myquery, newvalues, function(
                  err,
                  field
                ) {
                  if (err) {
                    return res.send({
                      message: "Error"
                    });
                  }
                  if (!field) {
                    return res.send({
                      message: "Product not exists"
                    });
                  } else {
                    return res.send({
                      message: true
                    });
                  }
                });
              } else {
                res.send(
                  "no user exist with user code provided in request body"
                );
              }
            });
        }
      });
  },
  declineProduct: function(req, res) {
    var updated={
      $set:{
        Product_IsChecked: false,
        Decline_Comment: req.body.Decline_Comment,
        Product_DeclinedBy_User_Code :req.body.User_Code
      }
    };
    Product.findOneAndUpdate({ Product_Code: req.body.Product_Code },updated,function(err, product) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (product ) {
        res.send({message:true})
      }
      else{
        res.send({message:"product is null"})
      }
    })
  },

  getDeclinedProductComment: function(req, res) {
    console.log("dd")
    Product.findOne({ Product_Code: req.body.Product_Code })
    .select('Decline_Comment Product_DeclinedBy_User_Code')
    .populate({path:"DeclinedUser"})
    .exec(function(err, product) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (product ) {
        res.send(product)
      }
      else{
        res.send({message:"product is null"})
      }
    })
  },
     
  getProductsForPurchasingForm: function(req, res) {
    Product.find({})
    .select("Product_Code Product_Name Product_Manufacturer_Code Product_Manufacturer")
    .populate({ path: "Manufacturer", select: "Supplier_Name" })
    .exec(function(err, product) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (product) {
        res.send(product);
      } else {
        res.send("not Product");
      }
    });
  },
  getProducts: function(req, res) {
    Product.aggregate([
      {
        $project: {
          concate: { $concat: ["$Product_Name", " ", "$Product_Suffix"] },
          Product_Name: "$Product_Name",
          Product_Suffix: "$Product_Suffix",
          Product_Code: "$Product_Code",
          Product_Category_ID: "$Product_Category_ID",
          Product_Manufacturer:"$Product_Manufacturer",
          Product_Manufacturer_Code:"$Product_Manufacturer_Code"
        }
      }
    ])

    .exec(function(err, product) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (product) {
        res.send(product);
      } else {
        res.send("not Product");
      }
    });
  },
  getCustomeProductsFieldByUserCode: function(request, res) {
    //filter only User_Allowed_Products
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Products != 1) {
          console.log("user have  no access for all products");
          filterObject = {
            Product_Code: { $in: user[0].User_Allowed_Products }
          };
        }
        if (request.body.letter && request.body.letter != "")
          filterObject["Product_Name"] = { $regex: `^${request.body.letter}` }; //`/^B/`;
        Product.find(filterObject)
          .populate({ path: "Manufacturer", select: "Supplier_Name" })
          .exec((err, filteredProducts) => {
            if (err) res.send(err);
            else if (filteredProducts)
              var data = CheckStatusRequestPrice(filteredProducts);
            else res.send("No products allowed for this user");
          });
      } else {
        res.send("There is no user with provided User_code in request body");
      }
    });
    CheckStatusRequestPrice = function(products) {
      return Promise.all(
        products.map(product => {
          return RequestPrice.findOne({
            "RequestPrice_Product.Product_ID": product.Product_Code
          }).then(result => {
            if (result) {
              product.Status = true;
            } else {
              return SendOffer.findOne({
                "SendOffer_Product.Product_ID": product.Product_Code
              }).then(send_offer => {
                if (send_offer) {
                  product.Status = true;
                } else {
                  product.Status = false;
                }
              });
            }
          });
        })
      ).then(results => {
        res.send(products);
      });
    };
  },

  ASCOrdergetCustomeProductsFieldByUserCode: function(request, res) {
    //filter only User_Allowed_Products
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Products != 1) {
          console.log("user have  no access for all products");
          filterObject = {
            Product_Code: { $in: user[0].User_Allowed_Products }
          };
        }
        Product.find(filterObject)
          .populate({ path: "Manufacturer", select: "Supplier_Name" })
          .exec((err, filteredProducts) => {
            if (err) res.send(err);
            else if (filteredProducts)
              var data = CheckStatusRequestPrice(filteredProducts);
            else res.send("No products allowed for this user");
          });
      } else {
        res.send("There is no user with provided User_code in request body");
      }
    });
    CheckStatusRequestPrice = function(products) {
      return Promise.all(
        products.map(product => {
          return RequestPrice.findOne({
            "RequestPrice_Product.Product_ID": product.Product_Code
          }).then(result => {
            if (result) {
              product.Status = true;
            } else {
              return SendOffer.findOne({
                "SendOffer_Product.Product_ID": product.Product_Code
              }).then(send_offer => {
                if (send_offer) {
                  product.Status = true;
                } else {
                  product.Status = false;
                }
              });
            }
          });
        })
      ).then(results => {
        res.send(products);
      });
    };
  },

  DESCOrdergetCustomeProductsFieldByUserCode: function(request, res) {
    //filter only User_Allowed_Products
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Products != 1) {
          console.log("user have  no access for all products");
          filterObject = {
            Product_Code: { $in: user[0].User_Allowed_Products }
          };
        }
        Product.find(filterObject).sort({ Product_Code: -1 })
          .populate({ path: "Manufacturer", select: "Supplier_Name" })
          .exec((err, filteredProducts) => {
            if (err) res.send(err);
            else if (filteredProducts)
              var data = CheckStatusRequestPrice(filteredProducts);
            else res.send("No products allowed for this user");
          });
      } else {
        res.send("There is no user with provided User_code in request body");
      }
    });
    CheckStatusRequestPrice = function(products) {
      return Promise.all(
        products.map(product => {
          return RequestPrice.findOne({
            "RequestPrice_Product.Product_ID": product.Product_Code
          }).then(result => {
            if (result) {
              product.Status = true;
            } else {
              return SendOffer.findOne({
                "SendOffer_Product.Product_ID": product.Product_Code
              }).then(send_offer => {
                if (send_offer) {
                  product.Status = true;
                } else {
                  product.Status = false;
                }
              });
            }
          });
        })
      ).then(results => {
        res.send(products);
      });
    };
  },

  getCustomeProductsField: function(req, res) {
    Product.aggregate([
      {
        $project: {
          Product_Code: "$Product_Code",
          Product_Name: "$Product_Name",
          Product_Chemical_Name: "$Product_Chemical_Name",
          Product_Abbreviation: "$Product_Abbreviation",
          Product_Manufacturer: "$Product_Manufacturer",
          Product_IsActive: "$Product_IsActive"
        }
      }
    ])
      .sort({ Product_Code: -1 })
      .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (product) {
          var data = CheckStatusRequestPrice(product);
        } else {
          res.send("not Product");
        }
      });
    CheckStatusRequestPrice = function(products) {
      return Promise.all(
        products.map(product => {
          return RequestPrice.findOne({
            "RequestPrice_Product.Product_ID": product.Product_Code
          }).then(result => {
            if (result) {
              product.Status = true;
            } else {
              return SendOffer.findOne({
                "SendOffer_Product.Product_ID": product.Product_Code
              }).then(send_offer => {
                if (send_offer) {
                  product.Status = true;
                } else {
                  product.Status = false;
                }
              });
            }
          });
        })
      ).then(results => {
        res.send(products);
      });
    };
  },

  getAllProduct: function(req, res) {
    console.log("yy")
    Product.find({ Product_Code: req.body.Product_Code })
      .populate({ path: "Category", select: "Category_Name" })
      .populate({ path: "productcategory", select: "ProductCategory_Name" })
      .populate({ path: "sellingArea", select: "SellingArea_Name" })

      //.populate({ path: 'Supplier', select: 'Supplier_Name' })
      .populate({ path: "productclass", select: "Class_Name" })
      .populate({ path: "certification", select: "Certificate_Name" })
      .populate({ path: "country", select: "Country_Name Country_Tcode" })
      .populate({ path: "productform", select: "Form_Code Form_Name" })
      .populate({ path: "productpacking", select: "Packing_Code Packing_Name" })
      .populate({ path: "productrelease", select: "Release_Code Release_Name" })
      .populate({
        path: "productstrage",
        select: "StorageType_Code StorageType_Name"
      })
      .populate({
        path: "productcategory",
        select: "ProductCategory_Code ProductCategory_Name"
      })
      //.populate({ path: 'customer', select: 'Customer_Code Customer_Name' })
      .populate({ path: "weight", select: "Weight_Code Weight_Name" })
      .populate({
        path: "concentration",
        select: "Concentration_Code Concentration_Name"
      })
      .lean()
      .exec(function(err, products) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (products) {
          res.send(products);
          //var data = CheckStatusRequestPrice(products);
        } else {
          res.send("not Product");
        }
      });

    // CheckStatusRequestPrice = function(products) {
    // 	return Promise.all(products.map(product => {
    // 	    return RequestPrice.findOne({'RequestPrice_Product.Product_ID': product.Product_Code}).then(result => {
    // 	      if (result) {
    // 	       	 product.Status = true;
    // 	      }else{
    // 	    		return SendOffer.findOne({'SendOffer_Product.Product_ID': product.Product_Code}).then(send_offer => {
    // 	       	 		if (send_offer) {
    // 	       	 			product.Status = true;
    // 					  }
    // 					  else{
    // 						product.Status = false;
    // 					  }
    // 	      		})
    // 	      }
    // 	    });
    // 	  }))
    // 	  .then((results) => {
    // 		    res.send(products);
    // 	});
    // }
  },

  getAllProductButMinified: function(req, res) {
    Product.find({})
    .select("Product_Code Product_Name")
    .exec(function(err,products){
      if(err) return res.send(err);
      else return res.send(products);
    })
  },
  searchProduct: function(req, res) {
    User.find({ User_Code: req.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user.length > 0) {
        console.log("req.body",req.body)
        //note :Whatever the type of the search, the searched word will always be
        //in req.body.Product_Name
        var object = {};

        if (req.body.type == "name")
          object = {
            Product_Name: {
              $regex: new RegExp(".*" + req.body.Product_Name + ".*", "i")
            }
          };
        else if(req.body.type == "Chemical Name")
          object = {
            Product_Chemical_Name: { $regex: req.body.Product_Name }
          };
          else if(req.body.type == "Product Code")
          object = {
            Product_Code:   req.body.Product_Name 
          };
        //get only allowed products user can access
        if (user[0].User_Access_All_Products == 0) {
          object["Product_Code"] = { $in: user[0].User_Allowed_Products };
        }
        Product.find(object)
          .populate({ path: "Manufacturer", select: "Supplier_Name" })
          .exec((err, filteredProducts) => {
            if (err) res.send(err);
            else if (filteredProducts)
              var data = CheckStatusRequestPrice(filteredProducts);
            else res.send("No products allowed for this user");
          });
        CheckStatusRequestPrice = function(products) {
          return Promise.all(
            products.map(product => {
              return RequestPrice.findOne({
                "RequestPrice_Product.Product_ID": product.Product_Code
              }).then(result => {
                if (result) {
                  product.Status = true;
                } else {
                  return SendOffer.findOne({
                    "SendOffer_Product.Product_ID": product.Product_Code
                  }).then(send_offer => {
                    if (send_offer) {
                      product.Status = true;
                    } else {
                      product.Status = false;
                    }
                  });
                }
              });
            })
          ).then(results => {
            res.send(products);
          });
        };
      } else {
        res.send("No user exist with User_Code provided in request body.");
      }
    });
  },

  addProduct: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user.length > 0) {
        Product.getLastCode(function(err, product) {
          if (product) InsertIntoProduct(product.Product_Code + 1, user[0]);
          else InsertIntoProduct(1, user[0]);
        });
      } else {
        res.send("No user exist with user code provided in request body.");
      }
    });

    function InsertIntoProduct(NextCode, user) {
      var newProduct = new Product();
            //Product category newly added /////////////////////////
            newProduct.Product_ProductCategory_Code=request.body.Product_ProductCategory_Code;
            //selling areas newly added /////////////////////////
            newProduct.Product_SellingAreaCodes=request.body.Product_SellingAreaCodes;
            newProduct.Product_SellingAreaNames=request.body.Product_SellingAreaNames;

      newProduct.Product_Code = NextCode;
      newProduct.Product_Name = request.body.Product_Name;
      newProduct.Product_Manufacturer = request.body.Product_Manufacturer;
      newProduct.Product_Manufacturer_Code =
        request.body.Product_Manufacturer_Code;
      newProduct.Product_Exporter = request.body.Product_Exporter;
      newProduct.Product_Abbreviation = request.body.Product_Abbreviation;
      newProduct.Product_Chemical_Name = request.body.Product_Chemical_Name;
      newProduct.Product_Molecular_Formula =
        request.body.Product_Molecular_Formula;
      newProduct.Product_Molecular_Weight =
        request.body.Product_Molecular_Weight;
      newProduct.Product_CAS_Number = request.body.Product_CAS_Number;
      newProduct.Product_EC_Number = request.body.Product_EC_Number;
      newProduct.Product_Appearance = request.body.Product_Appearance;
      newProduct.Product_Active_Content = request.body.Product_Active_Content;
      newProduct.Product_pH = request.body.Product_pH;
      newProduct.Product_Sp_gravity = request.body.Product_Sp_gravity;
      newProduct.Product_Chloride = request.body.Product_Chloride;
      newProduct.Product_Iron = request.body.Product_Iron;
      newProduct.Product_Phosphorous_Acid =
        request.body.Product_Phosphorous_Acid;
      newProduct.Product_O_phosphate = request.body.Product_O_phosphate;
      newProduct.Product_Hazen_color = request.body.Product_Hazen_color;
      newProduct.Product_Category_ID = request.body.Product_Category_ID;
      newProduct.Product_Origin_Country_Code =
        request.body.Product_Origin_Country_Code;
      newProduct.Product_Packing_Code = request.body.Product_Packing_Code;
      newProduct.Product_Supplier_Codes = request.body.Product_Supplier_Codes;
      newProduct.Product_Customer_Codes = request.body.Product_Customer_Codes;
      newProduct.Product_MSDS = request.body.Product_MSDS;
      newProduct.Product_Classes_Code = request.body.Product_Classes_Code;
      newProduct.Product_Assay = request.body.Product_Assay;
      newProduct.Product_Form_Code = request.body.Product_Form_Code;
      newProduct.Product_Certification = request.body.Product_Certification;
      newProduct.Melting_Unit_Tempreture_Unit_ID =
        request.body.Melting_Unit_Tempreture_Unit_ID;
      newProduct.Boiling_Unit_Tempreture_Unit_ID =
        request.body.Boiling_Unit_Tempreture_Unit_ID;
      newProduct.Product_Suffix = request.body.Product_Suffix;
      newProduct.Product_Release_Code = request.body.Product_Release_Code;
      newProduct.Product_StorageType_Code =
        request.body.Product_StorageType_Code;
      newProduct.Product_ProductCategory_Code =
        request.body.Product_ProductCategory_Code;
      newProduct.Product_IsActive = 1;
      newProduct.Product_Volatile_Matter = request.body.Product_Volatile_Matter;
      newProduct.Product_Sulphates = request.body.Product_Sulphates;
      newProduct.Product_Water_Insoluble_Matter =
        request.body.Product_Water_Insoluble_Matter;
      newProduct.Product_Organic_Compounds =
        request.body.Product_Organic_Compounds;
      newProduct.Product_Arsenic = request.body.Product_Arsenic;
      newProduct.Product_Lead = request.body.Product_Lead;
      newProduct.Product_Mercury = request.body.Product_Mercury;
      newProduct.Product_Cadmium = request.body.Product_Cadmium;
      newProduct.Product_Heavy_Metals = request.body.Product_Heavy_Metals;
      newProduct.Product_Ferrous_Fe2o3 = request.body.Product_Ferrous_Fe2o3;
      newProduct.Product_Alumumium_Al2O3 = request.body.Product_Alumumium_Al2O3;
      newProduct.Product_Titanicum_Tio2 = request.body.Product_Titanicum_Tio2;
      newProduct.Product_Free_Fatty_Acids =
        request.body.Product_Free_Fatty_Acids;
      newProduct.Product_Peroxide_Value = request.body.Product_Peroxide_Value;
      newProduct.Product_Iodine_Value = request.body.Product_Iodine_Value;
      newProduct.Product_Acetone = request.body.Product_Acetone;
      newProduct.Product_Methanol = request.body.Product_Methanol;
      newProduct.Product_Hydroyl_Number = request.body.Product_Hydroyl_Number;
      newProduct.Product_Impurities_Related_Substance =
        request.body.Product_Impurities_Related_Substance;
      newProduct.Product_Aldehyles = request.body.Product_Aldehyles;
      newProduct.Product_Esters = request.body.Product_Esters;
      newProduct.Product_Chlorenated_Compound =
        request.body.Product_Chlorenated_Compound;
      newProduct.Product_Water_Content = request.body.Product_Water_Content;
      newProduct.Product_Loss_On_Drying = request.body.Product_Loss_On_Drying;
      newProduct.Product_Starch_Test = request.body.Product_Starch_Test;
      newProduct.Product_Sulfur_Dioxides_Residual =
        request.body.Product_Sulfur_Dioxides_Residual;
      newProduct.Product_Antimony = request.body.Product_Antimony;
      newProduct.Product_Chrome = request.body.Product_Chrome;
      newProduct.Product_Selenium = request.body.Product_Selenium;
      newProduct.Product_Nickel = request.body.Product_Nickel;
      newProduct.Product_Residual_On_Solvent =
        request.body.Product_Residual_On_Solvent;
      newProduct.Product_Copper = request.body.Product_Copper;
      newProduct.Product_Oxalic_Acid = request.body.Product_Oxalic_Acid;
      newProduct.Product_Fumaric_Acid = request.body.Product_Fumaric_Acid;
      newProduct.Product_Maliec_Acid = request.body.Product_Maliec_Acid;
      newProduct.Product_Non_Volatyl_Reside =
        request.body.Product_Non_Volatyl_Reside;
      newProduct.Product_Ash = request.body.Product_Ash;
      newProduct.Product_Protien = request.body.Product_Protien;
      newProduct.Product_Nitrates = request.body.Product_Nitrates;
      newProduct.Product_Aflatoxine = request.body.Product_Aflatoxine;
      newProduct.Product_Melamine = request.body.Product_Melamine;
      newProduct.Product_Free_Halogens = request.body.Product_Free_Halogens;
      newProduct.Product_Description = request.body.Product_Description;
      newProduct.Product_Solubility = request.body.Product_Solubility;
      newProduct.Product_Absorbance = request.body.Product_Absorbance;
      newProduct.Product_InfraRed_Absorption =
        request.body.Product_InfraRed_Absorption;
      newProduct.Product_Think_Layer_Chromatography =
        request.body.Product_Think_Layer_Chromatography;
      newProduct.Product_Identifications_Relative_Dens =
        request.body.Product_Identifications_Relative_Density;
      newProduct.Product_Viscosity = request.body.Product_Viscosity;
      newProduct.Product_Foriein_Matter = request.body.Product_Foriein_Matter;
      newProduct.Product_Relative_Density_From =
        request.body.Product_Relative_Density_From;
      newProduct.Product_Relative_Density_To =
        request.body.Product_Relative_Density_To;
      newProduct.Product_Bulk_Density_From =
        request.body.Product_Bulk_Density_From;
      newProduct.Product_Bulk_Density_to = request.body.Product_Bulk_Density_to;
      newProduct.Product_Relative_Index = request.body.Product_Relative_Index;
      newProduct.Product_Spescific_Opticical_Rotation =
        request.body.Product_Spescific_Opticical_Rotation;
      newProduct.Product_Specific_Surface_Area =
        request.body.Product_Specific_Surface_Area;
      newProduct.Product_Residue_On_Sieve =
        request.body.Product_Residue_On_Sieve;
      newProduct.Product_Boiling_Point = request.body.Product_Boiling_Point;
      newProduct.Product_Melting_Point = request.body.Product_Melting_Point;
      newProduct.Product_Partical_Size = request.body.Product_Partical_Size;
      newProduct.Product_Weight_Unit_Code =
        request.body.Product_Weight_Unit_Code;
      newProduct.Product_Weight_Value = request.body.Product_Weight_Value;
      newProduct.Product_Concentration_Unit_Code =
        request.body.Product_Concentration_Unit_Code;
      newProduct.Product_Concentration_Value =
        request.body.Product_Concentration_Value;
      newProduct.Product_Remarkes = request.body.Product_Remarkes;
      newProduct.Product_Total_Plate_Count =
        request.body.Product_Total_Plate_Count;
      newProduct.Product_EColi = request.body.Product_EColi;
      newProduct.Product_Yeast = request.body.Product_Yeast;
      newProduct.Product_Mould = request.body.Product_Mould;
      newProduct.Product_Pathogenic_Bacterium =
        request.body.Product_Pathogenic_Bacterium;
      newProduct.Product_Escherichia_Cali =
        request.body.Product_Escherichia_Cali;
      newProduct.Product_Salmonila = request.body.Product_Salmonila;
      newProduct.Product_Staphyloccuse_Aureus =
        request.body.Product_Staphyloccuse_Aureus;
      newProduct.Product_Extra1 = request.body.Product_Extra1;
      newProduct.Product_Extra2 = request.body.Product_Extra2;
      newProduct.Product_Extra3 = request.body.Product_Extra3;
      newProduct.Product_Extra4 = request.body.Product_Extra4;
      newProduct.Product_Extra5 = request.body.Product_Extra5;
      newProduct.Product_Extra6 = request.body.Product_Extra6;
      newProduct.Product_Extra7 = request.body.Product_Extra7;
      newProduct.Product_Extra8 = request.body.Product_Extra8;
      newProduct.Product_Extra9 = request.body.Product_Extra9;
      newProduct.Product_Extra10 = request.body.Product_Extra10;
      newProduct.Product_Extra11 = request.body.Product_Extra11;
      //for inventory
      newProduct.Product_ExpirationPeriod = request.body.Product_ExpirationPeriod;
      newProduct.Product_MainUnit = request.body.Product_MainUnit;
      newProduct.Product_MiddleUnit = request.body.Product_MiddleUnit;
      newProduct.Product_MiddleUnitCountInMainUnit = request.body.Product_MiddleUnitCountInMainUnit;
      newProduct.Product_SmallUnit = request.body.Product_SmallUnit;
      newProduct.Product_SmallUnitCountInMiddleUnit = request.body.Product_SmallUnitCountInMiddleUnit;
      newProduct.Product_MinStocklimit = request.body.Product_MinStocklimit;
      newProduct.Product_Origin_Variants = request.body.Product_Origin_Variants;

      newProduct.save(function(error, doneadd) {
        if (error) {
          return res.send({
            message: error
          });
        } else {
          //check to see if user can access all products,if it is true we do nothing.
          //if it is not,we add product to user's allowed products
          if (user.User_Access_All_Products != 1) {
            //we need to add product to user allowed products array
            user.User_Allowed_Products.push(NextCode);
            var myquery = { User_Code: request.body.User_Code };
            var newvalues = {
              User_Allowed_Products: user.User_Allowed_Products
            };
            User.findOneAndUpdate(myquery, newvalues, function(err, field) {
              if (err) {
                return res.send({
                  message: true,
                  data: doneadd,
                  errormessage:
                    "Product saved, but with an error on add product for thiss user"
                });
              } else {
                return res.send({
                  data: doneadd,
                  message: true
                });
              }
            });
          } else {
            return res.send({
              data: doneadd,
              message: true
            });
          }
        }
      });
    }
  },

  editProductSuppliers: function(request, res) {
    var myquery = { Product_Code: request.body.Product_Code };
    var newvalues = {
      Product_Supplier_Codes: request.body.Product_Supplier_Codes,
      Product_IsChecked: false, //when you edit,it means product didnot checked yet.,
      Product_EditedBy_User_Code: request.body.User_Code,
      Product_EditingTime: new Date()
    };
    Product.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Product not exists"
        });
      } else {
        return res.send({
          message: true
        });
      }
    });
  },

  editProductCustomers: function(request, res) {
    var myquery = { Product_Code: request.body.Product_Code };
    var newvalues = {
      Product_Customer_Codes: request.body.Product_Customer_Codes,
      Product_IsChecked: false, //when you edit,it means product didnot checked yet.,
      Product_EditedBy_User_Code: request.body.User_Code,
      Product_EditingTime: new Date()
    };
    Product.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Product not exists"
        });
      } else {
        return res.send({
          message: true
        });
      }
    });
  },
  editProductSupplierCodes: function(req, res) {
    Product.find(
      { Product_Code: { $in: req.body.Product_Codes } },
      // { $set: { $push: { Product_Supplier_Codes: req.body.Supplier_Code } } },

      (err, products) => {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!products) {
          return res.send({
            message: "Products not exists"
          });
        } else {
          const p = updateDocs(products);
          p.then(() => {
            return res.send({ message: true });
          });
          p.catch(err => {
            return res.send({ message: err });
          });
        }
      }
    );
    async function updateDocs(products) {
      products.forEach(product => {
        if (!product.Product_Supplier_Codes) {
          product.Product_Supplier_Codes = [];
        }
        if (!product.Product_Supplier_Codes.includes(req.body.Supplier_Code)) {
          product.Product_Supplier_Codes.push(req.body.Supplier_Code);
          product
            .save()
            .then(newProd => {
              console.log("new", newProd);
            })
            .catch(err => {
              return res.send({
                message: "Products not exists"
              });
            });
        }
      });
    }
  },
  removeProductSupplierCodes: function(req, res) {
    Product.findOne({ Product_Code: req.body.Product_Code }, (err, product) => {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!product) {
        return res.send({
          message: "Products not exists"
        });
      } else {
        if (
          product.Product_Supplier_Codes &&
          product.Product_Supplier_Codes.includes(req.body.Supplier_Code)
        ) {
          const newCodes = product.Product_Supplier_Codes.filter(
            code => code != req.body.Supplier_Code
          );
          product.Product_Supplier_Codes = newCodes;
          product
            .save()
            .then(newDocument => {
              return res.send({
                message: true
              });
            })
            .catch(err => {
              return res.send({
                message: err
              });
            });
        }
      }
    });
  },
  editProductCustomerCodes: function(req, res) {
    Product.find(
      { Product_Code: { $in: req.body.Product_Codes } },
      // { $set: { $push: { Product_Supplier_Codes: req.body.Supplier_Code } } },

      (err, products) => {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!products) {
          return res.send({
            message: "Products not exists"
          });
        } else {
          const p = updateDocs(products);
          p.then(() => {
            return res.send({ message: true });
          });
          p.catch(err => {
            return res.send({ message: err });
          });
        }
      }
    );
    async function updateDocs(products) {
      products.forEach(product => {
        if (!product.Product_Customer_Codes) {
          product.Product_Customer_Codes = [];
        }
        if (!product.Product_Customer_Codes.includes(req.body.Customer_Code)) {
          product.Product_Customer_Codes.push(req.body.Customer_Code);
          product
            .save()
            .then(newProd => {
              console.log("new", newProd);
            })
            .catch(err => {
              return res.send({
                message: "Products not exists"
              });
            });
        }
      });
    }
  },
  removeProductCustomerCodes: function(req, res) {
    Product.findOne({ Product_Code: req.body.Product_Code }, (err, product) => {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!product) {
        return res.send({
          message: "Products not exists"
        });
      } else {
        if (
          product.Product_Customer_Codes &&
          product.Product_Customer_Codes.includes(req.body.Customer_Code)
        ) {
          const newCodes = product.Product_Customer_Codes.filter(
            code => code != req.body.Customer_Code
          );
          product.Product_Customer_Codes = newCodes;
          product
            .save()
            .then(newDocument => {
              return res.send({
                message: true
              });
            })
            .catch(err => {
              return res.send({
                message: err
              });
            });
        }
      }
    });
  },
  editProduct: function(request, res) {
    var newvalues = {
      $set: {
        //Product category newly added /////////////////////////
        Product_ProductCategory_Code:request.body.Product_ProductCategory_Code,
              //selling areas newly added /////////////////////////
      Product_SellingAreaCodes :request.body.Product_SellingAreaCodes,
      Product_SellingAreaNames :request.body.Product_SellingAreaNames,

        Product_Name: request.body.Product_Name,
        Product_Chemical_Name: request.body.Product_Chemical_Name,
        Product_Manufacturer: request.body.Product_Manufacturer,
        Product_Manufacturer_Code: request.body.Product_Manufacturer_Code,
        Product_Exporter: request.body.Product_Exporter,
        Product_Abbreviation: request.body.Product_Abbreviation,
        Product_Molecular_Formula: request.body.Product_Molecular_Formula,
        Product_Molecular_Weight: request.body.Product_Molecular_Weight,
        Product_CAS_Number: request.body.Product_CAS_Number,
        Product_EC_Number: request.body.Product_EC_Number,
        Product_Appearance: request.body.Product_Appearance,
        Product_Active_Content: request.body.Product_Active_Content,
        Product_pH: request.body.Product_pH,
        Product_Sp_gravity: request.body.Product_Sp_gravity,
        Product_Chloride: request.body.Product_Chloride,
        Product_Iron: request.body.Product_Iron,
        Product_Phosphorous_Acid: request.body.Product_Phosphorous_Acid,
        Product_O_phosphate: request.body.Product_O_phosphate,
        Product_Hazen_color: request.body.Product_Hazen_color,
        Product_Category_ID: request.body.Product_Category_ID,
        Product_Origin_Country_Code: request.body.Product_Origin_Country_Code,
        Product_Packing_Code: request.body.Product_Packing_Code,
        Product_Supplier_Codes: request.body.Product_Supplier_Codes,
        Product_Customer_Codes: request.body.Product_Customer_Codes,
        Product_MSDS: request.body.Product_MSDS,
        Product_Classes_Code: request.body.Product_Classes_Code,
        Product_Assay: request.body.Product_Assay,
        Product_Form_Code: request.body.Product_Form_Code,
        Product_Certification: request.body.Product_Certification,
        Melting_Unit_Tempreture_Unit_ID:
          request.body.Melting_Unit_Tempreture_Unit_ID,
        Boiling_Unit_Tempreture_Unit_ID:
          request.body.Boiling_Unit_Tempreture_Unit_ID,
        Product_Suffix: request.body.Product_Suffix,
        Product_Release_Code: request.body.Product_Release_Code,
        Product_StorageType_Code: request.body.Product_StorageType_Code,
        Product_ProductCategory_Code: request.body.Product_ProductCategory_Code,
        Product_IsActive: request.body.Product_IsActive,
        Product_Volatile_Matter: request.body.Product_Volatile_Matter,
        Product_Sulphates: request.body.Product_Sulphates,
        Product_Water_Insoluble_Matter:
          request.body.Product_Water_Insoluble_Matter,
        Product_Organic_Compounds: request.body.Product_Organic_Compounds,
        Product_Arsenic: request.body.Product_Arsenic,
        Product_Lead: request.body.Product_Lead,
        Product_Mercury: request.body.Product_Mercury,
        Product_Cadmium: request.body.Product_Cadmium,
        Product_Heavy_Metals: request.body.Product_Heavy_Metals,
        Product_Ferrous_Fe2o3: request.body.Product_Ferrous_Fe2o3,
        Product_Alumumium_Al2O3: request.body.Product_Alumumium_Al2O3,
        Product_Titanicum_Tio2: request.body.Product_Titanicum_Tio2,
        Product_Free_Fatty_Acids: request.body.Product_Free_Fatty_Acids,
        Product_Peroxide_Value: request.body.Product_Peroxide_Value,
        Product_Iodine_Value: request.body.Product_Iodine_Value,
        Product_Acetone: request.body.Product_Acetone,
        Product_Methanol: request.body.Product_Methanol,
        Product_Hydroyl_Number: request.body.Product_Hydroyl_Number,
        Product_Impurities_Related_Substance:
          request.body.Product_Impurities_Related_Substance,
        Product_Aldehyles: request.body.Product_Aldehyles,
        Product_Esters: request.body.Product_Esters,
        Product_Chlorenated_Compound: request.body.Product_Chlorenated_Compound,
        Product_Water_Content: request.body.Product_Water_Content,
        Product_Loss_On_Drying: request.body.Product_Loss_On_Drying,
        Product_Starch_Test: request.body.Product_Starch_Test,
        Product_Sulfur_Dioxides_Residual:
          request.body.Product_Sulfur_Dioxides_Residual,
        Product_Antimony: request.body.Product_Antimony,
        Product_Chrome: request.body.Product_Chrome,
        Product_Selenium: request.body.Product_Selenium,
        Product_Nickel: request.body.Product_Nickel,
        Product_Residual_On_Solvent: request.body.Product_Residual_On_Solvent,
        Product_Copper: request.body.Product_Copper,
        Product_Oxalic_Acid: request.body.Product_Oxalic_Acid,
        Product_Fumaric_Acid: request.body.Product_Fumaric_Acid,
        Product_Maliec_Acid: request.body.Product_Maliec_Acid,
        Product_Non_Volatyl_Reside: request.body.Product_Non_Volatyl_Reside,
        Product_Ash: request.body.Product_Ash,
        Product_Protien: request.body.Product_Protien,
        Product_Nitrates: request.body.Product_Nitrates,
        Product_Aflatoxine: request.body.Product_Aflatoxine,
        Product_Melamine: request.body.Product_Melamine,
        Product_Free_Halogens: request.body.Product_Free_Halogens,
        Product_Description: request.body.Product_Description,
        Product_Solubility: request.body.Product_Solubility,
        Product_Absorbance: request.body.Product_Absorbance,
        Product_InfraRed_Absorption: request.body.Product_InfraRed_Absorption,
        Product_Think_Layer_Chromatography:
          request.body.Product_Think_Layer_Chromatography,
        Product_Identifications_Relative_Dens:
          request.body.Product_Identifications_Relative_Density,
        Product_Viscosity: request.body.Product_Viscosity,
        Product_Foriein_Matter: request.body.Product_Foriein_Matter,
        Product_Relative_Density_From:
          request.body.Product_Relative_Density_From,
        Product_Relative_Density_To: request.body.Product_Relative_Density_To,
        Product_Bulk_Density_From: request.body.Product_Bulk_Density_From,
        Product_Bulk_Density_to: request.body.Product_Bulk_Density_to,
        Product_Relative_Index: request.body.Product_Relative_Index,
        Product_Spescific_Opticical_Rotation:
          request.body.Product_Spescific_Opticical_Rotation,
        Product_Specific_Surface_Area:
          request.body.Product_Specific_Surface_Area,
        Product_Residue_On_Sieve: request.body.Product_Residue_On_Sieve,
        Product_Boiling_Point: request.body.Product_Boiling_Point,
        Product_Melting_Point: request.body.Product_Melting_Point,
        Product_Partical_Size: request.body.Product_Partical_Size,
        Product_Weight_Unit_Code: request.body.Product_Weight_Unit_Code,
        Product_Weight_Value: request.body.Product_Weight_Value,
        Product_Concentration_Unit_Code:
          request.body.Product_Concentration_Unit_Code,
        Product_Concentration_Value: request.body.Product_Concentration_Value,
        Product_Remarkes: request.body.Product_Remarkes,
        Product_Total_Plate_Count: request.body.Product_Total_Plate_Count,
        Product_EColi: request.body.Product_EColi,
        Product_Yeast: request.body.Product_Yeast,
        Product_Mould: request.body.Product_Mould,
        Product_Pathogenic_Bacterium: request.body.Product_Pathogenic_Bacterium,
        Product_Escherichia_Cali: request.body.Product_Escherichia_Cali,
        Product_Salmonila: request.body.Product_Salmonila,
        Product_Staphyloccuse_Aureus: request.body.Product_Staphyloccuse_Aureus,
        Product_Extra1: request.body.Product_Extra1,
        Product_Extra2: request.body.Product_Extra2,
        Product_Extra3: request.body.Product_Extra3,
        Product_Extra4: request.body.Product_Extra4,
        Product_Extra5: request.body.Product_Extra5,
        Product_Extra6: request.body.Product_Extra6,
        Product_Extra7: request.body.Product_Extra7,
        Product_Extra8: request.body.Product_Extra8,
        Product_Extra9: request.body.Product_Extra9,
        Product_Extra10: request.body.Product_Extra10,
        Product_Extra11: request.body.Product_Extra11,
        //for inventory
        Product_ExpirationPeriod : request.body.Product_ExpirationPeriod,
        Product_MainUnit : request.body.Product_MainUnit,
        Product_MiddleUnit : request.body.Product_MiddleUnit,
        Product_MiddleUnitCountInMainUnit : request.body.Product_MiddleUnitCountInMainUnit,
        Product_SmallUnit : request.body.Product_SmallUnit,
        Product_SmallUnitCountInMiddleUnit : request.body.Product_SmallUnitCountInMiddleUnit,
        Product_MinStocklimit : request.body.Product_MinStocklimit,
        Product_Origin_Variants : request.body.Product_Origin_Variants,
        
        Product_IsChecked: false, //when you edit,it means product didnot checked yet.,
        Product_EditedBy_User_Code: request.body.User_Code,
        Product_EditingTime: new Date()
      }
    };

    var myquery = { Product_Code: request.body.Product_Code };
    Product.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Product not exists"
        });
      } else {
        return res.send({
          message: true
        });
      }
    });
  },

  copyProduct: function(req, res) {
    Product.findOne({ Product_Code: Number(req.body.Product_Code) }).exec(
      function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (!product) {
          res.send("not Product");
        } else {
          Product.getLastCode(function(err, productCode) {
            if (productCode)
              copyNewProduct(productCode.Product_Code + 1, product);
            else copyNewProduct(1, product);
          });
        }
      }
    );

    function copyNewProduct(NextCode, product) {
      var newProduct = new Product();
        //Product category newly added /////////////////////////
        newProduct.Product_ProductCategory_Code=product.Product_ProductCategory_Code,
              //selling areas newly added /////////////////////////
              newProduct.Product_SellingAreaCodes =product.Product_SellingAreaCodes,
              newProduct.Product_SellingAreaNames =product.Product_SellingAreaNames,

      newProduct.Product_Code = NextCode;
      (newProduct.Product_Name = req.body.Product_Name),
        (newProduct.Product_Manufacturer = product.Product_Manufacturer);
      newProduct.Product_Manufacturer_Code = product.Product_Manufacturer_Code;
      newProduct.Product_Exporter = product.Product_Exporter;
      newProduct.Product_Abbreviation = product.Product_Abbreviation;
      newProduct.Product_Chemical_Name = product.Product_Chemical_Name;
      newProduct.Product_Molecular_Formula = product.Product_Molecular_Formula;
      newProduct.Product_Molecular_Weight = product.Product_Molecular_Weight;
      newProduct.Product_CAS_Number = product.Product_CAS_Number;
      newProduct.Product_EC_Number = product.Product_EC_Number;
      newProduct.Product_Appearance = product.Product_Appearance;
      newProduct.Product_Active_Content = product.Product_Active_Content;
      newProduct.Product_pH = product.Product_pH;
      newProduct.Product_Sp_gravity = product.Product_Sp_gravity;
      newProduct.Product_Chloride = product.Product_Chloride;
      newProduct.Product_Iron = product.Product_Iron;
      newProduct.Product_Phosphorous_Acid = product.Product_Phosphorous_Acid;
      newProduct.Product_O_phosphate = product.Product_O_phosphate;
      newProduct.Product_Hazen_color = product.Product_Hazen_color;
      newProduct.Product_Category_ID = product.Product_Category_ID;
      newProduct.Product_Origin_Country_Code =
        product.Product_Origin_Country_Code;
      newProduct.Product_Packing_Code = product.Product_Packing_Code;
      newProduct.Product_Supplier_Codes = product.Product_Supplier_Codes;
      newProduct.Product_Customer_Codes = product.Product_Customer_Codes;
      newProduct.Product_MSDS = product.Product_MSDS;
      newProduct.Product_Classes_Code = product.Product_Classes_Code;
      newProduct.Product_Assay = product.Product_Assay;
      newProduct.Product_Form_Code = product.Product_Form_Code;
      newProduct.Product_Certification = product.Product_Certification;
      newProduct.Melting_Unit_Tempreture_Unit_ID =
        product.Melting_Unit_Tempreture_Unit_ID;
      newProduct.Boiling_Unit_Tempreture_Unit_ID =
        product.Boiling_Unit_Tempreture_Unit_ID;
      newProduct.Product_Suffix = product.Product_Suffix;
      newProduct.Product_Release_Code = product.Product_Release_Code;
      newProduct.Product_StorageType_Code = product.Product_StorageType_Code;
      newProduct.Product_ProductCategory_Code =
        product.Product_ProductCategory_Code;
      newProduct.Product_IsActive = product.Product_IsActive;
      newProduct.Product_Volatile_Matter = product.Product_Volatile_Matter;
      newProduct.Product_Sulphates = product.Product_Sulphates;
      newProduct.Product_Water_Insoluble_Matter =
        product.Product_Water_Insoluble_Matter;
      newProduct.Product_Organic_Compounds = product.Product_Organic_Compounds;
      newProduct.Product_Arsenic = product.Product_Arsenic;
      newProduct.Product_Lead = product.Product_Lead;
      newProduct.Product_Mercury = product.Product_Mercury;
      newProduct.Product_Cadmium = product.Product_Cadmium;
      newProduct.Product_Heavy_Metals = product.Product_Heavy_Metals;
      newProduct.Product_Ferrous_Fe2o3 = product.Product_Ferrous_Fe2o3;
      newProduct.Product_Alumumium_Al2O3 = product.Product_Alumumium_Al2O3;
      newProduct.Product_Titanicum_Tio2 = product.Product_Titanicum_Tio2;
      newProduct.Product_Free_Fatty_Acids = product.Product_Free_Fatty_Acids;
      newProduct.Product_Peroxide_Value = product.Product_Peroxide_Value;
      newProduct.Product_Iodine_Value = product.Product_Iodine_Value;
      newProduct.Product_Acetone = product.Product_Acetone;
      newProduct.Product_Methanol = product.Product_Methanol;
      newProduct.Product_Hydroyl_Number = product.Product_Hydroyl_Number;
      newProduct.Product_Impurities_Related_Substance =
        product.Product_Impurities_Related_Substance;
      newProduct.Product_Aldehyles = product.Product_Aldehyles;
      newProduct.Product_Esters = product.Product_Esters;
      newProduct.Product_Chlorenated_Compound =
        product.Product_Chlorenated_Compound;
      newProduct.Product_Water_Content = product.Product_Water_Content;
      newProduct.Product_Loss_On_Drying = product.Product_Loss_On_Drying;
      newProduct.Product_Starch_Test = product.Product_Starch_Test;
      newProduct.Product_Sulfur_Dioxides_Residual =
        product.Product_Sulfur_Dioxides_Residual;
      newProduct.Product_Antimony = product.Product_Antimony;
      newProduct.Product_Chrome = product.Product_Chrome;
      newProduct.Product_Selenium = product.Product_Selenium;
      newProduct.Product_Nickel = product.Product_Nickel;
      newProduct.Product_Residual_On_Solvent =
        product.Product_Residual_On_Solvent;
      newProduct.Product_Copper = product.Product_Copper;
      newProduct.Product_Oxalic_Acid = product.Product_Oxalic_Acid;
      newProduct.Product_Fumaric_Acid = product.Product_Fumaric_Acid;
      newProduct.Product_Maliec_Acid = product.Product_Maliec_Acid;
      newProduct.Product_Non_Volatyl_Reside =
        product.Product_Non_Volatyl_Reside;
      newProduct.Product_Ash = product.Product_Ash;
      newProduct.Product_Protien = product.Product_Protien;
      newProduct.Product_Nitrates = product.Product_Nitrates;
      newProduct.Product_Aflatoxine = product.Product_Aflatoxine;
      newProduct.Product_Melamine = product.Product_Melamine;
      newProduct.Product_Free_Halogens = product.Product_Free_Halogens;
      newProduct.Product_Description = product.Product_Description;
      newProduct.Product_Solubility = product.Product_Solubility;
      newProduct.Product_Absorbance = product.Product_Absorbance;
      newProduct.Product_InfraRed_Absorption =
        product.Product_InfraRed_Absorption;
      newProduct.Product_Think_Layer_Chromatography =
        product.Product_Think_Layer_Chromatography;
      newProduct.Product_Identifications_Relative_Dens =
        product.Product_Identifications_Relative_Density;
      newProduct.Product_Viscosity = product.Product_Viscosity;
      newProduct.Product_Foriein_Matter = product.Product_Foriein_Matter;
      newProduct.Product_Relative_Density_From =
        product.Product_Relative_Density_From;
      newProduct.Product_Relative_Density_To =
        product.Product_Relative_Density_To;
      newProduct.Product_Bulk_Density_From = product.Product_Bulk_Density_From;
      newProduct.Product_Bulk_Density_to = product.Product_Bulk_Density_to;
      newProduct.Product_Relative_Index = product.Product_Relative_Index;
      newProduct.Product_Spescific_Opticical_Rotation =
        product.Product_Spescific_Opticical_Rotation;
      newProduct.Product_Specific_Surface_Area =
        product.Product_Specific_Surface_Area;
      newProduct.Product_Residue_On_Sieve = product.Product_Residue_On_Sieve;
      newProduct.Product_Boiling_Point = product.Product_Boiling_Point;
      newProduct.Product_Melting_Point = product.Product_Melting_Point;
      newProduct.Product_Partical_Size = product.Product_Partical_Size;
      newProduct.Product_Weight_Unit_Code = product.Product_Weight_Unit_Code;
      newProduct.Product_Weight_Value = product.Product_Weight_Value;
      newProduct.Product_Concentration_Unit_Code =
        product.Product_Concentration_Unit_Code;
      newProduct.Product_Concentration_Value =
        product.Product_Concentration_Value;
      newProduct.Product_Remarkes = product.Product_Remarkes;
      newProduct.Product_Total_Plate_Count = product.Product_Total_Plate_Count;
      newProduct.Product_EColi = product.Product_EColi;
      newProduct.Product_Yeast = product.Product_Yeast;
      newProduct.Product_Mould = product.Product_Mould;
      newProduct.Product_Pathogenic_Bacterium =
        product.Product_Pathogenic_Bacterium;
      newProduct.Product_Escherichia_Cali = product.Product_Escherichia_Cali;
      newProduct.Product_Salmonila = product.Product_Salmonila;
      newProduct.Product_Staphyloccuse_Aureus =
        product.Product_Staphyloccuse_Aureus;
      newProduct.Product_Extra1 = product.Product_Extra1;
      newProduct.Product_Extra2 = product.Product_Extra2;
      newProduct.Product_Extra3 = product.Product_Extra3;
      newProduct.Product_Extra4 = product.Product_Extra4;
      newProduct.Product_Extra5 = product.Product_Extra5;
      newProduct.Product_Extra6 = product.Product_Extra6;
      newProduct.Product_Extra7 = product.Product_Extra7;
      newProduct.Product_Extra8 = product.Product_Extra8;
      newProduct.Product_Extra9 = product.Product_Extra9;
      newProduct.Product_Extra10 = product.Product_Extra10;
      newProduct.Product_Extra11 = product.Product_Extra11;
      newProduct.save(function(error, doneadd) {
        if (error) {
          return res.send({
            message: error
          });
        } else {
          return res.send({
            message: true
          });
        }
      });
    }
  },

  removeProduct: function(request, response) {
    var object = { Product_Code: request.body.Product_Code };
    Product.remove(object).exec(function(err, done) {
      if (err) {
        response.send({ message: err });
      }
      if (done) {
        response.send(true);
      } else {
        response.send(false);
      }
    });
  },

  addDocuments: function(req, res) {
    upload(req, res, function(err) {
      //console.log("req.body", req.body);
      //console.log("req.files", req.files);
      if (err) {
        res.status(422).json({ error_code: 1, err_desc: err });
        return;
      }
      /** Multer gives us files info in req.files object */
      if (!req.files) {
        res.json({ error_code: 1, err_desc: "No file passed" });
        return;
      }
      req.body.productDocuments=JSON.parse(req.body.productDocuments)
      const newDocs=[]
      req.body.productDocuments.forEach((pd)=>{
        if(!pd['_id']){
          newDocs.push(pd);
        }
      })
      console.log("newDocs",newDocs)
       req.files.forEach((file,index)=>{
        newDocs[index].Document_Url=file.filename
       })
     
       console.log("req.body.productDocuments",req.body.productDocuments);
       Product.find({ Product_Code:req.body.Product_Code}).lean().exec(function(err,product){
        if (err) {
          response.send({ message1: err });
        }
        else if (product.length>0) {
            Document.insertMany(newDocs,function(err,documents){
              if (err) {
                res.send({ message2: err });
              }else{
                console.log("documents",documents)
               // product[0].Product_Documents=[]
               if(! product[0].Product_Documents)product[0].Product_Documents=[]
                documents.forEach(d=>{
                  product[0].Product_Documents.push(d['_id'])
                })
                var newvalues={
                  $set:{
                    Product_Documents:product[0].Product_Documents
                  }
              }
                var myquery = { Product_Code: req.body.Product_Code };
                Product.findOneAndUpdate(myquery, newvalues, function(err, field) {
                  if (err) {
                    return res.send({
                      message: "Error"
                    });
                  }
                  if (!field) {
                    return res.send({
                      message: "Product not exists"
                    });
                  } else {
                    return res.send({
                      message: true
                    });
                  }
                });
                

              }
            })
          
          
        } else {
          console.log("product",product)
          res.send({message:"no product exist for these documents"});
        }
       })
  })
    
  },

  getDocuments:function(req,res){
    
    Product.find({ Product_Code: req.body.Product_Code })
    .select("Product_Documents") 
    .populate({ path: "Product_Documents", select: "Document_Name Document_Description Document_End_Date Document_Url" })
    .lean()
    .exec(function(err, product) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (product.length > 0) {
        return res.send({
          Product_Documents: product[0].Product_Documents
        });
      }
      else{
        return res.send({
          message: "product not exist"
        });
      }
  })
},

deleteDocument:function(req,res){
    
  Product.findOne({ Product_Code: req.body.Product_Code })
  .select("Product_Documents") 
  .exec(function(err, product) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (product) {
      console.log("product BEFORE",product )
      product["Product_Documents"].forEach((docID,index)=>{
        if(docID==req.body.documentID){
          product["Product_Documents"].splice(index,1)
        }
      })
      console.log("product AFTER",product )
      var newvalues={
        $set:{
          Product_Documents:product.Product_Documents
        }
      }
      var myquery = { Product_Code: req.body.Product_Code };
      Product.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Product not exists"
          });
        } else {
          //delete the document from file system if already existed
          if(req.body['Document_Url']){
          console.log("__dirname.replace('Controller','')",__dirname.replace('Controller',''))
          fs.unlink(path.join(__dirname.replace('Controller',''), "public","documents",req.body['Document_Url']), (err) => {
            if (err) return res.send({ message: err });
            //we need to delete the document in document collection
          Document.remove({_id:req.body.documentID}).exec(function(err, done) {
            if (err) {
              res.send({ message: err });
            }
            if (done) {
              return res.send({
                message: true
              });
            } else {
              response.send(false)
            }
          });
            });
          }
         
            
          
         
        }
      });
    }
    else{
      return res.send({
        message: "product not exist"
      });
    }
})
},
getProductsNumber:function(req,res){
  Product.find({}).count(function(err, count){
    console.log("Number of docs: ", count );
    if(err){
      return res.send({err:err})
    }else {
      return res.send({count:count})
    }
});  
},

getCheckedProductsNumber:function(req,res){
  Product.find({Product_IsChecked:true}).count(function(err, count){
    console.log("Number of docs: ", count );
    if(err){
      return res.send({err:err})
    }else {
      return res.send({count:count})
    }
});  
},

getCategoriedProducts:function(req,res){
  Product.find({Product_Category_ID :{$in: req.body.Category_ID}})
  .select("Product_Code Product_Name")
  .exec(function(err, product) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (product) {
      res.send(product);
    } else {
      res.send("not Product");
    }
  });
},

getProductCategoriedProducts:function(req,res){
  Product.find({Product_ProductCategory_Code :{$in: req.body.Category_ID}})
  .select("Product_Code Product_Name")
  .exec(function(err, product) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (product) {
      res.send(product);
    } else {
      res.send("not Product");
    }
  });
},

getSellingAreasProducts :function(req,res){
  Product.find({ })
  .select("Product_Code Product_Name Product_SellingAreaNames")
  .exec(function(err, products) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (products) {
      let filteredProducts=[]  
      products.map(product=>{
        product.Product_SellingAreaNames.forEach(sellName=>{
          if(sellName.includes(req.body.SellingArea_Name)){
            filteredProducts.push(product)
          }
        })
      })
      res.send(filteredProducts);
    } else {
      res.send("not Product");
    }
  });
},

deleteProductCategoryID:function(req,res){
  Product.findOne({Product_Code :req.body.Product_Code}) 
    .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (product) {
          let obj=product.toObject()
          var index = obj.Product_Category_ID.indexOf(req.body.Category_ID);
          if (index !== -1) 
          obj.Product_Category_ID.splice(index, 1);
          console.log("obj",obj)
          Product.findOneAndUpdate({Product_Code:obj.Product_Code},{
            $set:{Product_Category_ID:obj.Product_Category_ID}
          },function(err,doc){
            if (err) {
              return res.send({
                message: err
              });
            } else if (doc) {
              return res.send({message:true})
            }else{
              return res.send({message:false})
            }
          })
        }
        else{
          return res.send({
            message: "no product exist wth product code provided in req.body"
          });
        }
      })
},

deleteProductProductCategoryID: function(req,res){
  Product.findOne({Product_Code :req.body.Product_Code}) 
    .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (product) {
          let obj=product.toObject()
          var index = obj.Product_ProductCategory_Code.indexOf(req.body.Category_ID);
          if (index !== -1) 
          obj.Product_ProductCategory_Code.splice(index, 1);
          console.log("obj",obj)
          Product.findOneAndUpdate({Product_Code:obj.Product_Code},{
            $set:{Product_ProductCategory_Code:obj.Product_ProductCategory_Code}
          },function(err,doc){
            if (err) {
              return res.send({
                message: err
              });
            } else if (doc) {
              return res.send({message:true})
            }else{
              return res.send({message:false})
            }
          })
        }
        else{
          return res.send({
            message: "no product exist wth product code provided in req.body"
          });
        }
      })
},

deleteProductSellingAreaCodeAndName: function(req,res){
  Product.findOne({Product_Code :req.body.Product_Code}) 
    .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (product) {
          let obj=product.toObject()
          var index = obj.Product_SellingAreaCodes.indexOf(req.body.SellingArea_Code);
          var index2 = obj.Product_SellingAreaNames.indexOf(req.body.SellingArea_Name);
          if (index !== -1) 
          obj.Product_SellingAreaCodes.splice(index, 1);
          if (index2 !== -1) 
          obj.Product_SellingAreaNames.splice(index2, 1);
          console.log("obj",obj)
          Product.findOneAndUpdate({Product_Code:obj.Product_Code},{
            $set:{
              Product_SellingAreaCodes:obj.Product_SellingAreaCodes,
              Product_SellingAreaNames:obj.Product_SellingAreaNames
            }
          },function(err,doc){
            if (err) {
              return res.send({
                message: err
              });
            } else if (doc) {
              return res.send({message:true})
            }else{
              return res.send({message:false})
            }
          })
        }
        else{
          return res.send({
            message: "no product exist wth Product code provided in req.body"
          });
        }
      })
},

editProductCategoryIDs:function(req,res){
  Product.find({Product_Code :{$in: req.body.Product_Codes}}) 
  .lean()
  .exec(function(err, products) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (products) {
        //we need to update property Product_Category_ID for each Product
        //we add req.body.Category_ID to that property only if it isnot included
        products.map(product=>{
          if(!product.Product_Category_ID.includes(req.body.Category_ID)){
            product.Product_Category_ID.push(req.body.Category_ID)
          }
        })
        console.log("products",products)
        saveAll(products)
        function saveAll(objects ){
          var count = 0;
          objects.forEach(function(obj){
            var newvalues = {
              $set: {
                Product_Category_ID: obj.Product_Category_ID,
              }
            }
            Product.findOneAndUpdate({Product_Code:obj.Product_Code},newvalues,function(err,doc){
              if (err) {
                return res.send({
                  message: err
                });
              } else if(doc){
                count++;
                if( count == objects.length ){
                   callback();
                }
              }else{
                return res.send({
                  message: false
                });
              }
            })
              
          });
        }
        function callback(){
          return res.send({
            message: true
          });
        }
      } else {
        res.send("not Product");
      }
    });
 },

 editProductProductCategoryIDs:function(req,res){
  Product.find({Product_Code :{$in: req.body.Product_Codes}}) 
  .lean()
  .exec(function(err, products) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (products) {
        //we need to update property Product_ProductCategory_Code for each Product
        //we add req.body.Category_ID to that property only if it isnot included
        products.map(product=>{
          if(!product.Product_ProductCategory_Code.includes(req.body.Category_ID)){
            product.Product_ProductCategory_Code.push(req.body.Category_ID)
          }
        })
        console.log("products",products)
        saveAll(products)
        function saveAll(objects ){
          var count = 0;
          objects.forEach(function(obj){
            var newvalues = {
              $set: {
                Product_ProductCategory_Code: obj.Product_ProductCategory_Code,
              }
            }
            Product.findOneAndUpdate({Product_Code:obj.Product_Code},newvalues,function(err,doc){
              if (err) {
                return res.send({
                  message: err
                });
              } else if(doc){
                count++;
                if( count == objects.length ){
                   callback();
                }
              }else{
                return res.send({
                  message: false
                });
              }
            })
              
          });
        }
        function callback(){
          return res.send({
            message: true
          });
        }
      } else {
        res.send("not Product");
      }
    });
 },

 editProductSellingAreaCodeAndName:function (req,res){
  Product.find({Product_Code :{$in: req.body.Product_Codes}}) 
  .lean()
  .exec(function(err, products) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (products) {
        //we need to update property Product_SellingAreaCodes and Product_SellingAreaNames  for each product
        //we add req.body.SellingArea_Code and SellingArea_Name to that properties only if it isnot included
        products.map(product=>{
          if(!product.Product_SellingAreaCodes)
          product.Product_SellingAreaCodes=[]
          if(!product.Product_SellingAreaNames)
          product.Product_SellingAreaNames=[]
          console.log("product.Product_SellingAreaNames",product.Product_SellingAreaNames)
          console.log("product.Product_SellingAreaCodes",product.Product_SellingAreaCodes)

          if(!product.Product_SellingAreaCodes.includes(req.body.SellingArea_Code)){
            product.Product_SellingAreaCodes.push(req.body.SellingArea_Code)
          }
          if(!product.Product_SellingAreaNames.includes(req.body.SellingArea_Name)){
            product.Product_SellingAreaNames.push(req.body.SellingArea_Name)
          }
          console.log("product.Product_SellingAreaNames",product.Product_SellingAreaNames)
          console.log("product.Product_SellingAreaCodes",product.Product_SellingAreaCodes)


        })
        saveAll(products)
        function saveAll(objects ){
          var count = 0;
          objects.forEach(function(obj){
            var newvalues = {
              $set: {
                Product_SellingAreaCodes: obj.Product_SellingAreaCodes,
                Product_SellingAreaNames :obj.Product_SellingAreaNames
              }
            }
            Product.findOneAndUpdate({Product_Code:obj.Product_Code},newvalues,function(err,doc){
              if (err) {
                return res.send({
                  message: err
                });
              } else if(doc){
                count++;
                if( count == objects.length ){
                   callback();
                }
              }else{
                return res.send({
                  message: false
                });
              }
            })
              
          });
        }
        function callback(){
          return res.send({
            message: true
          });
        }
      } else {
        res.send("not product");
      }
    });
 }


};



/*
<md-toolbar>
  <div class="md-toolbar-tools rxp-dialog-toolbar">
    <h3 class="center-text">Add New Entry</h3>
    <span flex></span>
    <md-button class="md-icon-button" ng-click="vm.CloseSendOrder()">
      <md-icon md-font-icon="zmdi zmdi-close"></md-icon>
    </md-button>
  </div>
</md-toolbar>
<md-content class="padded-content-page">
  <form name="vm.SendOrderForm" ng-submit=" vm.SubmitRequest()">
    <div layout="row" layout-fill>
      <div flex="50" flex-xs="100" layout="column" layout-padding>
        <md-input-container flex="100" class="md-block">
          <label translate="Select Entry date"></label>
          <md-datepicker
            ng-model="vm.SendOrder.CustomerOrder_Date"
            flex="100"
            flex-xs="100"
            md-placeholder="Select Entry date"
            class="rxp-normal-date-piker-width"
          >
          </md-datepicker>
        </md-input-container>
      </div>
      <!-- start select suppliers-->
      <div flex="50" flex-xs="100" layout="column" layout-padding>
        <md-input-container class="md-block md-icon-left rxp-supplier-chips" >
          <md-icon ng-click="vm.FilterSupplierByProduct()" md-font-icon="fa fa-truck md-raised rxp-supplier-filter-btt" class="chips-icon"></md-icon>
          <label class="rxp-supplier-chips-lable">Select Supplier</label>
          <md-chips ng-model="vm.selectedSuppliers" md-autocomplete-snap
                  md-transform-chip="vm.transformChip($chip)"
                  md-require-match="true" min-items="1"md-max-chips="1" ng-required="true">
              <md-autocomplete
                  md-selected-item="vm.selectedSupplierItem"
                  md-search-text="vm.searchSupplierText"
                  md-items="supplieritem in vm.querySuppliers(vm.searchSupplierText)"
                  md-item-text="supplieritem.Supplier_Name"
                  placeholder="Supplier">
                  <span md-highlight-text="vm.searchSupplierText">{{supplieritem.Supplier_Name}}</span>
              </md-autocomplete>
              <md-chip-template>
                  <span>
                  <strong>{{$chip.Supplier_Name}}</strong>
                  <em class="rxp-chip-subtitle">code: ({{$chip.Supplier_Code}})</em>
                  </span>
              </md-chip-template>
          </md-chips>
      </md-input-container>
      </div>
      <!-- end select suppliers-->
      <!-- start select products-->
      <div flex="50" flex-xs="100" layout="column" layout-padding>
        <md-input-container class="md-block md-icon-left rxp-supplier-chips" >
          <md-icon ng-click="vm.FilterSupplierByProduct()" md-font-icon="fa fa-truck md-raised rxp-supplier-filter-btt" class="chips-icon"></md-icon>
          <label class="rxp-supplier-chips-lable">Select Product</label>
          <md-chips ng-model="vm.selectedProducts" md-autocomplete-snap
                  md-transform-chip="vm.transformChip($chip)"
                  md-require-match="true" min-items="1" ng-required="true"
                  md-max-chips="1">
              <md-autocomplete
                  md-selected-item="vm.selectedProductItem"
                  md-search-text="vm.searchProductText"
                  md-items="productitem in vm.queryProducts(vm.searchProductText)"
                  md-item-text="productitem.Product_Name"
                  placeholder="Product">
                  <span md-highlight-text="vm.searchProductText">{{productitem.Product_Name}}</span>
              </md-autocomplete>
              <md-chip-template>
                  <span>
                  <strong>{{$chip.Product_Name}}</strong>
                  <em class="rxp-chip-subtitle">code: ({{$chip.Product_Code}})</em>
                  </span>
              </md-chip-template>
          </md-chips>
      </md-input-container>
      </div>
      <!-- end select products-->
    </div>
    <div layout="row" layout-xs="column">
      <div  flex="45" flex-xs="100" layout="column">
          <md-input-container class="md-block">
              <label>Manufacturer</label>
              <md-icon md-font-icon="zmdi zmdi-account"></md-icon>
              <input type="text" ng-model="vm.Product_Name" required>
          </md-input-container>
          <md-input-container class="md-block">
            <label>Patch Number</label>
            <md-icon md-font-icon="zmdi zmdi-account"></md-icon>
            <input type="text" ng-model="vm.ProductData.Product_Chemical_Name">
        </md-input-container>
        <md-input-container class="rxp-full-width" style="margin-top: 2em;padding: 0">
          <md-datepicker
            ng-model="vm.SendOrder.CustomerOrder_Date"
            md-placeholder="Select Expiration date"
            class="rxp-normal-date-piker-width"
          >
          </md-datepicker>
      </md-input-container>
          <md-input-container
          md-no-float
          class="md-block hcm-Amount-number-field"
        >
          <label>Weight Of Package</label>
          <md-icon md-font-icon="fa fa-list-ol"></md-icon>
          <input type="number" step="0.01" ng-model="vm.SendOrder_Amount" />
        </md-input-container>
      </div>
      <div  flex="10" flex-xs="100" layout="column">
      </div>
      <div  flex="45" flex-xs="100" layout="column">
          <md-input-container class="rxp-full-width"">
              <md-icon md-font-icon="zmdi zmdi-flag"></md-icon>
              <label class="rxp-margin-left-med">Country Of Origin</label>
              <md-select placeholder="Country Of Origin" ng-model="vm.ProductData.Product_Origin_Country_Code" ng-change="vm.updateProductSuffix()">
                  <md-select-header>
                      <span class="rxp-margin-left-med rxp-disabled-lable rxp-inselect-lable">Countries List</span>
                  </md-select-header>
                  <md-option ng-repeat="x in vm.countries" value="{{x.Country_Code}}">
                      {{x.Country_Name}}
                  </md-option>
              </md-select>
          </md-input-container>
          <md-input-container class="rxp-full-width" style="margin-top: 3em;">
              <md-datepicker
                ng-model="vm.SendOrder.CustomerOrder_Date"
                md-placeholder="Select Production date"
                class="rxp-normal-date-piker-width"
              >
              </md-datepicker>
          </md-input-container>
          <md-input-container class="rxp-full-width"">
            <md-icon
            md-font-icon="fa fa-balance-scale"
            class="chips-icon"
          ></md-icon>
          <label>Select Unit</label>
          <md-select placeholder="Select Unit" ng-model="vm.SendOrder_Units">
            <md-option
              ng-repeat="RequestWeight in vm.WeightUnitsList"
              ng-value="{{RequestWeight}}"
            >
              {{RequestWeight.Weight_Name}}
            </md-option>
          </md-select>
          </md-input-container>
          
          <md-input-container class="md-block">
              <label>Description</label>
              <md-icon md-font-icon="zmdi zmdi-account"></md-icon>
              <input type="text" ng-model="vm.ProductData.Product_Description" >
          </md-input-container>
          <md-input-container class="md-block">
              <label>Assay</label>
              <md-icon md-font-icon="zmdi zmdi-account"></md-icon>
              <input type="text" ng-model="vm.ProductData.Product_Assay" >
          </md-input-container>
      </div>
  </div>

   <!--- <md-subheader class="md-no-sticky">Products</md-subheader>
    <md-divider></md-divider>

    <div
      layout="row"
      class="rxp-margin-top-medium hcm-contact-add-form"
      layout-xs="column"
    >
      <div
        flex="5"
        class="rxp-icon-container"
        flex-xs="100"
        layout="column"
        layout-padding
      >
        <md-icon md-font-icon="fa fa-dropbox"></md-icon>
      </div>
      <div flex="30" flex-xs="100" layout="column" class="">
        <md-autocomplete
          class="hcm-select-product-name-field"
          md-items="productitem in vm.searchForproduct(vm.productsearchText)"
          md-search-text="vm.productsearchText"
          md-item-text="productitem.Product_Name"
          md-selected-item="vm.selectedProduct"
          md-no-cache="false"
          md-floating-label="Enter Product Name"
        >
          <md-item-template>
            <span md-highlight-text="vm.productsearchText"
              >{{productitem.Product_Name || vm.productsearchText  }}Code:{{ productitem.Product_Code }}</span
            >
          </md-item-template>
          <md-not-found>
            No Product matching "{{vm.productsearchText}}" were found.
          </md-not-found>
        </md-autocomplete>
      </div>
      <div flex="5" flex-xs="100" layout="column" class=""></div>
      <div flex="25" flex-xs="100" layout="column" class="">
        <md-input-container
          md-no-float
          class="md-block hcm-Amount-number-field"
        >
          <label>Amount</label>
          <md-icon md-font-icon="fa fa-list-ol"></md-icon>
          <input type="number" step="0.01" ng-model="vm.SendOrder_Amount" />
        </md-input-container>
      </div>
      <div flex="5" flex-xs="100" layout="column" class=""></div>
      <div flex="30" flex-xs="100" layout="column" class="">
        <md-input-container class="md-block hcm-weight-name-field">
          <md-icon
            md-font-icon="fa fa-balance-scale"
            class="chips-icon"
          ></md-icon>
          <label>Select Unit</label>
          <md-select placeholder="Select Unit" ng-model="vm.SendOrder_Units">
            <md-option
              ng-repeat="RequestWeight in vm.WeightUnitsList"
              ng-value="{{RequestWeight}}"
            >
              {{RequestWeight.Weight_Name}}
            </md-option>
          </md-select>
        </md-input-container>
      </div>
      <div flex="25" flex-xs="100" layout="column" class="">
        <md-input-container
          md-no-float
          class="md-block hcm-Amount-number-field"
        >
          <label>Note</label>
          <md-icon md-font-icon="fa fa-list-ol"></md-icon>
          <input type="text" ng-model="vm.Order_Note" />
        </md-input-container>
      </div>

      <div
        flex="15"
        flex-xs="100"
        layout="column"
        layout-align="end end"
        class="hcm-add-product-btt-container"
      >
        <md-button
          ng-click="vm.AddproductOrder()"
          class="md-primary md-raised"
          md-ripple-size="auto"
          aria-label="Submit"
        >
          <md-icon md-font-icon="zmdi zmdi-account-add"></md-icon>
          <label class="rxp-margin-left-med rxp-margin-right-med">Add</label>
        </md-button>
      </div>
    </div>
    <md-divider class="rxp-margin-top-larg"></md-divider>
    <div
      layout="row"
      layout-xs="column"
      class="hcm-contact-grid-header jsgrid-header-row"
    >
      <div
        class="jsgrid-header-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        Product :
      </div>
      <div
        class="jsgrid-header-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        Amount :
      </div>
      <div
        class="jsgrid-header-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        Unit
      </div>
      <div
        class="jsgrid-header-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        Note
      </div>
    </div>
    <md-divider></md-divider>

    <div
      layout="row"
      layout-xs="column"
      class="jsgrid-row"
      ng-repeat="productOrder in vm.productOrders"
    >
      <div
        class="jsgrid-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        {{productOrder.Product_Name}}
      </div>
      <div
        class="jsgrid-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        {{productOrder.SendOrder_Amount}}
      </div>
      <div
        class="jsgrid-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        {{productOrder.Weight_Name}}
      </div>
      <div
        class="jsgrid-cell"
        flex="20"
        flex-xs="50"
        layout="column"
        layout-align="center start"
      >
        {{productOrder.Order_Note}}
      </div>
      <div class="jsgrid-cell" flex="20" flex-xs="50" layout="column">
        <md-button
          ng-click="vm.DeleteRequest(productOrder)"
          class="md-default hcm-ingrid-delete-btt"
          md-ripple-size="auto"
          aria-label="Delete Contact"
        >
          <md-icon md-font-icon="zmdi zmdi-delete"></md-icon>
        </md-button>
      </div>
    </div>!-->
    <md-divider class="rxp-field-divider"></md-divider>
    <md-dialog-actions layout="row">
      <div flex="100" flex-xs="100" layout="row" layout-xs="column">
        <div
          flex="50"
          flex-xs="100"
          layout="column"
          layout-align="center center"
        >
          <md-button
            ng-click="vm.CloseSendOrder()"
            class="md-default md-raised"
            md-ripple-size="auto"
            aria-label="Close Contact Form"
          >
            <md-icon md-font-icon="fa fa-times"></md-icon>
            <label class="rxp-margin-left-med rxp-margin-right-med"
              >close</label
            >
          </md-button>
        </div>
        <div
          flex="50"
          flex-xs="100"
          layout="column"
          layout-align="center center"
        >
          <md-button
            type="submit"
            class="md-primary md-raised"
            md-ripple-size="auto"
            aria-label="Submit"
          >
            <md-icon md-font-icon="zmdi zmdi-email"></md-icon>
            <label translate="Send Order"></label>
          </md-button>
        </div>
      </div>
    </md-dialog-actions>
  </form>
</md-content>

*/



















/**
  
(function() {
  "use strict";

  angular
    .module("stores")
    .controller("AddStoreProductController", AddStoreProductController);

  /* @ngInject 
  function AddStoreProductController(
    $mdToast,
    $mdDialog,
    triLoaderService,
    $http,
    UserService
  ) {
    var vm = this;
    vm.logedUser = UserService.getCurrentUser();
    vm.SendOrder = {};
    $http.get("http://35.246.143.96:3111/getAllSupplier").then(function (response) {			   
      vm.selectedSupplierItem = null;
      vm.searchSupplierText = null;
      vm.querySuppliers = querySuppliers;
      vm.Suppliers = response.data;
      vm.Supplierslist = response.data;
      vm.selectedSuppliers = [];
      vm.transformChip = transformChip;   
      function querySuppliers($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Suppliers.filter(function(supplier) {
              var lowercaseName = angular.lowercase(supplier.Supplier_Name);
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return supplier;
              }
          });
      }
      ///console.log(vm.selectedSuppliers);
  });
  $http.get("http://35.246.143.96:3111/getProducts").then(function (response) {			   
      vm.selectedProductItem = null;
      vm.searchProductText = null;
      vm.queryProducts = queryProducts;
      vm.Products = response.data;
      vm.Productslist = response.data;
      vm.selectedProducts = [];
      vm.transformChip = transformChip;   
      function queryProducts($query) {
          var lowercaseQuery = angular.lowercase($query);
          return vm.Products.filter(function(product) {
              var lowercaseName = angular.lowercase(product.Product_Name);
              if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
                  return product;
              }
          });
      }
      ///console.log(vm.selectedSuppliers);
  });

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        return chip;
      } else {
        return null;
      }
    }

    $http({
      method: "get",
      url: "http://35.246.143.96:3111/getProducts",
      data: {}
    }).then(function(data) {
      vm.Productslist = data.data;
    });

    $http.get("http://35.246.143.96:3111/getWeight").then(function(data) {
      vm.WeightUnitsList = data.data;
    });

    vm.productOrders = [];
    vm.productOrder = [];
    vm.AddproductOrder = function() {
      console.log("vm.productsearchText", vm.productsearchText);
      if (
        !vm.productsearchText ||
        vm.SendOrder_Amount == undefined ||
        vm.SendOrder_Amount == "" ||
        vm.SendOrder_Units == undefined ||
        vm.SendOrder_Units == "" ||
        vm.Order_Note == undefined ||
        vm.Order_Note == ""
      ) {
        showAddErrorToast("You must Fill all product data", $mdToast);
      } else {
        console.log("vm.selectedProduct", vm.selectedProduct);
        console.log("vm.SendOrder_Units", vm.SendOrder_Units);
        var Order_Product;
        var Product_Name;
        var Product_ID;
        if (vm.selectedProduct) {
          Order_Product = vm.selectedProduct._id;
          Product_Name = vm.selectedProduct.Product_Name;
          Product_ID = vm.selectedProduct.Product_Code;
        } else {
          Order_Product = null;
          Product_Name = vm.productsearchText;
          Product_ID = null;
        }

        var productOrder = {
          Order_Product: Order_Product,
          Product_Name: Product_Name,
          Product_ID: Product_ID,
          Order_RequestedQuantity: vm.SendOrder_Amount,
          SendOrder_Amount: vm.SendOrder_Amount,
          Weight_Name: vm.SendOrder_Units.Weight_Name,
          Quantity_Required: vm.SendOrder_Amount,
          Weight_ID: vm.SendOrder_Units.Weight_Code,
          Order_RequestedQuantityWeightUnit: vm.SendOrder_Units._id,
          Order_Note: vm.Order_Note
        };

        vm.productOrders.push(productOrder);
        console.log(productOrder);

        vm.selectedProduct = null;
        vm.SendOrder_Amount = "";
        vm.SendOrder_Units = "";
        vm.Order_Note = "";
      }
    };

    vm.FilterCustomerByProduct = function() {
      $mdDialog
        .show({
          multiple: true,
          skipHide: true,
          controller: "GetCustomersByProductController",
          controllerAs: "vmr",
          templateUrl:
            "app/send-offer/add-send-offer/get-customer-by-product.tmpl.html",
          clickOutsideToClose: true,
          focusOnOpen: false,
          locals: {
            productlist: vm.Productslist
          }
          //targetEvent: $event,
          // onRemoving: function (event, removePromise) {
          //     vm.RequestGrid.innerHTML = "";
          // }
        })
        .then(
          function(listOfSelectedCustomers) {
            console.log(listOfSelectedCustomers);
            console.log(vm.selectedCustomers);

            vm.selectedCustomers = listOfSelectedCustomers;
            console.log(vm.selectedCustomers);
          },
          function() {
            console.log("You cancelled the dialog.");
          }
        );
    };

    vm.DeleteRequest = function(productOrder) {
      console.log("productOrder", productOrder);
      vm.productOrders.splice(vm.productOrders.indexOf(productOrder), 1);
      console.log("after delete productOrders", vm.productOrders);
    };

    vm.searchForCustomer = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      var results = vm.Customerslist.filter(function(customer) {
        var lowercaseName = angular.lowercase(customer.Customer_Name);
        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
          return customer;
        }
      });
      return results;
    };

    vm.searchForproduct = function(query) {
      var lowercaseQuery = angular.lowercase(query);
      var results = vm.Productslist.filter(function(product) {
        var lowercaseName = angular.lowercase(product.Product_Name);
        if (lowercaseName.indexOf(lowercaseQuery) !== -1) {
          return product;
        }
      });
      return results;
    };

    vm.CloseSendOrder = function() {
      $mdDialog.hide();
    };
    vm.SubmitRequest = function() {
      triLoaderService.setLoaderActive(true);
      var CustomerOrder_Products = [];
      angular.forEach(vm.productOrders, function(element, key) {
        console.log("e", element, "key", key);
        CustomerOrder_Products.push({
          Order_Product_Name: element.Product_Name,
          Order_Product: element.Order_Product,
          Order_RequestedQuantity: element.Order_RequestedQuantity,
          Order_RequestedQuantityWeightUnit:
            element.Order_RequestedQuantityWeightUnit,
          Order_Note: element.Order_Note
        });
      });

      console.log("vm.productOrders", vm.productOrders);
      console.log("vm.selectedCustomers", vm.selectedCustomers);

      vm.SendOrder.CustomerOrder_Customer = vm.selectedCustomers[0]["_id"];
      vm.SendOrder.CustomerOrder_CreatedByUser = vm.logedUser.mongoID;
      vm.SendOrder.CustomerOrder_Status = 1;
      vm.SendOrder.CustomerOrder_Products = CustomerOrder_Products;
      console.log("vm.SendOrder", vm.SendOrder);

      $http({
        method: "POST",
        url: "http://35.246.143.96:3111/addCustomerOrder",
        data: { order: vm.SendOrder }
      }).then(function(data) {
        vm.productOrders = [];
        vm.productOrder = [];
        vm.selectedCustomer = null;
        vm.selectedCustomers = {};
        showAddToast("Request Order Added Successfully", $mdToast);
        triLoaderService.setLoaderActive(false);
      });
    };
  }
})();


 */









/*

vm.interval = setInterval(function(){
  vm.StartProcessData(false);
}, 120000);

vm.StartProcessData = function(isFinalSave){
  if(isFinalSave){
      triLoaderService.setLoaderActive(true);
  }
  if(vm.AddProductForm.$valid){
      vm.setCommonData(isFinalSave);
      if(!vm.ProductID){
          vm.setSaveIntialData();
          vm.GeneralSave(true, isFinalSave);
          console.log('data should be intial Save');
      }
      else{
          vm.setEditData();
          vm.GeneralSave(false, isFinalSave);
          console.log('data should be Edit Save');
      }
  }
  else{
      console.log('Form Not Valid'); 
      triLoaderService.setLoaderActive(false);
  }
}

vm.setCommonData = function(isFinalSave){
  if(!isFinalSave){
      vm.ProductNameCopy = vm.Product_Name;
      vm.ProductData.Product_Name = vm.ProductNameCopy + ' (auto save)';
  }
  else{
      vm.ProductData.Product_Name = vm.Product_Name;
  }
  vm.ProductData.Product_Category_ID = [];
  vm.selectedCat.forEach(function(element){vm.ProductData.Product_Category_ID.push(element.Category_ID) })
  vm.ProductData.Product_ProductCategory_Code = [];
  vm.selectedProductCategories.forEach(function(element){vm.ProductData.Product_ProductCategory_Code.push(element.ProductCategory_Code) })
  vm.ProductData.Product_Certification = [];
  vm.selectedProductCertificates.forEach(function(element){vm.ProductData.Product_Certification.push(element.Certificate_Code)});
  vm.ProductData.Product_StorageType_Code = [];
  vm.selectedStorageConditions.forEach(function(element){vm.ProductData.Product_StorageType_Code.push(element.StorageType_Code)});
  
}
vm.setSaveIntialData = function(){
  vm.URLToPost = 'AddProduct';
}
vm.setEditData = function(){
  vm.ProductData.Product_IsActive = 1;
  vm.ProductData.Product_Code = vm.ProductID;
  vm.URLToPost = 'EditProduct';
}

$scope.$on('$destroy', function() {
  clearInterval(vm.interval);
});
vm.GeneralSave = function(isIntial, isFinalSave){
  vm.ProductData.Product_Manufacturer_Code = vm.selectedProduct_Manufacturer.Supplier_Code;
  vm.ProductData.User_Code = vm.logedUser.id;
  $http({
      method:"POST",
      url:"http://35.246.143.96:3111/" + vm.URLToPost,
      data : vm.ProductData
  }).then(function(data){
      if(data.data.message == true){
          //showAddToast('Product added successfully',$mdToast);
          if(isIntial){
              vm.ProductID = data.data.data.Product_Code;
          }
          if(isFinalSave){
              showAddToast('Product added successfully',$mdToast);
              $mdDialog.hide();
              triLoaderService.setLoaderActive(false);
          }
          else{
              showAutoSaveToast('Data Auto Saved ',$mdToast);
              //clearInterval(vm.interval);
          }
      }
      else{
          if(isFinalSave){
              showAddErrorToast('Erorr, please try again',$mdToast);
              triLoaderService.setLoaderActive(false);
          }
          else{
              showAutoSaveErrorToast('Auto Save Faild',$mdToast);
          }
      }
  });
}
// vm.AutoEditProduct = function(){
  
//     $http({
//         method:"POST",
//         url:"http://35.246.143.96:3111/EditProduct",
//         data : vm.ProductData
//     }).then(function(data){
//         showAddToast('Product saved successfully',$mdToast);
//         $mdDialog.hide();
//         triLoaderService.setLoaderActive(false);
//     });
// }

vm.SubmitData=function(form){
  vm.StartProcessData(true);
  // vm.InitialSave();
  // triLoaderService.setLoaderActive(true);
  // vm.ProductData.Product_Category_ID = [];
  // vm.selectedCat.forEach(function(element){vm.ProductData.Product_Category_ID.push(element.Category_ID) })
  // vm.ProductData.Product_ProductCategory_Code = [];
  // vm.selectedProductCategories.forEach(function(element){vm.ProductData.Product_ProductCategory_Code.push(element.ProductCategory_Code) })
  // vm.ProductData.Product_Certification = [];
  // vm.selectedProductCertificates.forEach(function(element){vm.ProductData.Product_Certification.push(element.Certificate_Code)});
  // vm.ProductData.Product_StorageType_Code = [];
  // if(vm.selectedStorageConditions)
  //     vm.selectedStorageConditions.forEach(function(element){vm.ProductData.Product_StorageType_Code.push(element.StorageType_Code)});
  // $http({
  //     method:"POST",
  //     url:"http://35.246.143.96:3111/AddProduct",
  //     data : vm.ProductData
  // }).then(function(data){
  //     if(data.data.message == true){
  //         showAddToast('Product added successfully',$mdToast);
  //         vm.ProductID = data.data.data.Product_Code;
  //         console.log(vm.ProductID);
  //         //$mdDialog.hide();
  //     }
  //     else{
  //         showAddErrorToast('Erorr, please try againn',$mdToast);
  //     }
      
  //     triLoaderService.setLoaderActive(false);
  // });
}
vm.CloseForm = function(){
  if(vm.AddProductForm.$dirty){
      ConfirmCloseDialog();
  }
  else{
      $mdDialog.hide();
  }
}
function ConfirmCloseDialog(){
  var Result;
  $mdDialog.show({
      multiple: true,skipHide: true,
      controllerAs:'confirmDialog',
      bindToController: true,
      controller: function($mdDialog){
          var vmc = this;
          vmc.closeform = function closeform(){
              $mdDialog.hide();
              Result =  true;
          }
          vmc.hide = function hide(){
              $mdDialog.hide();
              Result = false;
          }
        }
      ,template: GetConfirmCloseTemplate()
  }).then(function() {
      if(Result){
          $mdDialog.hide();
      }
  });
}
}*/
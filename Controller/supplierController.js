var Supplier = require("../Model/supplier");
var Category = require("../Model/category");
var Customer = require("../Model/customer");
var User = require("../Model/user");
var SupplierType = require("../Model/lut_supplier_types");
var SupplierClass = require("../Model/lut_classes");
var Country = require("../Model/countries");
var PaymentMethod = require("../Model/lut_payment_methods");
var WayOfDelivery = require("../Model/lut_ways_of_delivery");
var Document=require("../Model/document")
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
    cb(null, file.fieldname + "-" + datetimestamp + makeid(5)+ "." + arr[arr.length-1] );
    console.log("fieldname", file.fieldname);
  }
});
var upload = multer({
  //multer settings
  storage: storage,
}).any()


module.exports = {
  getSupplier: function(req, res) {
    Supplier.find({ Supplier_IsSupplier: 1, Supplier_IsActive: 1 })
      .select("Supplier_Code Supplier_Name Supplier_Email")
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },

  getManufacturer: function(req, res) {
    Supplier.find({ Supplier_IsManufacturer: 1 })
      .select("Supplier_Code Supplier_Name Supplier_Email")
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },
  //checked,history
  getSupplierHistory: function(request, res) {
    console.log("body", request.body);
    Supplier.find({ Supplier_Code: request.body.Supplier_Code })
      .select("history")
      .populate({ path: "history.HistoryCategory", select: "Category_Name" })
      .populate({ path: "history.Historyproductcategory", select: "ProductCategory_Name" })
      //HistorySupplierClass
      .populate({
        path: "history.HistorySupplierClass",
        select: "Class_Name"
      })
      .populate({
        path: "history.HistoryWayOfDeliver",
        select: "WayOfDelivary_Name"
      })
      .populate({
        path: "history.HistorySupplierType",
        select: "SupplierType_Name"
      })
      .populate({ path: "history.HistoryCustomerClass", select: "Class_Name" })
      .populate({
        path: "history.Historycountry",
        select: "Country_Name Country_Tcode"
      })
      .populate({
        path: "history.HistoryPaymentMethod",
        select: "PaymentMethod_Name"
      })
      .populate({
        path: "history.HistorySellingArea",
        select: "SellingArea_Name"
      })
      .populate({ path: "history.HistoryEditedUser", select: "User_Name" })
      .populate({ path: "history.HistoryCheckedUser", select: "User_Name" })

      .lean()
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err,
            proceed: false
          });
        } else if (supplier.length > 0) {
          console.log("supplier", supplier);
          res.send({
            history: supplier[0].history,
            proceed: true
          });
        } else {
          return res.send({
            message:
              "No Supplier exist with User_Code provided in request body!",
            proceed: false
          });
        }
      });
  },
  checkSupplier: function(request, res) {
    console.log("body", request.body);
    //we need to first: add existing supplier to history property of that supplier,
    //second:make property Supplier_IsChecked of that supplier to true
    Supplier.find({ Supplier_Code: request.body.Supplier_Code })
      .select(
        `Supplier_Name Supplier_Email Supplier_Password Supplier_Country_Code 
        Supplier_City Supplier_Address Supplier_StoreAddress Supplier_AddressGPSLocation 
        Supplier_StoreGPSLocation Supplier_Phone Supplier_Contact Supplier_LinkedTo_Customer_Code
        Supplier_FaceBook Supplier_PaymentMethod_Codes Supplier_WayOfDelivery_Codes
        Supplier_TimeOfDelivery Supplier_Agencies Supplier_Certificates Supplier_Category_IDs
        Supplier_ProductCategory_Code Supplier_SellingAreaCodes Supplier_SellingAreaNames Supplier_SupplierType_Codes Supplier_Class_Code Supplier_Rate Supplier_IsActive
        Supplier_IsSupplier Supplier_IsManufacturer Supplier_ExtraField1 Supplier_ExtraField2
        Supplier_ExtraField3 Supplier_ExtraField4 Supplier_ExtraField5 Supplier_EditedBy_User_Code Supplier_EditingTime
       `
      )
      .lean()
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier.length > 0) {
          let historyObject = supplier[0];
          historyObject["Supplier_CheckedBy_User_Code"] =
            request.body["User_Code"];
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
                historyObject["Supplier_CheckedDate"] = new Date();
                console.log("our history object is:", historyObject);
                var newvalues = {
                  $set: {
                    Supplier_IsChecked: true
                  },
                  $push: { history: historyObject }
                };
                console.log("historyObject", historyObject);
                var myquery = { Supplier_Code: request.body.Supplier_Code };
                Supplier.findOneAndUpdate(myquery, newvalues, function(
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
                      message: "Supplier not exists"
                    });
                  } else {
                    return res.send({
                      message: true
                    });
                  }
                });
              } else {
                res.send("not Supplier");
              }
            });
        }
      });
  },
  declineSupplier: function(req, res) {
    var updated={
      $set:{
        Supplier_IsChecked: false,
        Decline_Comment: req.body.Decline_Comment,
        Supplier_DeclinedBy_User_Code :req.body.User_Code
      }
    };
    Supplier.findOneAndUpdate({ Supplier_Code: req.body.Supplier_Code },updated,function(err, Supplier) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (Supplier ) {
        res.send({message:true})
      }
      else{
        res.send({message:"Supplier is null"})
      }
    })
  },

  getDeclinedSupplierComment: function(req, res) {
    console.log("dd")
    Supplier.findOne({ Supplier_Code: req.body.Supplier_Code })
    .select('Decline_Comment Supplier_DeclinedBy_User_Code')
    .populate({path:"DeclinedUser"})
    .exec(function(err, Supplier) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (Supplier ) {
        res.send(Supplier)
      }
      else{
        res.send({message:"Supplier is null"})
      }
    })
  },
  getAllSupplierByUserCode: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Suppliers != 1) {
          console.log("user have  no access for all suppliers");
          filterObject = {
            Supplier_Code: { $in: user[0].User_Allowed_Suppliers }
          };
          console.log(filterObject);
        }
        if (request.body.letter && request.body.letter != "") {
          filterObject["Supplier_Name"] = { $regex: `^${request.body.letter}` }; //`/^B/`;
        }
        console.log("filter object is::", filterObject);
        Supplier.find(filterObject)
          .select(
            `Supplier_Code Supplier_Name Supplier_IsSupplier Supplier_IsManufacturer Supplier_IsActive Supplier_Class_Code 
            Supplier_Country_Code Supplier_Category_IDs Supplier_ProductCategory_Code Supplier_SellingAreaCodes Supplier_SellingAreaNames Supplier_Email Supplier_LinkedTo_Customer_Code Supplier_IsChecked`
          )
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })

          // .populate({ path: 'SupplierType', select: 'SupplierType_Name' })
          .populate({ path: "supplierclass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          // .populate({ path: 'PaymentMethod', select: 'PaymentMethod_Name' })
          // .populate({ path: 'WayOfDelivery', select: 'WayOfDelivary_Name' })
          .lean()
          .sort({ Supplier_Code: -1 })
          .limit(200)
          .exec(function(err, supplier) {
            
            if (err) {
              return res.send({
                message: err
              });
            } else if (supplier) {
              res.send(supplier);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send("No user with this provided User Code in request body");
      }
    });
  },

  ASCOrdergetAllSupplierByUserCode:function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Suppliers != 1) {
          console.log("user have  no access for all suppliers");
          filterObject = {
            Supplier_Code: { $in: user[0].User_Allowed_Suppliers }
          };
          console.log(filterObject);
        }
        
        console.log("filter object is::", filterObject);
        Supplier.find(filterObject,null,{sort:{Supplier_Code:1}})
          .select(
            `Supplier_Code Supplier_Name Supplier_IsSupplier Supplier_IsManufacturer Supplier_IsActive Supplier_Class_Code 
            Supplier_Country_Code Supplier_Category_IDs Supplier_ProductCategory_Code Supplier_SellingAreaCodes Supplier_SellingAreaNames Supplier_Email Supplier_LinkedTo_Customer_Code Supplier_IsChecked`
          )
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })

          // .populate({ path: 'SupplierType', select: 'SupplierType_Name' })
          .populate({ path: "supplierclass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          // .populate({ path: 'PaymentMethod', select: 'PaymentMethod_Name' })
          // .populate({ path: 'WayOfDelivery', select: 'WayOfDelivary_Name' })
          .lean()
          .exec(function(err, supplier) {
            
            if (err) {
              return res.send({
                message: err
              });
            } else if (supplier) {
              res.send(supplier);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send("No user with this provided User Code in request body");
      }
    });
  },

  DESCOrdergetAllSupplierByUserCode:function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Suppliers != 1) {
          console.log("user have  no access for all suppliers");
          filterObject = {
            Supplier_Code: { $in: user[0].User_Allowed_Suppliers }
          };
          console.log(filterObject);
        }
        
        console.log("filter object is::", filterObject);
        Supplier.find(filterObject,null,{sort:{Supplier_Code:-1}})
          .select(
            `Supplier_Code Supplier_Name Supplier_IsSupplier Supplier_IsManufacturer Supplier_IsActive Supplier_Class_Code 
            Supplier_Country_Code Supplier_Category_IDs Supplier_ProductCategory_Code Supplier_SellingAreaCodes Supplier_SellingAreaNames Supplier_Email Supplier_LinkedTo_Customer_Code Supplier_IsChecked`
          )
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })

          // .populate({ path: 'SupplierType', select: 'SupplierType_Name' })
          .populate({ path: "supplierclass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          // .populate({ path: 'PaymentMethod', select: 'PaymentMethod_Name' })
          // .populate({ path: 'WayOfDelivery', select: 'WayOfDelivary_Name' })
          .lean()
          .exec(function(err, supplier) {
            
            if (err) {
              return res.send({
                message: err
              });
            } else if (supplier) {
              res.send(supplier);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send("No user with this provided User Code in request body");
      }
    });
  },

  getAllSuppliers: function(req, res) {
    Supplier.find({})
      .select(
        "Supplier_Code Supplier_Name Supplier_IsSupplier Supplier_IsManufacturer Supplier_IsActive Supplier_Class_Code Supplier_Country_Code Supplier_Category_IDs Supplier_Email Supplier_LinkedTo_Customer_Code"
      )
      .populate({ path: "Category", select: "Category_Name" })
      .populate({ path: "productcategory", select: "ProductCategory_Name" })
      .populate({ path: "sellingArea", select: "SellingArea_Name" })

      // .populate({ path: 'SupplierType', select: 'SupplierType_Name' })
      .populate({ path: "supplierclass", select: "Class_Name" })
      .populate({ path: "country", select: "Country_Name Country_Tcode" })
      // .populate({ path: 'PaymentMethod', select: 'PaymentMethod_Name' })
      // .populate({ path: 'WayOfDelivery', select: 'WayOfDelivary_Name' })
      .lean()
      .sort({ Supplier_Code: -1 })
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },
  getupplierContactsByID: function(req, res) {
    Supplier.find({ Supplier_Code: req.body.Supplier_Code })
      .select("Supplier_Contact")
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },
  checkSupplierByEmail: function(req, res) {
    Supplier.find({ Supplier_Email: req.body.Supplier_Email })
      .select("Supplier_Code")
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },
  checkSupplierByEmailAndID: function(req, res) {
    Supplier.find({
      Supplier_Email: req.body.Supplier_Email,
      Supplier_Code: { $ne: req.body.Supplier_Code }
    })
      .select("Supplier_Code")
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },
  getSupplierById: function(req, res) {
    Supplier.find({ Supplier_Code: Number(req.body.Supplier_Code) })
      .populate({ path: "Category", select: "Category_Name" })
      .populate({ path: "productcategory", select: "ProductCategory_Name" })
      .populate({ path: "sellingArea", select: "SellingArea_Name" })
      .populate({ path: "SupplierType", select: "SupplierType_Name" })
      .populate({ path: "supplierclass", select: "Class_Name" })
      .populate({ path: "country", select: "Country_Name Country_Tcode" })
      .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
      .populate({ path: "WayOfDelivery", select: "WayOfDelivary_Name" })
      .lean()
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },

  searchSupplier: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user.length > 0) {
         //note :Whatever the type of the search, the searched word will always be
        //in req.body.Supplier_Name
        var object = {};
        if (request.body.type == "supplier")
          object = {
            Supplier_Name: {
              $regex: new RegExp(".*" + request.body.Supplier_Name + ".*", "i")
            },
            Supplier_IsSupplier: 1
          };
        else if(request.body.type == "Manufacturer")
          object = {
            Supplier_Name: {
              $regex: new RegExp(".*" + request.body.Supplier_Name + ".*", "i")
            },
            Supplier_IsManufacturer: 1
          };
          else if(request.body.type == "Supplier Code")
          object = {
            Supplier_Code:  request.body.Supplier_Name 
          };
        //get only allowed suppliers user can access
        if (user[0].User_Access_All_Suppliers == 0) {
          object["Supplier_Code"] = { $in: user[0].User_Allowed_Suppliers };
        }

        Supplier.find(object)
          .select(
            "Supplier_Code Supplier_Name Supplier_IsSupplier Supplier_IsManufacturer Supplier_IsActive Supplier_Class_Code Supplier_Country_Code Supplier_Category_IDs Supplier_ProductCategory_Code Supplier_IsChecked"
          )
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })
          .populate({ path: "supplierclass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          .sort({ Supplier_Code: -1 })
          .exec(function(err, supplier) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (supplier) {
              res.send(supplier);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send("No user with User_Code provided in request body");
      }
    });
  },
  getUnlinkedSuppliers: function(request, res) {
    Supplier.find({ Supplier_LinkedTo_Customer_Code: null })
      .select("Supplier_Code Supplier_Name")
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          res.send(supplier);
        } else {
          res.send("No Supplier Found");
        }
      });
  },
  //============
  CopySupplierIntoCustomer: function(request, res) {
    Supplier.find({ Supplier_Code: request.body.Supplier_Code }).exec(function(
      err,
      supplier
    ) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (
        supplier.length > 0 &&
        !supplier[0].Supplier_LinkedTo_Customer_Code
      ) {
        console.log(supplier);
        console.log("Supplier Data");
        checkForCustomer(supplier[0]);
      } else {
        res.send("Customer Already Linked To Supplier");
      }
    });
    function checkForCustomer(supplier) {
      //{ $or: [{a: 1}, {b: 1}] }
      Customer.find({
        $or: [
          { Customer_Email: supplier.Supplier_Email },
          { Customer_Name: supplier.Supplier_Name },
          { Customer_LinkedTo_Supplier_Code: supplier.Supplier_Code }
        ]
      }).exec(function(err, customer) {
        if (err) {
          console.log("error to find customer");
          return res.send({
            message: err
          });
        } else if (customer.length > 0) {
          console.log(customer);
          console.log("customer Is Already Exist");
          res.send("Customer Is Already Exist");
        } else {
          console.log("supplier Is Ready To Insert");
          getNextSupplierCode(supplier);
        }
      });
    }
    function getNextSupplierCode(supplier) {
      Customer.getLastCode(function(err, customer) {
        if (customer) InsertIntoCustomer(customer.Customer_Code + 1, supplier);
        else InsertIntoCustomer(1, supplier);
      });
    }
    function InsertIntoCustomer(NextCode, supplier) {
      var CustomerContact = [];
      supplier.Supplier_Contact.forEach(function(item, index) {
        var customerContactObj = {};
        customerContactObj.Customer_ContactTitle = item.Supplier_ContactTitle;
        customerContactObj.Customer_ContactName = item.Supplier_ContactName;
        customerContactObj.Customer_ContactTelphone =
          item.Supplier_ContactTelphone;
        customerContactObj.Customer_ContactEmail = item.Supplier_ContactEmail;
        CustomerContact.push(customerContactObj);
      });
      
      var newCustomer = new Customer();
      newCustomer.Customer_Code = NextCode;
      newCustomer.Customer_Name = supplier.Supplier_Name;
      newCustomer.Customer_Email = supplier.Supplier_Email;
      newCustomer.Customer_Country_Code = supplier.Supplier_Country_Code;
      newCustomer.Customer_City = supplier.Supplier_City;
      newCustomer.Customer_Address = supplier.Supplier_Address;
      newCustomer.Customer_Phone = supplier.Supplier_Phone;
      newCustomer.Customer_Contact = CustomerContact;
      newCustomer.Customer_LinkedTo_Supplier_Code = supplier.Supplier_Code;
      newCustomer.Customer_FaceBook = supplier.Supplier_FaceBook;
      newCustomer.Customer_PaymentMethod_Codes = supplier.Supplier_PaymentMethod_Codes;
      newCustomer.Customer_Agencies = supplier.Supplier_Agencies;
      newCustomer.Customer_Certificates = supplier.Supplier_Certificates;
      newCustomer.Customer_StoreAddress = supplier.Supplier_StoreAddress;
      newCustomer.Customer_WayOfDelivery_Codes = supplier.Supplier_WayOfDelivery_Codes;
      newCustomer.Customer_AddressGPSLocation = supplier.Supplier_AddressGPSLocation;
      newCustomer.Customer_StoreGPSLocation = supplier.Supplier_StoreGPSLocation;
      newCustomer.Customer_Category_IDs = supplier.Supplier_Category_IDs;
            //Product category newly added /////////////////////////
            newCustomer.Customer_ProductCategory_Code=supplier.Supplier_ProductCategory_Code;
            //selling areas newly added /////////////////////////
            newCustomer.Customer_SellingAreaCodes=supplier.Supplier_SellingAreaCodes;
            newCustomer.Customer_SellingAreaNames=supplier.Supplier_SellingAreaNames;

      newCustomer.Customer_SupplierType_Codes = supplier.Supplier_SupplierType_Codes;
      newCustomer.Customer_Rate = supplier.Supplier_Rate;
      newCustomer.Customer_Class_Code = supplier.Supplier_Class_Code;
      newCustomer.Customer_IsActive = 1;
      newCustomer.Customer_ExtraField1 = supplier.Supplier_ExtraField1;
      newCustomer.Customer_ExtraField2 = supplier.Supplier_ExtraField2;
      newCustomer.Customer_ExtraField3 = supplier.Supplier_ExtraField3;
      newCustomer.Customer_ExtraField4 = supplier.Supplier_ExtraField4;
      newCustomer.Customer_ExtraField5 = supplier.Supplier_ExtraField5;
      newCustomer.Customer_EditedBy_User_Code = request.body.User_Code;
      newCustomer.Customer_EditingTime = new Date();
      newCustomer.save(function(error, doneadd) {
        if (error) {
          console.log(error);
          return res.send({
            message: error
          });
        } else {
          linkSupplierWithCustomerID(supplier.Supplier_Code, NextCode);
        }
      });
    }
    function linkSupplierWithCustomerID(Supplier_Code, Customer_Code) {
      var newvalues = {
        $set: {
          Supplier_LinkedTo_Customer_Code: Customer_Code
        }
      };
      var myquery = { Supplier_Code: Supplier_Code };
      Supplier.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Supplier not exists"
          });
        } else {
          return res.send({
            message: true
          });
        }
      });
    }
  },
  //========
  addSupplier: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          porceed: false,
          message: err
        });
      } else if (user.length > 0) {
        Supplier.getLastCode(function(err, supplier) {
          if (supplier) InsertIntoSupplier(supplier.Supplier_Code + 1, user[0]);
          else InsertIntoSupplier(1, user[0]);
        });
      } else {
        res.send({
          porceed: false,
          message: "No user exist with User_Code provided in request body"
        });
      }
    });

    function InsertIntoSupplier(NextCode, user) {
      var newSupplier = new Supplier();
      newSupplier.Supplier_Code = NextCode;
      newSupplier.Supplier_Name = request.body.Supplier_Name;
      newSupplier.Supplier_Email = request.body.Supplier_Email;
      newSupplier.Supplier_Country_Code = request.body.Supplier_Country_Code;
      newSupplier.Supplier_City = request.body.Supplier_City;
      newSupplier.Supplier_Address = request.body.Supplier_Address;
      newSupplier.Supplier_Phone = request.body.Supplier_Phone;
      newSupplier.Supplier_FaceBook = request.body.Supplier_FaceBook;
      newSupplier.Supplier_PaymentMethod_Codes =
        request.body.Supplier_PaymentMethod_Codes;
      newSupplier.Supplier_TimeOfDelivery =
        request.body.Supplier_TimeOfDelivery;
      newSupplier.Supplier_Agencies = request.body.Supplier_Agencies;
      newSupplier.Supplier_Certificates = request.body.Supplier_Certificates;
      newSupplier.Supplier_StoreAddress = request.body.Supplier_StoreAddress;
      newSupplier.Supplier_WayOfDelivery_Codes =
        request.body.Supplier_WayOfDelivery_Codes;
      newSupplier.Supplier_AddressGPSLocation =
        request.body.Supplier_AddressGPSLocation;
      newSupplier.Supplier_StoreGPSLocation =
        request.body.Supplier_StoreGPSLocation;
      newSupplier.Supplier_Category_IDs = request.body.Supplier_Category_IDs;
      //Product category newly added /////////////////////////
      newSupplier.Supplier_ProductCategory_Code=request.body.Supplier_ProductCategory_Code;
      //selling areas newly added /////////////////////////
      newSupplier.Supplier_SellingAreaCodes=request.body.Supplier_SellingAreaCodes;
      newSupplier.Supplier_SellingAreaNames=request.body.Supplier_SellingAreaNames;

      newSupplier.Supplier_SupplierType_Codes =
        request.body.Supplier_SupplierType_Codes;
      newSupplier.Supplier_Rate = request.body.Supplier_Rate;
      newSupplier.Supplier_Class_Code = request.body.Supplier_Class_Code;
      newSupplier.Supplier_IsActive = 1;
      newSupplier.Supplier_IsSupplier = request.body.Supplier_IsSupplier;
      newSupplier.Supplier_IsManufacturer = request.body.Supplier_IsManufacturer;
      newSupplier.Supplier_ExtraField1 = request.body.Supplier_ExtraField1;
      newSupplier.Supplier_ExtraField2 = request.body.Supplier_ExtraField2;
      newSupplier.Supplier_ExtraField3 = request.body.Supplier_ExtraField3;
      newSupplier.Supplier_ExtraField4 = request.body.Supplier_ExtraField4;
      newSupplier.Supplier_ExtraField5 = request.body.Supplier_ExtraField5;
      newSupplier.Supplier_EditedBy_User_Code =  request.body.User_Code;
      newSupplier.Supplier_EditingTime =  new Date();
      newSupplier.save(function(error, doneadd) {
        if (error) {
          return res.send({
            porceed: false,
            message: error
          });
        } else {
          //check to see if user can access all suppliers,if it is true,we do nothing.
          //if it is not, we need to add it
          //to user's allowed suppliers
          if (user.User_Access_All_Customers != 1) {
            //we need to add supplier to user allowed suppliers array
            user.User_Allowed_Suppliers.push(NextCode);
            var myquery = { User_Code: request.body.User_Code };
            var newvalues = {
              User_Allowed_Suppliers: user.User_Allowed_Suppliers
            };
            User.findOneAndUpdate(myquery, newvalues, function(err, field) {
              if (err) {
                return res.send({
                  porceed: true,
                  message:
                    "Supplier saved, but with an error on add Customer for thiss user",
                  data: doneadd
                });
              } else {
                return res.send({
                  porceed: true,
                  message: "Supplier Added Succsessfully ",
                  data: doneadd
                });
              }
            });
          } else {
            return res.send({
              porceed: true,
              data: doneadd,
              message: "Supplier Added Succsessfully "
            });
          }
        }
      });
    }
  },

  editSupplier: function(request, res) {
    // User.find({ User_Code: request.body.User_Code })
    //   .lean()
    //   .exec(function(err, user) {
    //     if (err) {
    //       return res.send({ message: err });
    //     } else if (user.length > 0) {
    var newvalues = {
      $set: {
        Supplier_Name: request.body.Supplier_Name,
        Supplier_Email: request.body.Supplier_Email,
        Supplier_Country_Code: request.body.Supplier_Country_Code,
        Supplier_City: request.body.Supplier_City,
        Supplier_Address: request.body.Supplier_Address,
        Supplier_Phone: request.body.Supplier_Phone,
        Supplier_FaceBook: request.body.Supplier_FaceBook,
        Supplier_PaymentMethod_Codes:
          request.body.Supplier_PaymentMethod_Codes,
        Supplier_TimeOfDelivery: request.body.Supplier_TimeOfDelivery,
        Supplier_Agencies: request.body.Supplier_Agencies,
        Supplier_Certificates: request.body.Supplier_Certificates,
        Supplier_StoreAddress: request.body.Supplier_StoreAddress,
        Supplier_WayOfDelivery_Codes:
          request.body.Supplier_WayOfDelivery_Codes,
        Supplier_AddressGPSLocation:
          request.body.Supplier_AddressGPSLocation,
        Supplier_StoreGPSLocation: request.body.Supplier_StoreGPSLocation,
        Supplier_Category_IDs: request.body.Supplier_Category_IDs,
        //Product category newly added /////////////////////////
        Supplier_ProductCategory_Code:request.body.Supplier_ProductCategory_Code,
              //selling areas newly added /////////////////////////
      Supplier_SellingAreaCodes :request.body.Supplier_SellingAreaCodes,
      Supplier_SellingAreaNames :request.body.Supplier_SellingAreaNames,

        Supplier_SupplierType_Codes:
          request.body.Supplier_SupplierType_Codes,
        Supplier_Rate: request.body.Supplier_Rate,
        Supplier_Class_Code: request.body.Supplier_Class_Code,
        Supplier_IsActive: request.body.Supplier_IsActive,
        Supplier_IsSupplier: request.body.Supplier_IsSupplier,
        Supplier_IsManufacturer: request.body.Supplier_IsManufacturer,
        Supplier_ExtraField1: request.body.Supplier_ExtraField1,
        Supplier_ExtraField2: request.body.Supplier_ExtraField2,
        Supplier_ExtraField3: request.body.Supplier_ExtraField3,
        Supplier_ExtraField4: request.body.Supplier_ExtraField4,
        Supplier_ExtraField5: request.body.Supplier_ExtraField5,
        Supplier_IsChecked: false, //when you edit,it means customer didnot checked yet.,
        Supplier_EditedBy_User_Code: request.body.User_Code,
        Supplier_EditingTime: new Date()
      }
    };
    var myquery = { Supplier_Code: request.body.Supplier_Code };
    Supplier.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Supplier not exists"
        });
      } else {
        return res.send({
          message: true
        });
      }
    });
  }, 
  //       else {
  //         return res.send({
  //           err: "No user exist with user code provided in req body"
  //         });
  //       }
  //     });
  // },

  editSupplierContact: function(request, res) {
    console.log(request.body);
    var myquery = { Supplier_Code: request.body.Supplier_Code };

    var newvalues = {
      Supplier_Contact: request.body.Supplier_Contact,
      Supplier_IsChecked: false, //when you edit,it means customer didnot checked yet.,
      Supplier_EditedBy_User_Code: request.body.User_Code,
      Supplier_EditingTime: new Date()
    };
    Supplier.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        console.log(err);
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Supplier not exists"
        });
      } else {
        console.log("updated");
        return res.send({
          message: true
        });
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
      req.body.supplierDocuments=JSON.parse(req.body.supplierDocuments)
      const newDocs=[]
      req.body.supplierDocuments.forEach((pd)=>{
        if(!pd['_id']){
          newDocs.push(pd);
        }
      })
      console.log("newDocs",newDocs)
       req.files.forEach((file,index)=>{
        newDocs[index].Document_Url=file.filename
       })
     
       console.log("req.body.supplierDocuments",req.body.supplierDocuments);
       Supplier.find({ Supplier_Code:req.body.Supplier_Code}).lean().exec(function(err,supplier){
        if (err) {
          response.send({ message1: err });
        }
        else if (supplier.length>0) {
            Document.insertMany(newDocs,function(err,documents){
              if (err) {
                res.send({ message2: err });
              }else{
                console.log("documents",documents)
               // supplier[0].Supplier_Documents=[]
               if(! supplier[0].Supplier_Documents)supplier[0].Supplier_Documents=[]
                documents.forEach(d=>{
                  supplier[0].Supplier_Documents.push(d['_id'])
                })
                var newvalues={
                  $set:{
                    Supplier_Documents:supplier[0].Supplier_Documents
                  }
              }
                var myquery = { Supplier_Code: req.body.Supplier_Code };
                Supplier.findOneAndUpdate(myquery, newvalues, function(err, field) {
                  if (err) {
                    return res.send({
                      message: "Error"
                    });
                  }
                  if (!field) {
                    return res.send({
                      message: "Supplier not exists"
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
          console.log("supplier",supplier)
          res.send({message:"no supplier exist for these documents"});
        }
       })
  })
    
  },

  getDocuments:function(req,res){
    
    Supplier.find({ Supplier_Code: req.body.Supplier_Code })
    .select("Supplier_Documents") 
    .populate({ path: "Supplier_Documents", select: "Document_Name Document_Description Document_End_Date Document_Url" })    .lean()
    .exec(function(err, supplier) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (supplier.length > 0) {
        return res.send({
          Supplier_Documents: supplier[0].Supplier_Documents
        });
      }
      else{
        return res.send({
          message: "Supplier not exist"
        });
      }
  })
},

deleteDocument:function(req,res){
    
  Supplier.findOne({ Supplier_Code: req.body.Supplier_Code })
  .select("Supplier_Documents") 
  .exec(function(err, supplier) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (supplier) {
      console.log("supplier BEFORE",supplier )
      supplier["Supplier_Documents"].forEach((docID,index)=>{
        if(docID==req.body.documentID){
          supplier["Supplier_Documents"].splice(index,1)
        }
      })
      console.log("supplier AFTER",supplier )
      var newvalues={
        $set:{
          Supplier_Documents:supplier.Supplier_Documents
        }
      }
      var myquery = { Supplier_Code: req.body.Supplier_Code };
      Supplier.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Supplier not exists"
          });
        } else {
          //delete the document from file system if already existed
          if(req.body['Document_Url']){
            console.log("__dirname.replace('Controller','')",__dirname.replace('Controller',''))
            fs.unlink(path.join(__dirname.replace('Controller',''), "public","documents",req.body['Document_Url']), (err) => {
              if (err) return res.send({ message: err });
          //we need to delte the document n document collection
          Document.remove({_id:req.body.documentID}).exec(function(err, done) {
            if (err) {
              response.send({ message: err });
            }
            if (done) {
              return res.send({
                message: true
              });
            } else {
              response.send(false);
            }
          });
        });
      }
        }
      });
    }
    else{
      return res.send({
        message: "supplier not exist"
      });
    }
})
},
getSuppliersNumber:function(req,res){
  Supplier.find({}).count(function(err, count){
    console.log("Number of docs: ", count );
    if(err){
      return res.send({err:err})
    }else {
      return res.send({count:count})
    }
});
},
getCheckedSuppliersNumber:function(req,res){
  Supplier.find({Supplier_IsChecked:true}).count(function(err, count){
    console.log("Number of docs: ", count );
    if(err){
      return res.send({err:err})
    }else {
      return res.send({count:count})
    }
});
},

getCategoriedSuppliers:function(req,res){
  Supplier.find({Supplier_Category_IDs :{$in: req.body.Category_ID}})
  .select("Supplier_Code Supplier_Name")
  .exec(function(err, supplier) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (supplier) {
      res.send(supplier);
    } else {
      res.send("not Supplier");
    }
  });
},

getProductCategoriedSuppliers:function(req,res){
  Supplier.find({Supplier_ProductCategory_Code :{$in: req.body.Category_ID}})
  .select("Supplier_Code Supplier_Name")
  .exec(function(err, supplier) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (supplier) {
      res.send(supplier);
    } else {
      res.send("not Supplier");
    }
  });
},

getSellingAreasSuppliers:function(req,res){//Supplier_SellingAreaNames :{$in: { "$regex": `/${req.body.SellingArea_Name}/`}}
  Supplier.find({ })
  .select("Supplier_Code Supplier_Name Supplier_SellingAreaNames")
  .exec(function(err, suppliers) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (suppliers) {
      console.log("all suppliers",suppliers)
      let filteredSuppliers=[]  
      suppliers.map(supplier=>{
        supplier.Supplier_SellingAreaNames.forEach(sellName=>{
          if(sellName.includes(req.body.SellingArea_Name)){
            filteredSuppliers.push(supplier)
          }
        })
      })
      res.send(filteredSuppliers);
    } else {
      res.send("not Supplier");
    }
  });
},

deleteSupplierCategoryID:function(req,res){
  Supplier.findOne({Supplier_Code :req.body.Supplier_Code}) 
    .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          let obj=supplier.toObject()
          var index = obj.Supplier_Category_IDs.indexOf(req.body.Category_ID);
          if (index !== -1) 
          obj.Supplier_Category_IDs.splice(index, 1);
          console.log("obj",obj)
          Supplier.findOneAndUpdate({Supplier_Code:obj.Supplier_Code},{
            $set:{Supplier_Category_IDs:obj.Supplier_Category_IDs}
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
            message: "no Supplier exist wth Supplier code provided in req.body"
          });
        }
      })
},

deleteSupplierProductCategoryID:function(req,res){
  Supplier.findOne({Supplier_Code :req.body.Supplier_Code}) 
  .exec(function(err, supplier) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (supplier) {
        let obj=supplier.toObject()
        var index = obj.Supplier_ProductCategory_Code.indexOf(req.body.Category_ID);
        if (index !== -1) 
        obj.Supplier_ProductCategory_Code.splice(index, 1);
        console.log("obj",obj)
        Supplier.findOneAndUpdate({Supplier_Code:obj.Supplier_Code},{
          $set:{Supplier_ProductCategory_Code:obj.Supplier_ProductCategory_Code}
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
          message: "no Supplier exist wth Supplier code provided in req.body"
        });
      }
    })
},
deleteSupplierSellingAreaCodeAndName: function(req,res){
  Supplier.findOne({Supplier_Code :req.body.Supplier_Code}) 
    .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          let obj=supplier.toObject()
          var index = obj.Supplier_SellingAreaCodes.indexOf(req.body.SellingArea_Code);
          var index2 = obj.Supplier_SellingAreaNames.indexOf(req.body.SellingArea_Name);
          if (index !== -1) 
          obj.Supplier_SellingAreaCodes.splice(index, 1);
          if (index2 !== -1) 
          obj.Supplier_SellingAreaNames.splice(index2, 1);
          console.log("obj",obj)
          Supplier.findOneAndUpdate({Supplier_Code:obj.Supplier_Code},{
            $set:{
              Supplier_SellingAreaCodes:obj.Supplier_SellingAreaCodes,
              Supplier_SellingAreaNames:obj.Supplier_SellingAreaNames
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
            message: "no Supplier exist wth Supplier code provided in req.body"
          });
        }
      })
},
editSupplierCategoryIDs:function(req,res){
  Supplier.find({Supplier_Code :{$in: req.body.Supplier_Codes}}) 
  .lean()
  .exec(function(err, suppliers) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (suppliers) {
        //we need to update property Supplier_Category_IDs for each supplier
        //we add req.body.Category_ID to that property only if it isnot included
        suppliers.map(supplier=>{
          if(!supplier.Supplier_Category_IDs.includes(req.body.Category_ID)){
            supplier.Supplier_Category_IDs.push(req.body.Category_ID)
          }
        })
        console.log("suppliers",suppliers)
        saveAll(suppliers)
        function saveAll(objects ){
          var count = 0;
          objects.forEach(function(obj){
            var newvalues = {
              $set: {
                Supplier_Category_IDs: obj.Supplier_Category_IDs,
              }
            }
            Supplier.findOneAndUpdate({Supplier_Code:obj.Supplier_Code},newvalues,function(err,doc){
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
        res.send("not Supplier");
      }
    });
 },

 editSupplierProductCategoryIDs: function(req,res){
  Supplier.find({Supplier_Code :{$in: req.body.Supplier_Codes}}) 
  .lean()
  .exec(function(err, suppliers) {

      if (err) {
        return res.send({
          message: err
        });
      } else if (suppliers) {
        console.log("suppliers",suppliers)
        //we need to update property Supplier_ProductCategory_Code for each supplier
        //we add req.body.Category_ID to that property only if it isnot included
        
        suppliers.map(supplier=>{
          if(!supplier.Supplier_ProductCategory_Code){
            supplier.Supplier_ProductCategory_Code=[]
          }
          if(!supplier.Supplier_ProductCategory_Code.includes(req.body.Category_ID)){
            supplier.Supplier_ProductCategory_Code.push(req.body.Category_ID)
          }
        })
        console.log("suppliers",suppliers)
        saveAll(suppliers)
        function saveAll(objects ){
          var count = 0;
          objects.forEach(function(obj){
            var newvalues = {
              $set: {
                Supplier_ProductCategory_Code: obj.Supplier_ProductCategory_Code,
              }
            }
            Supplier.findOneAndUpdate({Supplier_Code:obj.Supplier_Code},newvalues,function(err,doc){
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
        res.send("not Supplier");
      }
    });
 },

 editSupplierSellingAreaCodeAndName :function(req,res){
  Supplier.find({Supplier_Code :{$in: req.body.Supplier_Codes}}) 
  .lean()
  .exec(function(err, suppliers) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (suppliers) {
        //we need to update property Supplier_SellingAreaCodes and Supplier_SellingAreaNames  for each supplier
        //we add req.body.SellingArea_Code and SellingArea_Name to that properties only if it isnot included
        suppliers.map(supplier=>{
          if(!supplier.Supplier_SellingAreaCodes)
          supplier.Supplier_SellingAreaCodes=[]
          if(!supplier.Supplier_SellingAreaNames)
          supplier.Supplier_SellingAreaNames=[]
          console.log("supplier.Supplier_SellingAreaNames",supplier.Supplier_SellingAreaNames)
          console.log("supplier.Supplier_SellingAreaCodes",supplier.Supplier_SellingAreaCodes)

          if(!supplier.Supplier_SellingAreaCodes.includes(req.body.SellingArea_Code)){
            supplier.Supplier_SellingAreaCodes.push(req.body.SellingArea_Code)
          }
          if(!supplier.Supplier_SellingAreaNames.includes(req.body.SellingArea_Name)){
            supplier.Supplier_SellingAreaNames.push(req.body.SellingArea_Name)
          }
          console.log("supplier.Supplier_SellingAreaNames",supplier.Supplier_SellingAreaNames)
          console.log("supplier.Supplier_SellingAreaCodes",supplier.Supplier_SellingAreaCodes)


        })
        saveAll(suppliers)
        function saveAll(objects ){
          var count = 0;
          objects.forEach(function(obj){
            var newvalues = {
              $set: {
                Supplier_SellingAreaCodes: obj.Supplier_SellingAreaCodes,
                Supplier_SellingAreaNames :obj.Supplier_SellingAreaNames
              }
            }
            Supplier.findOneAndUpdate({Supplier_Code:obj.Supplier_Code},newvalues,function(err,doc){
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
        res.send("not Supplier");
      }
    });
 }

};

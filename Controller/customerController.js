var Customer = require("../Model/customer");

var Supplier = require("../Model/supplier");
var Category = require("../Model/category");
var User = require("../Model/user");
var SupplierType = require("../Model/lut_supplier_types");
var SupplierClass = require("../Model/lut_classes");
var Country = require("../Model/countries");
var PaymentMethod = require("../Model/lut_payment_methods");
var WayOfDelivery = require("../Model/lut_ways_of_delivery");
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
    cb(null, file.fieldname + "-" + datetimestamp + makeid(5)+ "."+ arr[arr.length-1] );
    console.log("fieldname", file.fieldname);
  }
});
var upload = multer({
  //multer settings
  storage: storage,
}).any()


module.exports = {
  getCustomerHistory: function(request, res) {
    console.log("body", request.body);
    Customer.find({ Customer_Code: request.body.Customer_Code })
      .select("history")
      .populate({ path: "history.HistoryCategory", select: "Category_Name" })
      .populate({ path: "history.Historyproductcategory", select: "ProductCategory_Name" })
      //HistoryCustomerClass
      .populate({
        path: "history.HistoryCustomerClass",
        select: "Class_Name"
      })
      .populate({
        path: "history.HistoryWayOfDeliver",
        select: "WayOfDelivary_Name"
      })
      .populate({
        path: "history.HistoryCustomerType",
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
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err,
            proceed: false
          });
        } else if (customer.length > 0) {
          res.send({
            history: customer[0].history,
            proceed: true
          });
        } else {
          return res.send({
            message:
              "No customer exist with User_Code provided in request body!",
            proceed: false
          });
        }
      });
  },
  checkCustomer: function(request, res) {
    console.log("body", request.body);
    //we need to first: add existing customer to history property of that customer,
    //second:make property Customer_IsChecked of that customer to true
    Customer.find({ Customer_Code: request.body.Customer_Code })
      .select(
        `Customer_Name Customer_Email Customer_Password Customer_Country_Code 
    Customer_City Customer_Address Customer_StoreAddress Customer_AddressGPSLocation 
    Customer_StoreGPSLocation Customer_Phone Customer_Contact Customer_LinkedTo_Supplier_Code
    Customer_FaceBook Customer_PaymentMethod_Codes Customer_WayOfDelivery_Codes
    Customer_Agencies Customer_Certificates Customer_Category_IDs Customer_ProductCategory_Code Customer_SellingAreaCodes
    Customer_SellingAreaNames Customer_SupplierType_Codes
    Customer_Class_Code Customer_Rate Customer_IsActive Customer_SellingAreaCodes
    Customer_ExtraField1 Customer_ExtraField2 Customer_ExtraField3 Customer_ExtraField4
    Customer_ExtraField5 Customer_EditedBy_User_Code Customer_EditingTime
    `
      )
      .lean()
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer.length > 0) {
          let historyObject = customer[0];
          historyObject["Customer_CheckedBy_User_Code"] =
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
                historyObject["Customer_CheckedDate"] = new Date();
                console.log("our history object is:", historyObject);
                var newvalues = {
                  $set: {
                    Customer_IsChecked: true
                  },
                  $push: { history: historyObject }
                };
                console.log("historyObject", historyObject);
                var myquery = { Customer_Code: request.body.Customer_Code };
                Customer.findOneAndUpdate(myquery, newvalues, function(
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
                      message: "Customer not exists"
                    });
                  } else {
                    return res.send({
                      message: true
                    });
                  }
                });
              } else {
                res.send("not Customer");
              }
            });
        }
      });
  },
  declineCustomer: function(req, res) {
    var updated={
      $set:{
        Customer_IsChecked: false,
        Decline_Comment: req.body.Decline_Comment,
        Customer_DeclinedBy_User_Code :req.body.User_Code
      }
    };
    Customer.findOneAndUpdate({ Customer_Code: req.body.Customer_Code },updated,function(err, Customer) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (Customer ) {
        res.send({message:true})
      }
      else{
        res.send({message:"Customer is null"})
      }
    })
  },

  getDeclinedCustomerComment: function(req, res) {
    console.log("dd")
    Customer.findOne({ Customer_Code: req.body.Customer_Code })
    .select('Decline_Comment Customer_DeclinedBy_User_Code')
    .populate({path:"DeclinedUser"})
    .exec(function(err, Customer) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (Customer ) {
        res.send(Customer)
      }
      else{
        res.send({message:"Customer is null"})
      }
    })
  },
  getCustomer: function(request, res) {
    Customer.find({})
      .select("Customer_Code Customer_Name")
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          res.send(customer);
        } else {
          res.send("not Customer");
        }
      });
  },
  getCategoriedCustomers:function(req,res){
    Customer.find({Customer_Category_IDs :{$in: req.body.Category_ID}})
      .select("Customer_Code Customer_Name")
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          res.send(customer);
        } else {
          res.send("not Customer");
        }
      });
  },
  
  getProductCategoriedCustomers:function(req,res){
    Customer.find({Customer_ProductCategory_Code :{$in: req.body.Category_ID}})
      .select("Customer_Code Customer_Name")
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          res.send(customer);
        } else {
          res.send("not Customer");
        }
      });
  },

  getSellingAreasCustomers:function(req,res){
    Customer.find({})
    .select("Customer_Code Customer_Name Customer_SellingAreaNames")
    .exec(function(err, customers) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (customers) { 
        let filteredCustomers=[]  
      customers.map(customer=>{
        customer.Customer_SellingAreaNames.forEach(sellName=>{
          if(sellName.includes(req.body.SellingArea_Name)){
            filteredCustomers.push(customer)
          }
        })
      })
      res.send(filteredCustomers);
      } else {
        res.send("not Customer");
      }
    });
  },

  editCustomerCategoryIDs:function(req,res){
    Customer.find({Customer_Code :{$in: req.body.Customer_Codes}}) 
    .lean()
    .exec(function(err, customers) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customers) {
          //we need to update property Customer_Category_IDs for each customer
          //we add req.body.Category_ID to that property only if it isnot included
          customers.map(customer=>{
            if(!customer.Customer_Category_IDs.includes(req.body.Category_ID)){
              customer.Customer_Category_IDs.push(req.body.Category_ID)
            }
          })
          console.log("customers",customers)
          saveAll(customers)
          function saveAll(objects ){
            var count = 0;
            objects.forEach(function(obj){
              var newvalues = {
                $set: {
                  Customer_Category_IDs: obj.Customer_Category_IDs,
                }
              }
              Customer.findOneAndUpdate({Customer_Code:obj.Customer_Code},newvalues,function(err,doc){
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
          res.send("not Customer");
        }
      });
  },
  editCustomerProductCategoryIDs: function(req,res){
    Customer.find({Customer_Code :{$in: req.body.Customer_Codes}}) 
    .lean()
    .exec(function(err, customers) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customers) {
          //we need to update property Customer_ProductCategory_Code for each customer
          //we add req.body.Category_ID to that property only if it isnot included
          customers.map(customer=>{
            if(!customer.Customer_ProductCategory_Code){
              customer.Customer_ProductCategory_Code=[]
            }
            if(!customer.Customer_ProductCategory_Code.includes(req.body.Category_ID)){
              customer.Customer_ProductCategory_Code.push(req.body.Category_ID)
            }
          })
          console.log("customers",customers)
          saveAll(customers)
          function saveAll(objects ){
            var count = 0;
            objects.forEach(function(obj){
              var newvalues = {
                $set: {
                  Customer_ProductCategory_Code: obj.Customer_ProductCategory_Code,
                }
              }
              Customer.findOneAndUpdate({Customer_Code:obj.Customer_Code},newvalues,function(err,doc){
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
          res.send("not Customer");
        }
      });
  },

  editCustomerSellingAreaCodeAndName :function(req,res){
    Customer.find({Customer_Code :{$in: req.body.Customer_Codes}}) 
    .lean()
    .exec(function(err, customers) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customers) {
          //we need to update property Customer_SellingAreaCodes and Customer_SellingAreaNames  for each Customer
          //we add req.body.SellingArea_Code and SellingArea_Name to that properties only if it isnot included
          customers.map(customer=>{
             if(!customer.Customer_SellingAreaCodes)
                customer.Customer_SellingAreaCodes=[]
             if(!customer.Customer_SellingAreaNames)
                customer.Customer_SellingAreaNames=[]

            if(!customer.Customer_SellingAreaCodes.includes(req.body.SellingArea_Code)){
              customer.Customer_SellingAreaCodes.push(req.body.SellingArea_Code)
            }
            if(!customer.Customer_SellingAreaNames.includes(req.body.SellingArea_Name)){
              customer.Customer_SellingAreaNames.push(req.body.SellingArea_Name)
            }
          })
          console.log("customer",customers)
          saveAll(customers)
          function saveAll(objects ){
            var count = 0;
            objects.forEach(function(obj){
              var newvalues = {
                $set: {
                  Customer_SellingAreaCodes: obj.Customer_SellingAreaCodes,
                  Customer_SellingAreaNames :obj.Customer_SellingAreaNames
                }
              }
              Customer.findOneAndUpdate({Customer_Code:obj.Customer_Code},newvalues,function(err,doc){
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
          res.send("not Customer");
        }
      });
  },

  deleteCustomerCategoryID:function(req,res){
    Customer.findOne({Customer_Code :req.body.Customer_Code}) 
    .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          let obj=customer.toObject()
          var index = obj.Customer_Category_IDs.indexOf(req.body.Category_ID);
          if (index !== -1) 
          obj.Customer_Category_IDs.splice(index, 1);
          console.log("obj",obj)
          Customer.findOneAndUpdate({Customer_Code:obj.Customer_Code},{
            $set:{Customer_Category_IDs:obj.Customer_Category_IDs}
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
            message: "no customer exist wth customer code provided in req.body"
          });
        }
      })
  },
  deleteCustomerProductCategoryID: function(req,res){
    Customer.findOne({Customer_Code :req.body.Customer_Code}) 
    .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          let obj=customer.toObject()
          var index = obj.Customer_ProductCategory_Code.indexOf(req.body.Category_ID);
          if (index !== -1) 
          obj.Customer_ProductCategory_Code.splice(index, 1);
          console.log("obj",obj)
          Customer.findOneAndUpdate({Customer_Code:obj.Customer_Code},{
            $set:{Customer_ProductCategory_Code:obj.Customer_ProductCategory_Code}
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
            message: "no customer exist wth customer code provided in req.body"
          });
        }
      })
  },

  deleteCustomerSellingAreaCodeAndName :function(req,res){
    Customer.findOne({Customer_Code :req.body.Customer_Code}) 
    .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          let obj=customer.toObject()
          var index = obj.Customer_SellingAreaCodes.indexOf(req.body.SellingArea_Code);
          var index2 = obj.Customer_SellingAreaNames.indexOf(req.body.SellingArea_Name);
          if (index !== -1) 
          obj.Customer_SellingAreaCodes.splice(index, 1);
          if (index2 !== -1) 
          obj.Customer_SellingAreaNames.splice(index2, 1);
          console.log("obj",obj)
          Customer.findOneAndUpdate({Customer_Code:obj.Customer_Code},{
            $set:{
              Customer_SellingAreaCodes:obj.Customer_SellingAreaCodes,
              Customer_SellingAreaNames:obj.Customer_SellingAreaNames
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
            message: "no customer exist wth customer code provided in req.body"
          });
        }
      })
  },

  getCustomerDocuments:function(req,res){
    Customer.findOne({Customer_Code:req.body.Customer_Code})
      .select("Customer_Documents ")
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          res.send(customer);
        } else {
          res.send("not Customer");
        }
      });
  },
  getAllCustomer: function(request, res) {
    Customer.find({})

      .populate({ path: "WayOfDeliver", select: "WayOfDelivary_Name" })
      .populate({ path: "Category", select: "Category_Name" })
      .populate({ path: "productcategory", select: "ProductCategory_Name" })
      .populate({ path: "CustomerType", select: "SupplierType_Name" })
      .populate({ path: "CustomerClass", select: "Class_Name" })
      .populate({ path: "country", select: "Country_Name Country_Tcode" })
      .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
      .populate({ path: "sellingArea", select: "SellingArea_Name" })

      .lean()
      .sort({ Customer_Code: -1 })
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          res.send(customer);
        } else {
          res.send("not Supplier");
        }
      });
  },
  /****************eissa*/
  getAllCustomerByPageNumber: function(request, res) {
    const nPerPage = 20; //retrieve only 20 customers
    let pageNumber;
    if (request.body.pageNumber) {
      pageNumber = request.body.pageNumber;
    } else {
      pageNumber = 0;
    }

    Customer.find({})
      .populate({ path: "WayOfDeliver", select: "WayOfDelivary_Name" })
      .populate({ path: "Category", select: "Category_Name" })
      .populate({ path: "productcategory", select: "ProductCategory_Name" })
      .populate({ path: "CustomerType", select: "SupplierType_Name" })
      .populate({ path: "CustomerClass", select: "Class_Name" })
      .populate({ path: "country", select: "Country_Name Country_Tcode" })
      .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
      .populate({ path: "sellingArea", select: "SellingArea_Name" })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .lean()
      .sort({ Customer_Code: -1 })
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          res.send(customer);
        } else {
          res.send("not Supplier");
        }
      });
  },
  getAllCustomersByUserCode: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        console.log("user", user);
        var filterObject = {};
        if (user[0].User_Access_All_Customers != 1) {
          filterObject = {
            Customer_Code: { $in: user[0].User_Allowed_Customers }
          };
        }
        if (request.body.letter && request.body.letter != "") {
          filterObject["Customer_Name"] = { $regex: `^${request.body.letter}` }; //`/^B/`;
        }
        Customer.find(filterObject)
          .select(
            `Customer_Code Customer_Name Customer_Email Customer_Password Customer_Country_Code 
      Customer_City Customer_Address Customer_StoreAddress Customer_AddressGPSLocation 
      Customer_StoreGPSLocation Customer_Phone Customer_Contact Customer_LinkedTo_Supplier_Code
      Customer_FaceBook Customer_PaymentMethod_Codes Customer_WayOfDelivery_Codes
      Customer_Agencies Customer_Certificates Customer_Category_IDs Customer_ProductCategory_Code Customer_SellingAreaCodes 
      Customer_SellingAreaNames Customer_SupplierType_Codes
      Customer_Class_Code Customer_Rate Customer_IsActive Customer_SellingAreaCodes
      Customer_ExtraField1 Customer_ExtraField2 Customer_ExtraField3 Customer_ExtraField4
      Customer_ExtraField5 Customer_IsChecked 
      `
          )
          .populate({ path: "WayOfDeliver", select: "WayOfDelivary_Name" })
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "CustomerType", select: "SupplierType_Name" })
          .populate({ path: "CustomerClass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })
          .lean()
          .sort({ Customer_Code: -1 })
          .exec(function(err, customer) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (customer) {
              res.send(customer);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send({
          msg: "there is no user with this user code provided in body request"
        });
      }
    });
  },

  ASCOrdergetAllCustomersByUserCode: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        console.log("user", user);
        var filterObject = {};
        if (user[0].User_Access_All_Customers != 1) {
          filterObject = {
            Customer_Code: { $in: user[0].User_Allowed_Customers }
          };
        }
        if (request.body.letter && request.body.letter != "") {
          filterObject["Customer_Name"] = { $regex: `^${request.body.letter}` }; //`/^B/`;
        }
        Customer.find(filterObject,null,{sort:{Customer_Code:1}})
          .select(
            `Customer_Code Customer_Name Customer_Email Customer_Password Customer_Country_Code 
      Customer_City Customer_Address Customer_StoreAddress Customer_AddressGPSLocation 
      Customer_StoreGPSLocation Customer_Phone Customer_Contact Customer_LinkedTo_Supplier_Code
      Customer_FaceBook Customer_PaymentMethod_Codes Customer_WayOfDelivery_Codes
      Customer_Agencies Customer_Certificates Customer_Category_IDs Customer_ProductCategory_Code Customer_SellingAreaCodes 
      Customer_SellingAreaNames Customer_SupplierType_Codes
      Customer_Class_Code Customer_Rate Customer_IsActive Customer_SellingAreaCodes
      Customer_ExtraField1 Customer_ExtraField2 Customer_ExtraField3 Customer_ExtraField4
      Customer_ExtraField5 Customer_IsChecked 
      `
          )
          .populate({ path: "WayOfDeliver", select: "WayOfDelivary_Name" })
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "CustomerType", select: "SupplierType_Name" })
          .populate({ path: "CustomerClass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })
          .lean()
          .exec(function(err, customer) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (customer) {
              res.send(customer);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send({
          msg: "there is no user with this user code provided in body request"
        });
      }
    });
  },

  DESCOrdergetAllCustomersByUserCode: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        console.log("user", user);
        var filterObject = {};
        if (user[0].User_Access_All_Customers != 1) {
          filterObject = {
            Customer_Code: { $in: user[0].User_Allowed_Customers }
          };
        }
        if (request.body.letter && request.body.letter != "") {
          filterObject["Customer_Name"] = { $regex: `^${request.body.letter}` }; //`/^B/`;
        }
        Customer.find(filterObject,null,{sort:{Customer_Code:-1}})
          .select(
            `Customer_Code Customer_Name Customer_Email Customer_Password Customer_Country_Code 
      Customer_City Customer_Address Customer_StoreAddress Customer_AddressGPSLocation 
      Customer_StoreGPSLocation Customer_Phone Customer_Contact Customer_LinkedTo_Supplier_Code
      Customer_FaceBook Customer_PaymentMethod_Codes Customer_WayOfDelivery_Codes
      Customer_Agencies Customer_Certificates Customer_Category_IDs Customer_ProductCategory_Code Customer_SellingAreaCodes 
      Customer_SellingAreaNames Customer_SupplierType_Codes
      Customer_Class_Code Customer_Rate Customer_IsActive Customer_SellingAreaCodes
      Customer_ExtraField1 Customer_ExtraField2 Customer_ExtraField3 Customer_ExtraField4
      Customer_ExtraField5 Customer_IsChecked 
      `
          )
          .populate({ path: "WayOfDeliver", select: "WayOfDelivary_Name" })
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "CustomerType", select: "SupplierType_Name" })
          .populate({ path: "CustomerClass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })
          .lean()
          .exec(function(err, customer) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (customer) {
              res.send(customer);
            } else {
              res.send("not Supplier");
            }
          });
      } else {
        res.send({
          msg: "there is no user with this user code provided in body request"
        });
      }
    });
  },

  getAllCustomersMiniDataByUserCode: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        var filterObject = {};
        if (user[0].User_Access_All_Customers != 1) {
          filterObject = {
            Customer_Code: { $in: user[0].User_Allowed_Customers }
          };
        }
        Customer.find(filterObject)
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          .lean()
          .sort({ Customer_Code: -1 })
          .exec(function(err, customer) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (customer) {
              res.send(customer);
            } else {
              res.send("no Customers found");
            }
          });
      } else {
        res.send(
          "there is no user with this user code provided in body request"
        );
      }
    });
  },
  searchCustomer: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user.length > 0) {
        console.log("request.body",request.body)
        //note :Whatever the type of the search, the searched word will always be
        //in req.body.Customer_Name
        var object = {};

        if (request.body.type == "name")
          object = {
            Customer_Name: {
              $regex: request.body.Customer_Name,
            $options: "ix"
            }
          };
          else if(request.body.type == "Customer Code")
          object = {
            Customer_Code:   request.body.Customer_Name 
          };

        /*var Searchquery = request.body.Customer_Name;
        var object = {
          Customer_Name: {
            // $regex: new RegExp("^" + Searchquery.toLowerCase(), "i");
            $regex: Searchquery,
            $options: "ix"
          }
        };*/
        //get only allowed customers user can access
        if (user[0].User_Access_All_Customers == 0) {
          object["Customer_Code"] = { $in: user[0].User_Allowed_Customers };
        }
        Customer.find(object)
          .populate({ path: "Category", select: "Category_Name" })
          .populate({ path: "productcategory", select: "ProductCategory_Name" })
          .populate({ path: "CustomerType", select: "SupplierType_Name" })
          .populate({ path: "CustomerClass", select: "Class_Name" })
          .populate({ path: "country", select: "Country_Name Country_Tcode" })
          .populate({ path: "PaymentMethod", select: "PaymentMethod_Name" })
          .populate({ path: "WayOfDelivery", select: "WayOfDelivary_Name" })
          .populate({ path: "sellingArea", select: "SellingArea_Name" })
          .lean()
          .sort({ Customer_Code: -1 })
          .exec(function(err, customer) {
            if (err) {
              console.log(err);
              return res.send({
                message: err
              });
            } else if (customer) {
              console.log(customer);
              res.send(customer);
            } else {
              console.log("no");
              res.send("Customer not found");
            }
          });
      } else {
        res.send("No user exist with User_Code provided in request body.");
      }
    });
  },
  CopyCustomerIntoSupplier: function(request, res) {
    Customer.find({ Customer_Code: request.body.Customer_Code }).exec(function(
      err,
      customer
    ) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (
        customer.length > 0 &&
        !customer[0].Customer_LinkedTo_Supplier_Code
      ) {
        checkForSupplier(customer[0]);
      } else {
        res.send("Customer Already Linked To Supplier");
      }
    });
    function checkForSupplier(customer) {
      //{ $or: [{a: 1}, {b: 1}] }
      Supplier.find({
        $or: [
          { Supplier_Email: customer.Customer_Email },
          { Supplier_Name: customer.Customer_Name },
          { Supplier_LinkedTo_Customer_Code: customer.Customer_Code }
        ]
      }).exec(function(err, supplier) {
        if (err) {
          console.log("error to find supplier");
          return res.send({
            message: err
          });
        } else if (supplier.length > 0) {
          console.log(supplier);
          console.log("supplier Is Already Exist");
          res.send("Supplier Is Already Exist");
        } else {
          console.log("supplier Is Ready To Insert");
          getNextSupplierCode(customer);
        }
      });
    }
    function getNextSupplierCode(customer) {
      Supplier.getLastCode(function(err, supplier) {
        if (supplier) InsertIntoSupplier(supplier.Supplier_Code + 1, customer);
        else InsertIntoSupplier(1, customer);
      });
    }
    function InsertIntoSupplier(NextCode, customer) {
      var Supplier_Contact = [];
      customer.Customer_Contact.forEach(function(item, index) {
        var supplierContactObj = {};
        supplierContactObj.Supplier_ContactTitle = item.Customer_ContactTitle;
        supplierContactObj.Supplier_ContactName = item.Customer_ContactName;
        supplierContactObj.Supplier_ContactTelphone =
          item.Customer_ContactTelphone;
        supplierContactObj.Supplier_ContactEmail = item.Customer_ContactEmail;
        Supplier_Contact.push(supplierContactObj);
      });
      var newSupplier = new Supplier();
      newSupplier.Supplier_Code = NextCode;
      newSupplier.Supplier_Name = customer.Customer_Name;
      newSupplier.Supplier_Email = customer.Customer_Email;
      newSupplier.Supplier_Country_Code = customer.Customer_Country_Code;
      newSupplier.Supplier_City = customer.Customer_City;
      newSupplier.Supplier_Address = customer.Customer_Address;
      newSupplier.Supplier_Phone = customer.Customer_Phone;
      newSupplier.Supplier_Contact = Supplier_Contact;
      newSupplier.Supplier_LinkedTo_Customer_Code = customer.Customer_Code;
      newSupplier.Supplier_FaceBook = customer.Customer_FaceBook;
      newSupplier.Supplier_PaymentMethod_Codes =
        customer.Customer_PaymentMethod_Codes;
      newSupplier.Supplier_Agencies = customer.Customer_Agencies;
      newSupplier.Supplier_Certificates = customer.Customer_Certificates;
      newSupplier.Supplier_StoreAddress = customer.Customer_StoreAddress;
      newSupplier.Supplier_WayOfDelivery_Codes =
        customer.Customer_WayOfDelivery_Codes;
      newSupplier.Supplier_AddressGPSLocation =
        customer.Customer_AddressGPSLocation;
      newSupplier.Supplier_StoreGPSLocation =
        customer.Customer_StoreGPSLocation;
      newSupplier.Supplier_Category_IDs = customer.Customer_Category_IDs;
      //////////////product category newly added  //////
      newSupplier.Supplier_ProductCategory_Code = customer.Customer_ProductCategory_Code;
            //////////////selling newly added  //////
            newSupplier.Supplier_SellingAreaCodes = customer.Customer_SellingAreaCodes;
            newSupplier.Supplier_SellingAreaNames = customer.Customer_SellingAreaNames;

      newSupplier.Supplier_SupplierType_Codes =
        customer.Customer_SupplierType_Codes;
      newSupplier.Supplier_Rate = customer.Customer_Rate;
      newSupplier.Supplier_Class_Code = customer.Customer_Class_Code;
      newSupplier.Supplier_IsActive = 1;
      newSupplier.Supplier_IsSupplier = 1;
      newSupplier.Supplier_IsManufacturer = 0;
      newSupplier.Supplier_ExtraField1 = customer.Customer_ExtraField1;
      newSupplier.Supplier_ExtraField2 = customer.Customer_ExtraField2;
      newSupplier.Supplier_ExtraField3 = customer.Customer_ExtraField3;
      newSupplier.Supplier_ExtraField4 = customer.Customer_ExtraField4;
      newSupplier.Supplier_ExtraField5 = customer.Customer_ExtraField5;
      newSupplier.Supplier_EditedBy_User_Code = request.body.User_Code;
      newSupplier.Supplier_EditingTime = new Date();
      newSupplier.save(function(error, doneadd) {
        if (error) {
          console.log(error);
          return res.send({
            message: error
          });
        } else {
          linkCustomerWithSupplierID(customer.Customer_Code, NextCode);
        }
      });
    }
    function linkCustomerWithSupplierID(Customer_Code, Supplier_Code) {
      var newvalues = {
        $set: {
          Customer_LinkedTo_Supplier_Code: Supplier_Code
        }
      };
      var myquery = { Customer_Code: Customer_Code };
      Customer.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Customer not exists"
          });
        } else {
          return res.send({
            message: true
          });
        }
      });
    }
  },
  linkCustomerWithSupplier: function(request, res) {
    linkCustomerWithSupplierID();
    function linkCustomerWithSupplierID() {
      var newvalues = {
        $set: {
          Customer_LinkedTo_Supplier_Code: request.body.Supplier_Code
        }
      };
      var myquery = {
        Customer_Code: request.body.Customer_Code,
        Customer_LinkedTo_Supplier_Code: null
      };
      Customer.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Customer not exists"
          });
        } else {
          linkSupplierWithCustomerID();
        }
      });
    }
    function linkSupplierWithCustomerID() {
      var newvalues = {
        $set: {
          Supplier_LinkedTo_Customer_Code: request.body.Customer_Code
        }
      };
      var myquery = {
        Supplier_Code: request.body.Supplier_Code,
        Supplier_LinkedTo_Customer_Code: null
      };
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
  addCustomer: function(request, res) {
    User.find({ User_Code: request.body.User_Code }).exec((err, user) => {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user.length > 0) {
        Customer.getLastCode(function(err, customer) {
          if (customer) InsertIntoCustomer(customer.Customer_Code + 1, user[0]);
          else InsertIntoCustomer(1, user[0]);
        });
      } else {
        res.send("No user exist with User_Code provided in request body");
      }
    });

    function InsertIntoCustomer(NextCode, user) {
      var newCustomer = new Customer();
      newCustomer.Customer_Code = NextCode;
      newCustomer.Customer_Name = request.body.Customer_Name;
      newCustomer.Customer_Email = request.body.Customer_Email;
      newCustomer.Customer_Country_Code = request.body.Customer_Country_Code;
      newCustomer.Customer_City = request.body.Customer_City;
      newCustomer.Customer_Address = request.body.Customer_Address;
      newCustomer.Customer_Phone = request.body.Customer_Phone;
      newCustomer.Customer_FaceBook = request.body.Customer_FaceBook;
      newCustomer.Customer_PaymentMethod_Codes =
        request.body.Customer_PaymentMethod_Codes;
      newCustomer.Customer_Agencies = request.body.Customer_Agencies;
      newCustomer.Customer_Certificates = request.body.Customer_Certificates;
      newCustomer.Customer_StoreAddress = request.body.Customer_StoreAddress;
      newCustomer.Customer_WayOfDelivery_Codes =
        request.body.Customer_WayOfDelivery_Codes;
      newCustomer.Customer_AddressGPSLocation =
        request.body.Customer_AddressGPSLocation;
      newCustomer.Customer_StoreGPSLocation =
        request.body.Customer_StoreGPSLocation;
      newCustomer.Customer_Category_IDs = request.body.Customer_Category_IDs;
      //Product category newly added /////////////////////////
      newCustomer.Customer_ProductCategory_Code=request.body.Customer_ProductCategory_Code;
            //selling area newly added /////////////////////////
            newCustomer.Customer_SellingAreaCodes=request.body.Customer_SellingAreaCodes;
            newCustomer.Customer_SellingAreaNames=request.body.Customer_SellingAreaNames;

      newCustomer.Customer_SupplierType_Codes =
        request.body.Customer_SupplierType_Codes;
      newCustomer.Customer_Rate = request.body.Customer_Rate;
      newCustomer.Customer_Class_Code = request.body.Customer_Class_Code;
      newCustomer.Customer_IsActive = 1;
      newCustomer.Customer_SellingAreaCodes =
        request.body.Customer_SellingAreaCodes;
      newCustomer.Customer_ExtraField1 = request.body.Customer_ExtraField1;
      newCustomer.Customer_ExtraField2 = request.body.Customer_ExtraField2;
      newCustomer.Customer_ExtraField3 = request.body.Customer_ExtraField3;
      newCustomer.Customer_ExtraField4 = request.body.Customer_ExtraField4;
      newCustomer.Customer_ExtraField5 = request.body.Customer_ExtraField5;
      newCustomer.Customer_EditedBy_User_Code = request.body.User_Code;
      newCustomer.Customer_EditingTime = new Date();
      newCustomer.save(function(error, doneadd) {
        if (error) {
          console.log(error);
          return res.send({
            message: error
          });
        } else {
          //check to see if user can access all customers,if it is true,we do nothing.
          //if it is not, we need to add customer to user's allowed customers
          if (user.User_Access_All_Customers != 1) {
            //we need to add customer to user allowed customers array
            user.User_Allowed_Customers.push(NextCode);
            var myquery = { User_Code: request.body.User_Code };
            var newvalues = {
              User_Allowed_Customers: user.User_Allowed_Customers
            };
            User.findOneAndUpdate(myquery, newvalues, function(err, field) {
              if (err) {
                return res.send({
                  message: true,
                  data: doneadd,
                  errormessage:
                    "Customer saved, but with an error on add Customer for thiss user"
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

  editCustomer: function(request, res) {
    User.find({ User_Code: request.body.User_Code })
      .lean()
      .exec(function(err, user) {
        if (err) {
          return res.send({ message: err });
        } else if (user.length > 0) {
          var newvalues = {
            $set: {
              Customer_Email: request.body.Customer_Email,
              Customer_Name: request.body.Customer_Name,
              Customer_Country_Code: request.body.Customer_Country_Code,
              Customer_City: request.body.Customer_City,
              Customer_Address: request.body.Customer_Address,
              Customer_Phone: request.body.Customer_Phone,
              Customer_FaceBook: request.body.Customer_FaceBook,
              Customer_PaymentMethod_Codes:
                request.body.Customer_PaymentMethod_Codes,
              Customer_Agencies: request.body.Customer_Agencies,
              Customer_Certificates: request.body.Customer_Certificates,
              Customer_StoreAddress: request.body.Customer_StoreAddress,
              Customer_WayOfDelivery_Codes:
                request.body.Customer_WayOfDelivery_Codes,
              Customer_AddressGPSLocation:
                request.body.Customer_AddressGPSLocation,
              Customer_StoreGPSLocation: request.body.Customer_StoreGPSLocation,
              Customer_Category_IDs: request.body.Customer_Category_IDs,
              //////////// product category newly added ///////////
              Customer_ProductCategory_Code:request.body.Customer_ProductCategory_Code,
                            //////////// selling area newly added ///////////
                            Customer_SellingAreaCodes:request.body.Customer_SellingAreaCodes,
                            Customer_SellingAreaNames:request.body.Customer_SellingAreaNames,

              Customer_SupplierType_Codes:
                request.body.Customer_SupplierType_Codes,
              Customer_Rate: request.body.Customer_Rate,
              Customer_Class_Code: request.body.Customer_Class_Code,
              Customer_IsActive: request.body.Customer_IsActive,
              Customer_SellingAreaCodes: request.body.Customer_SellingAreaCodes,
              Customer_ExtraField1: request.body.Customer_ExtraField1,
              Customer_ExtraField2: request.body.Customer_ExtraField2,
              Customer_ExtraField3: request.body.Customer_ExtraField3,
              Customer_ExtraField4: request.body.Customer_ExtraField4,
              Customer_ExtraField5: request.body.Customer_ExtraField5,
              Customer_IsChecked: false, //when you edit,it means customer didnot checked yet.,
              Customer_EditedBy_User_Code: request.body.User_Code,
              Customer_EditingTime: new Date()
            }
          };
          console.log(" newvalues.$set", newvalues.$set);
          var myquery = { Customer_Code: request.body.Customer_Code };
          Customer.findOneAndUpdate(myquery, newvalues, function(err, field) {
            if (err) {
              return res.send({
                message: "Error"
              });
            }
            if (!field) {
              return res.send({
                message: "Customer not exists"
              });
            } else {
              return res.send({
                message: true
              });
            }
          });
        } else {
          return res.send({ message: "No user exist with this user code" });
        }
      });
  },

  editCustomerContact: function(request, res) {
    var myquery = { Customer_Code: request.body.Customer_Code };

    var newvalues = {
      Customer_Contact: request.body.Customer_Contact,
      Customer_IsChecked: false, //when you edit,it means customer didnot checked yet.,
      Customer_EditedBy_User_Code: request.body.User_Code,
      Customer_EditingTime: new Date()
    };
    Customer.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Customer not exists"
        });
      } else {
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
      req.body.customerDocuments=JSON.parse(req.body.customerDocuments)
      const newDocs=[]
      req.body.customerDocuments.forEach((pd)=>{
        if(!pd['_id']){
          newDocs.push(pd);
        }
      })
      console.log("newDocs",newDocs)
       req.files.forEach((file,index)=>{
        newDocs[index].Document_Url=file.filename
       })
     
       console.log("req.body.customerDocuments",req.body.customerDocuments);
       Customer.find({ Customer_Code:req.body.Customer_Code}).lean().exec(function(err,customer){
        if (err) {
          response.send({ message1: err });
        }
        else if (customer.length>0) {
            Document.insertMany(newDocs,function(err,documents){
              if (err) {
                res.send({ message2: err });
              }else{
                console.log("documents",documents)
               // customer[0].Customer_Documents=[]
               if(! customer[0].Customer_Documents)customer[0].Customer_Documents=[]
                documents.forEach(d=>{
                  customer[0].Customer_Documents.push(d['_id'])
                })
                var newvalues={
                  $set:{
                    Customer_Documents:customer[0].Customer_Documents
                  }
              }
                var myquery = { Customer_Code: req.body.Customer_Code };
                Customer.findOneAndUpdate(myquery, newvalues, function(err, field) {
                  if (err) {
                    return res.send({
                      message: "Error"
                    });
                  }
                  if (!field) {
                    return res.send({
                      message: "Customer not exists"
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
          console.log("customer",customer)
          res.send({message:"no customer exist for these documents"});
        }
       })
  })
    
  },

  getDocuments:function(req,res){
    
    Customer.find({ Customer_Code: req.body.Customer_Code })
    .select("Customer_Documents") 
    .populate({ path: "Customer_Documents", select: "Document_Name Document_Description Document_End_Date Document_Url" })    .lean()
    .exec(function(err, customer) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (customer.length > 0) {
        return res.send({
          Customer_Documents: customer[0].Customer_Documents
        });
      }
      else{
        return res.send({
          message: "Customer not exist"
        });
      }
  })
},

deleteDocument:function(req,res){
    
  Customer.findOne({ Customer_Code: req.body.Customer_Code })
  .select("Customer_Documents") 
  .exec(function(err, customer) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (customer) {
      console.log("customer BEFORE",customer )
      customer["Customer_Documents"].forEach((docID,index)=>{
        if(docID==req.body.documentID){
          customer["Customer_Documents"].splice(index,1)
        }
      })
      console.log("customer AFTER",customer )
      var newvalues={
        $set:{
          Customer_Documents:customer.Customer_Documents
        }
      }
      var myquery = { Customer_Code: req.body.Customer_Code };
      Customer.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Customer not exists"
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
        message: "customer not exist"
      });
    }
})
},
getCustomersNumber:function(req,res){
  Customer.find({}).count(function(err, count){
    console.log("Number of docs: ", count );
    if(err){
      return res.send({err:err})
    }else {
      return res.send({count:count})
    }
});
},
getCheckedCustomersNumber :function(req,res){
  Customer.find({Customer_IsChecked:true}).count(function(err, count){
    console.log("Number of docs: ", count );
    if(err){
      return res.send({err:err})
    }else {
      return res.send({count:count})
    }
});
},


};

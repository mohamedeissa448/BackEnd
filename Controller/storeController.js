var StoreProduct = require("../Model/store's-product");
var Purchasing = require('../Model/purchasing');
var User = require("../Model/user")
module.exports = {
    addStoreProduct: function(req, res) {
      const newStoreProduct = new StoreProduct(req.body.ProductStore);
      newStoreProduct.save((err, newStoreProduct) => {
        if (err) {
          return res.send({ message: err });
        } else if (newStoreProduct) {
          //we need to update Product_Incoming_HighChem_Permission_Number in purchase model
          Purchasing.findById(newStoreProduct.Product_Purchasing_ID)
          .exec(function(err,purchaseDocument){
            if (err) {
              return res.send({ message: err });
            } else if (purchaseDocument) {
              purchaseDocument.Product_Incoming_HighChem_Permission_Number = newStoreProduct.Product_Incoming_HighChem_Permission_Number;
              purchaseDocument.save(function(err,updatedPurchaseDocument){
                if (err) {
                  return res.send({ message: err });
                } else if (updatedPurchaseDocument) {
                  return res.send({ message: true });
                }
                else{
                  return res.send({ message: "unknown error" });
                }
              })
            }
            else{
              return res.send({ message: "purchaseDocument is null" });
            }
          })
         
        } else {
          return res.send({ message: "couldn't create a new store product" });
        }
      });
  },

  editStoreProductByID: function(req, res) {
    var newValues={
      $set:req.body.ProductStore
    }
    StoreProduct.findByIdAndUpdate(req.body._id,newValues,{new :true},(err, updatedStoreProduct) => {
      if (err) {
        return res.send({ message: err });
      } else if (updatedStoreProduct) {
        //we need to update Product_Incoming_HighChem_Permission_Number in purchase model
        Purchasing.findById(updatedStoreProduct.Product_Purchasing_ID)
        .exec(function(err,purchaseDocument){
          if (err) {
            return res.send({ message: err });
          } else if (purchaseDocument) {
            purchaseDocument.Product_Incoming_HighChem_Permission_Number = updatedStoreProduct.Product_Incoming_HighChem_Permission_Number;
            purchaseDocument.save(function(err,updatedPurchaseDocument){
              if (err) {
                return res.send({ message: err });
              } else if (updatedPurchaseDocument) {
                return res.send({ message: true });
              }
              else{
                return res.send({ message: "unknown error" });
              }
            })
          }
          else{
            return res.send({ message: "purchaseDocument is null" });
          }
        })
      } else {
        return res.send({ message: "couldn't update the store product" });
      }
    });
},

getAllStoreProducts: function(req, res) {
  var filterObject = {};
  if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
  if(req.body.user_id)  
      filterObject["StoreProduct_CreatedByUser"] = req.body.user_id
  console.log("filterObject",filterObject)
  StoreProduct.find(filterObject)
  .populate({path: "purchasing"})
  .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
  .populate({path: "country",select: "Country_Name"})
  .exec(function(err, storeProducts) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (storeProducts) {
      res.send(storeProducts);
    } else {
      
      res.send("store products not found");
    }
  });
},

ASCOrderGetAllStoreProducts: function(req, res) {
  var filterObject = {};
  if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
  if(req.body.user_id)  
      filterObject["StoreProduct_CreatedByUser"] = req.body.user_id
  console.log("filterObject",filterObject);
  let sorted = {};
  sorted[req.body.filterBy] = 1
  console.log("sorted",sorted)
  StoreProduct.find(filterObject).sort(sorted)
  .populate({path: "purchasing"})
  .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
  .populate({path: "country",select: "Country_Name"})
  .exec(function(err, storeProducts) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (storeProducts) {
      res.send(storeProducts);
    } else {
      
      res.send("store products not found");
    }
  });
},

DESCOrderGetAllStoreProducts: function(req, res) {
  var filterObject = {};
  if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
  if(req.body.user_id)  
      filterObject["StoreProduct_CreatedByUser"] = req.body.user_id
  console.log("filterObject",filterObject);
  let sorted = {};
  sorted[req.body.filterBy] = -1
  console.log("sorted",sorted)
  StoreProduct.find(filterObject).sort(sorted)
  .populate({path: "purchasing"})
  .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
  .populate({path: "country",select: "Country_Name"})
  .exec(function(err, storeProducts) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (storeProducts) {
      res.send(storeProducts);
    } else {
      
      res.send("store products not found");
    }
  });
},


getAllStoreProductsAllowedToUser: function(req, res) {
   //filter only User_Allowed_Products and User_Allowed_Suppliers
   User.findById(req.body.user_id ).exec((err, user) => {
    if (err) {
      return res.send({
        message: err
      });
    } else if (user) {
      var filterObject = {};
      if (user.User_Access_All_Products != 1) {
        console.log("user have  no access for all products");
        filterObject = {
          Product_Code: { $in: user.User_Allowed_Products }
        };
      }
      if (user.User_Access_All_Suppliers != 1) {
        console.log("user have  no access for all suppliers");
        filterObject = {
          Supplier_Code: { $in: user.User_Allowed_Suppliers }
        };
      }
      if (req.body.letter && req.body.letter != "")
        filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
      StoreProduct.find(filterObject)
      .populate({path: "purchasing"})
      .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
      .populate({path: "country",select: "Country_Name"})
      .exec(function(err, storeProducts) {
          if (err) {
            return res.send({
              message: err
            });
          } else if (storeProducts) {
            res.send(storeProducts);
          } else {
            
            res.send("store products not found");
          }
      });  
    }else
    return res.send({ message : "user is null"})
  })
 
},

ASCOrderGetAllStoreProductsAllowedToUser: function(req, res) {
  //filter only User_Allowed_Products and User_Allowed_Suppliers
  User.findById(req.body.user_id ).exec((err, user) => {
   if (err) {
     return res.send({
       message: err
     });
   } else if (user) {
     var filterObject = {};
     if (user.User_Access_All_Products != 1) {
       console.log("user have  no access for all products");
       filterObject = {
         Product_Code: { $in: user.User_Allowed_Products }
       };
     }
     if (user.User_Access_All_Suppliers != 1) {
       console.log("user have  no access for all suppliers");
       filterObject = {
         Supplier_Code: { $in: user.User_Allowed_Suppliers }
       };
     }
     if (req.body.letter && req.body.letter != "")
       filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
     let sorted = {};
     sorted[req.body.filterBy] = 1
     console.log("sorted",sorted)  
     StoreProduct.find(filterObject).sort(sorted)
     .populate({path: "purchasing"})
     .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
     .populate({path: "country",select: "Country_Name"})
     .exec(function(err, storeProducts) {
         if (err) {
           return res.send({
             message: err
           });
         } else if (storeProducts) {
           res.send(storeProducts);
         } else {
           
           res.send("store products not found");
         }
     });  
   }else
   return res.send({ message : "user is null"})
 })

},

DESCOrderGetAllStoreProductsAllowedToUser: function(req, res) {
  //filter only User_Allowed_Products and User_Allowed_Suppliers
  User.findById(req.body.user_id ).exec((err, user) => {
   if (err) {
     return res.send({
       message: err
     });
   } else if (user) {
     var filterObject = {};
     if (user.User_Access_All_Products != 1) {
       console.log("user have  no access for all products");
       filterObject = {
         Product_Code: { $in: user.User_Allowed_Products }
       };
     }
     if (user.User_Access_All_Suppliers != 1) {
       console.log("user have  no access for all suppliers");
       filterObject = {
         Supplier_Code: { $in: user.User_Allowed_Suppliers }
       };
     }
     if (req.body.letter && req.body.letter != "")
       filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
     let sorted = {};
     sorted[req.body.filterBy] = -1
     console.log("sorted",sorted)  
     StoreProduct.find(filterObject).sort(sorted)
     .populate({path: "purchasing"})
     .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
     .populate({path: "country",select: "Country_Name"})
     .exec(function(err, storeProducts) {
         if (err) {
           return res.send({
             message: err
           });
         } else if (storeProducts) {
           res.send(storeProducts);
         } else {
           
           res.send("store products not found");
         }
     });  
   }else
   return res.send({ message : "user is null"})
 })

},

  getStoreProductsByUserId: function(req, res) {
    StoreProduct.find({StoreProduct_CreatedByUser: req.body.user_id})
    .exec(function(err, storeProducts) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (storeProducts) {
        res.send(storeProducts);
      } else {
        
        res.send("store products not found");
      }
    });
  },
  
  getOneStoreProductById: function(req, res) {
    StoreProduct.findById(req.body._id)
    .populate("Product_Purchasing_ID")
    .exec(function(err, storeProduct) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (storeProduct) {
        res.send(storeProduct);
      } else {
        
        res.send("store product not found");
      }
    });
  },
searchStore:function(req,res){
  if(req.body.Product_Name){
    let Product_Name=req.body.Product_Name
    req.body.Product_Name={
      $regex: new RegExp(".*" + Product_Name + ".*", "i"),
     // $options: "ix"
    }
  }else if(req.body.Supplier_Name){
    let Supplier_Name=req.body.Supplier_Name
    req.body.Supplier_Name={
      $regex: new RegExp(".*" + Supplier_Name + ".*", "i"),
     // $options: "ix"
    }
  }else if(req.body.Product_Storing_Date){
    let start= req.body.Product_Storing_Date.split(' ')[0]
    let end= req.body.Product_Storing_Date.split(' ' )[1]
    
    if(end){//if there is end,it means we search from a date to a date
      req.body.Product_Storing_Date = {
        "$gte" : start ,
        "$lte" : end
      }
    }
    console.log("start",start)
    console.log("end",end)
    console.log("req.body.Product_Storing_Date",req.body.Product_Storing_Date)
  }
  else if(req.body.Product_Date_Of_Expiration){
    let end = req.body.Product_Date_Of_Expiration ;
      req.body.Product_Date_Of_Expiration = {
        "$lte" : end
    }
    console.log("req.body.Product_Date_Of_Expiration",req.body.Product_Date_Of_Expiration)
  }
  StoreProduct.find(req.body)
  .populate({path: "purchasing"})
  .populate({path: 'sales' , select:"Product_Sold_To_Customer_Code Product_Sold_To_Customer_Name Product_Quantity "})
  .populate({path: "country",select: "Country_Name"})


  .exec(function(err, documents) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (documents) {
      res.send(documents);
    } else {
      
      res.send("store products not found");
    }
  });
},

addProductOutGoingToProductInStore : function(req,res){
  var outGoingObject = {
    Sale_ID : req.body.Product_OutGoing.Sale_ID,
    Product_OutGoing_Quantity : req.body.Product_OutGoing.Product_OutGoing_Quantity,
    Product_OutGoing_Bill_Is_taxed: req.body.Product_OutGoing.Product_OutGoing_Bill_Is_taxed,
    Product_OutGoing_Bill_Number:  req.body.Product_OutGoing.Product_OutGoing_Bill_Number,
    Product_OutGoing_Customer_Permission_Number:  req.body.Product_OutGoing.Product_OutGoing_Customer_Permission_Number,  
    Product_OutGoing_HighChem_Permission_Number:  req.body.Product_OutGoing.Product_OutGoing_HighChem_Permission_Number ,
    Product_OutGoing_Date: req.body.Product_OutGoing.Product_OutGoing_Date
  };

  var query = req.body.Product_OutGoing.Product_ID_In_Store ;
  var updatedValues = {
    $push :{
      Product_OutGoing : outGoingObject
    },//we need to decrement Product_Current_Quantity by subtract Product_OutGoing_Quantity from it 
    $inc:{
      Product_Current_Quantity : -1 * outGoingObject.Product_OutGoing_Quantity
    }
  }
  StoreProduct.findByIdAndUpdate(query,updatedValues,function(err,updatedDocument){
    if (err) {
      return res.send({
        message: err
      });
    } else if (updatedDocument) {
      res.send({ message : true });
    } else {
      res.send("store product is null");
    }
  });
}


};

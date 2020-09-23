var Purchasing = require("../Model/purchasing");
var Store = require("../Model/store's-product");
var Product = require("../Model/product");
var User = require("../Model/user")

module.exports = {
    addPurchasingProduct: function(req, res) {
      const newPurchasing = new Purchasing(req.body.ProductPurchasing);
      newPurchasing.save((err, document) => {
        if (err) {
          return res.send({ message: err });
        } else if (document) {
           //we need to add the customer code we old to to Product_Supplier_Codes of product model
           Product.findOne({Product_Code : req.body.ProductPurchasing.Product_Code})
           .lean()
           .exec(function(err,productObject){
             if (err) {
               return res.send({ message: err });
             } else if (productObject) {
               var found= false;
               if(productObject.Product_Supplier_Codes == null || productObject.Product_Supplier_Codes.length ==0){
                 productObject.Product_Supplier_Codes=[];
                 found == false
               }else{
                 productObject.Product_Supplier_Codes.forEach((code)=>{
                   if(req.body.ProductPurchasing.Supplier_Code == code ){
                     found == true
                   }
                 });
               }
                 if(found == false){
                   productObject.Product_Supplier_Codes.push(req.body.ProductPurchasing.Supplier_Code);
                   Product.findByIdAndUpdate(productObject._id,{$set:{Product_Supplier_Codes:productObject.Product_Supplier_Codes}},function(err,updatedProductDoc){
                     if (err) {
                       return res.send({ message: err });
                     } else if (updatedProductDoc) {
                       return res.send({ message: true });
                     }
                     else{
                        res.send({message: "couldn't update the product "})
                     }
                   })
                 }else{
                   return res.send({ message: true });
                 }
               
              
             }
             else res.send({message: "couldn't find the product "})
           })
           return res.send({ message: true });
        } else {
          return res.send({ message: "couldn't create a new purchasing " });
        }
      });
  },

  editPurchasingProductById: function(req, res) {
    var newvalues = {
      $set: req.body.ProductPurchasing
    };
    Purchasing.findByIdAndUpdate(req.body._id,newvalues,{new :true},(err, purchaseDocument) => {
      if (err) {
        return res.send({ message: err });
      } else if (purchaseDocument) {
        Store.findOne({Product_Purchasing_ID : purchaseDocument._id},function(err,storeDocument){
          if(storeDocument){
            storeDocument.Product_Current_Quantity = purchaseDocument.Product_Quantity
            storeDocument.Product_Code = purchaseDocument.Product_Code ;
            storeDocument.Product_Name = purchaseDocument.Product_Name ;
            storeDocument.Supplier_Code = purchaseDocument.Supplier_Code ;
            storeDocument.Supplier_Name = purchaseDocument.Supplier_Name ;
            storeDocument.Product_Incoming_Bill_Number = purchaseDocument.Product_Incoming_Bill_Number ;
            storeDocument.Product_Incoming_Supplier_Permission_Number = purchaseDocument.Product_Incoming_Supplier_Permission_Number ;
            storeDocument.Product_BatchNumber = purchaseDocument.Product_BatchNumber ;
            storeDocument.Product_Origin_Country_Code = purchaseDocument.Product_Origin_Country_Code ;
            storeDocument.Product_Date_Of_Expiration = purchaseDocument.Product_Date_Of_Expiration ;
            storeDocument.save(function(err,updatedStoreDoc){
              if(updatedStoreDoc){
                return res.send({ message: true });
              }
            })
          }else{
            return res.send({ message: true });
          }
         
        })

        
      } else {
        return res.send({ message: "couldn't update the purchasing " });
      }
    });
},

  getPurchasingProductsByUserId: function(req, res) {
    Purchasing.find({PurchasingProduct_CreatedByUser: req.body.user_id})
    .select(`Product_Code Product_Name `)
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("purchasing products not found");
      }
    });
  },

  getAllPurchasings:  function(req, res) {
    
        var filterObject = {};
        if (req.body.letter && req.body.letter != "")
          filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
        if(req.body.user_id)  
          filterObject["PurchasingProduct_CreatedByUser"] = req.body.user_id
        console.log("filterObject",filterObject)
        Purchasing.find(filterObject)
        .populate({path:"weight" ,select:"Weight_Name"})
        .exec(function(err, documents) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (documents) {
              res.send(documents);
            } else {
              res.send("purchasing products not found");
            }
        });  
      
    
   
  },
  ASCOrderGetAllPurchasings:  function(req, res) {
    
    var filterObject = {};
    if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
    if(req.body.user_id)  
      filterObject["PurchasingProduct_CreatedByUser"] = req.body.user_id
    console.log("filterObject",filterObject)
    let sorted = {};
    sorted[req.body.filterBy] = 1
    console.log("sorted",sorted)
    Purchasing.find(filterObject).sort(sorted)
    .populate({path:"weight" ,select:"Weight_Name"})
    .exec(function(err, documents) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (documents) {
          res.send(documents);
        } else {
          res.send("purchasing products not found");
        }
    });  
  


},

  DESCOrderGetAllPurchasings:  function(req, res) {
      
    var filterObject = {};
    if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
    if(req.body.user_id)  
      filterObject["PurchasingProduct_CreatedByUser"] = req.body.user_id
    console.log("filterObject",filterObject)
    let sorted = {};
    sorted[req.body.filterBy] = -1
    console.log("sorted",sorted)
    Purchasing.find(filterObject).sort(sorted)
    .populate({path:"weight" ,select:"Weight_Name"})
    .exec(function(err, documents) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (documents) {
          res.send(documents);
        } else {
          res.send("purchasing products not found");
        }
    });  



  },

  getAllPurchasingsForAccounting :function(req, res) {
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
            Purchasing.find(filterObject)
            .populate({path:"weight" ,select:"Weight_Name"})
            .exec(function(err, documents) {
                if (err) {
                  return res.send({
                    message: err
                  });
                } else if (documents) {
                  res.send(documents);
                } else {
                  res.send("purchasing products not found");
                }
              });   
          }
          else 
            return res.send({message: "user is null"})
        })
   
  },

  ASCOrderGetAllPurchasingsForAccounting :function(req, res) {
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
        let sorted = {};
        sorted[req.body.filterBy] = 1
        console.log("sorted",sorted)   
        Purchasing.find(filterObject).sort(sorted)
        .populate({path:"weight" ,select:"Weight_Name"})
        .exec(function(err, documents) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (documents) {
              res.send(documents);
            } else {
              res.send("purchasing products not found");
            }
          });   
      }
      else 
        return res.send({message: "user is null"})
    })

},

 DESCOrderGetAllPurchasingsForAccounting :function(req, res) {
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
      let sorted = {};
      sorted[req.body.filterBy] = -1
      console.log("sorted",sorted)   
      Purchasing.find(filterObject).sort(sorted)
      .populate({path:"weight" ,select:"Weight_Name"})
      .exec(function(err, documents) {
          if (err) {
            return res.send({
              message: err
            });
          } else if (documents) {
            res.send(documents);
          } else {
            res.send("purchasing products not found");
          }
        });   
    }
    else 
      return res.send({message: "user is null"})
  })

},
  
  getAllPurchasingsForStatistics: function(req, res) {
    Purchasing.find({})
    .select('Total_Paid_Price Total_Price_After_Taxes')
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("purchasing products not found");
      }
    });
  },

  getAllPurchasingsBills: function(req, res) {
    Purchasing.find({})
    .select('Product_Incoming_Bill_Number Total_Price_After_Taxes Total_Paid_Price')
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("purchasing products not found");
      }
    });
  },

  getAllPurchaseProductsOfAspecificBill: function(req,res){
    Purchasing.find({Product_Incoming_Bill_Number : req.body.Product_Incoming_Bill_Number})
    .select(' Total_Price_After_Taxes Total_Paid_Price')
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("purchasing products not found");
      }
    });
  },
  getOnePurchasingProductById: function(req, res) {
    Purchasing.find({_id: req.body._id})
    .populate({ path: "weight", select: "Weight_Name" })
    .populate({ path: "country" })
    .populate({ path: "Manufacturer",select:"Supplier_Name" })
    .exec(function(err, document) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (document) {
        res.send(document);
      } else {
        
        res.send("purchasing product not found");
      }
    });
  },

  searchPurchasing:function(req,res){
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
    }
    else if(req.body.Total_Price_After_Taxes){
      let total_Price_After_Taxes= parseInt(req.body.Total_Price_After_Taxes)
      req.body.Total_Price_After_Taxes={
        $gte :total_Price_After_Taxes
      }
    }else if(req.body.Product_Purchasing_Date){
      let start= req.body.Product_Purchasing_Date.split(' ')[0]
      let end= req.body.Product_Purchasing_Date.split(' ' )[1]
      
      if(end){//if there is end,it means we search from a date to a date
        req.body.Product_Purchasing_Date = {
          "$gte" : start ,
          "$lte" : end
        }
      }
      console.log("start",start)
      console.log("end",end)
      console.log("req.body.Product_Purchasing_Date",req.body.Product_Purchasing_Date)
    }
    Purchasing.find(req.body)
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("purchasing products not found");
      }
    });
  }


};

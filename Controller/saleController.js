var Sale = require("../Model/sale");
var Product = require("../Model/product");
var User = require("../Model/user")

module.exports = {
    addSellingProduct: function(req, res) {
      const newSale = new Sale(req.body.ProductSelling);
      newSale.save((err, document) => {
        if (err) {
          return res.send({ message: err });
        } else if (document) {
          //we need to add the customer code we old to to Product_Customer_Codes of product model
          Product.findOne({Product_Code : req.body.ProductSelling.Product_Code})
          .lean()
          .exec(function(err,productObject){
            if (err) {
              return res.send({ message: err });
            } else if (productObject) {
              var found= false;
              if(productObject.Product_Customer_Codes == null || productObject.Product_Customer_Codes.length ==0){
                productObject.Product_Customer_Codes=[];
                found == false
              }else{
                productObject.Product_Customer_Codes.forEach((code)=>{
                  if(req.body.ProductSelling.Product_Sold_To_Customer_Code == code ){
                    found == true
                  }
                });
              }
                if(found == false){
                  productObject.Product_Customer_Codes.push(req.body.ProductSelling.Product_Sold_To_Customer_Code);
                  Product.findByIdAndUpdate(productObject._id,{$set:{Product_Customer_Codes:productObject.Product_Customer_Codes}},function(err,updatedProductDoc){
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
          return res.send({ message: "couldn't create a new Sale " });
        }
      });
  },

  editSaleProductById: function(req, res) {
    var newvalues = {
      $set: req.body.ProductSelling
    };
    Sale.findByIdAndUpdate(req.body._id,newvalues,{new :true},(err, document) => {
      if (err) {
        return res.send({ message: err });
      } else if (document) {
        return res.send({ message: true });
      } else {
        return res.send({ message: "couldn't create a new sale " });
      }
    });
},

getAllSalesProducts: function(req, res) {
  var filterObject = {};
  if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
  if(req.body.user_id)  
      filterObject["SellingProduct_CreatedByUser"] = req.body.user_id
  console.log("filterObject",filterObject)
  Sale.find(filterObject)
 // .select(`Product_Code Product_Name `)
 .populate({path:"customer",select:"Customer_Name"})
  .exec(function(err, documents) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (documents) {
      res.send(documents);
    } else {
      
      res.send("sales products not found");
    }
  });
},

ASCOrderGetAllSalesProducts: function(req, res) {
  var filterObject = {};
  if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
  if(req.body.user_id)  
      filterObject["SellingProduct_CreatedByUser"] = req.body.user_id
  console.log("filterObject",filterObject)
  let sorted = {};
  sorted[req.body.filterBy] = 1
  console.log("sorted",sorted) 
  Sale.find(filterObject).sort(sorted)
 // .select(`Product_Code Product_Name `)
 .populate({path:"customer",select:"Customer_Name"})
  .exec(function(err, documents) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (documents) {
      res.send(documents);
    } else {
      
      res.send("sales products not found");
    }
  });
},

DESCOrderGetAllSalesProducts: function(req, res) {
  var filterObject = {};
  if (req.body.letter && req.body.letter != "")
      filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
  if(req.body.user_id)  
      filterObject["SellingProduct_CreatedByUser"] = req.body.user_id
  console.log("filterObject",filterObject)
  let sorted = {};
  sorted[req.body.filterBy] = -1
  console.log("sorted",sorted) 
  Sale.find(filterObject).sort(sorted)
 // .select(`Product_Code Product_Name `)
 .populate({path:"customer",select:"Customer_Name"})
  .exec(function(err, documents) {
    if (err) {
      return res.send({
        message: err
      });
    } else if (documents) {
      res.send(documents);
    } else {
      
      res.send("sales products not found");
    }
  });
},

  getSalesProductsByUserId: function(req, res) {
    Sale.find({SellingProduct_CreatedByUser: req.body.user_id})
    .select(`Product_Code Product_Name `)
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("sales products not found");
      }
    });
  },

  getAllSales:  function(req, res) {
    Sale.find({})
    .populate({path:'weight',select:"Weight_Name"})
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("sales products not found");
      }
    });
  },

  getAllSalesForAccounting: function(req, res) {
     //filter only User_Allowed_Products and User_Allowed_Customers
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
        if (user.User_Access_All_Customers != 1) {
          console.log("user have  no access for all customers");
          filterObject = {
            Product_Sold_To_Customer_Code: { $in: user.User_Allowed_Customers }
          };
        }
        if (req.body.letter && req.body.letter != "")
          filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
        console.log('filterObject',filterObject)  
        Sale.find(filterObject)
        .populate({path:'weight',select:"Weight_Name"})
        .exec(function(err, documents) {
            if (err) {
              return res.send({
                message: err
              });
            } else if (documents) {
              res.send(documents);
            } else {
              
              res.send("sales products not found");
            }
        });  
      }else
      return res.send({ message : "user is null"})
    });  
   
  },

  ASCOrderGetAllSalesForAccounting: function(req, res) {
    //filter only User_Allowed_Products and User_Allowed_Customers
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
       if (user.User_Access_All_Customers != 1) {
         console.log("user have  no access for all customers");
         filterObject = {
           Product_Sold_To_Customer_Code: { $in: user.User_Allowed_Customers }
         };
       }
       if (req.body.letter && req.body.letter != "")
         filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
       console.log('filterObject',filterObject)  
      let sorted = {};
      sorted[req.body.filterBy] =  1
      console.log("sorted",sorted) 
       Sale.find(filterObject).sort(sorted)
       .populate({path:'weight',select:"Weight_Name"})
       .exec(function(err, documents) {
           if (err) {
             return res.send({
               message: err
             });
           } else if (documents) {
             res.send(documents);
           } else {
             
             res.send("sales products not found");
           }
       });  
     }else
     return res.send({ message : "user is null"})
   });  
  
 },

 DESCOrderGetAllSalesForAccounting: function(req, res) {
  //filter only User_Allowed_Products and User_Allowed_Customers
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
     if (user.User_Access_All_Customers != 1) {
       console.log("user have  no access for all customers");
       filterObject = {
         Product_Sold_To_Customer_Code: { $in: user.User_Allowed_Customers }
       };
     }
     if (req.body.letter && req.body.letter != "")
       filterObject[req.body.filterBy] = { $regex: `^${req.body.letter}` }; //`/^B/`;
     console.log('filterObject',filterObject)  
    let sorted = {};
    sorted[req.body.filterBy] =  -1
    console.log("sorted",sorted) 
     Sale.find(filterObject).sort(sorted)
     .populate({path:'weight',select:"Weight_Name"})
     .exec(function(err, documents) {
         if (err) {
           return res.send({
             message: err
           });
         } else if (documents) {
           res.send(documents);
         } else {
           
           res.send("sales products not found");
         }
     });  
   }else
   return res.send({ message : "user is null"})
 });  

},
  
  getAllSalesForStatistics: function(req, res) {
    Sale.find({})
    .select('Total_Receivable_Price Total_Price_After_Taxes')
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("sales products not found");
      }
    });
  },

  getAllSalesBills: function(req,res){
    Sale.find({})
    .select('Product_OutGoing_Bill_Number')
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("sales products not found");
      }
    });
  },
  getOneSaleProductById: function(req, res) {
    Sale.find({_id: req.body._id})
    .populate({ path: "product_In_Store" })
    .populate({ path: "customer",select:"Customer_Code Customer_Name" })
    .exec(function(err, document) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (document) {
        res.send(document);
      } else {
        
        res.send("sales product not found");
      }
    });
  },

  getAllSalesProductByProduct_ID_In_Store: function(req, res) {
    Sale.find({Product_ID_In_Store : req.body.Product_ID_In_Store })
    .populate({ path: "product_In_Store" })
    .exec(function(err, document) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (document) {
        res.send(document);
      } else {
        res.send("sales product not found");
      }
    });
  },

  searchSales:function(req,res){
    if(req.body.Product_Name){
      let Product_Name=req.body.Product_Name
      req.body.Product_Name={
        $regex: new RegExp(".*" + Product_Name + ".*", "i"),
       // $options: "ix"
      }
    }else if(req.body.Product_Sold_To_Customer_Name){
      let Product_Sold_To_Customer_Name=req.body.Product_Sold_To_Customer_Name
      req.body.Product_Sold_To_Customer_Name={
        $regex: new RegExp(".*" + Product_Sold_To_Customer_Name + ".*", "i"),
       // $options: "ix"
      }
    }
    else if(req.body.Total_Price_After_Taxes){
      let total_Price_After_Taxes= parseInt(req.body.Total_Price_After_Taxes)
      req.body.Total_Price_After_Taxes={
        $gte :total_Price_After_Taxes
      }
    }
    Sale.find(req.body)
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

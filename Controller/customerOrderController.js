var CustomerOrder = require("../Model/customer_orders");
module.exports = {
  addCustomerOrder: function(req, res) {
    CustomerOrder.getLastCode(function(err, lastOrder) {
      if (lastOrder)
        req.body.order.CustomerOrder_Code = lastOrder.CustomerOrder_Code + 1;
      else req.body.order.CustomerOrder_Code = 1;
      const order = new CustomerOrder(req.body.order);
      order.save((err, newOrder) => {
        if (err) {
          return res.send({ message: err });
        } else if (newOrder) {
          return res.send({ message: true });
        } else {
          return res.send({ message: "couldn't create a new order" });
        }
      });
    });
  },

  getCustomerOrdersByUserId: function(req, res) {
    CustomerOrder.find({CustomerOrder_CreatedByUser: req.body.user_id})
    .populate({ path: "CustomerOrder_Products.Order_RequestedQuantityWeightUnit", select: "Weight_Name" })
    .populate({ path: "CustomerOrder_Customer", select: "Customer_Name" })
    .populate({ path: "CustomerOrder_CreatedByUser", select: "User_Name User_DisplayName" })
    .exec(function(err, customerOrder) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (customerOrder) {
        console.log("customerOrder.CustomerOrder_Products",customerOrder[0].CustomerOrder_Products)
        res.send(customerOrder);
      } else {
        
        res.send("Customer Orders not found");
      }
    });
  },
  updateCustomerOrderProducts:function(req,res){
    
    var newvalues = {
      $set: {
        CustomerOrder_Products: req.body.CustomerOrder_Products
      }
    };
    console.log(" newvalues.$set", newvalues.$set);
    var myquery = {  CustomerOrder_Code: req.body.CustomerOrder_Code };
    CustomerOrder.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "Customer order not exists"
        });
      } else {
        return res.send({
          message: true
        });
      }
    }); 
},
updateCustomerOrderProductsIDsAndNames:function(req,res){
  CustomerOrder.findOne({CustomerOrder_Code: req.body.CustomerOrder_Code})
  .lean()
  .exec( function(err, order) {
    if (err) {
      return res.send({
        message: "Error"
      });
    }
    if (!order) {
      return res.send({
        message: "Customer order not exists"
      });
    } else {
      req.body.CustomerOrder_Products.forEach((updatedProductIdAndName)=>{
        order.CustomerOrder_Products.forEach((product)=>{
          product.Order_Product_Name=updatedProductIdAndName.Order_Product_Name
          product.Order_Product=updatedProductIdAndName.Order_Product
        })
      })
      console.log("order.CustomerOrder_Products",order.CustomerOrder_Products)
      var newvalues = {
        $set: {
          CustomerOrder_Products: order.CustomerOrder_Products
        }
      };
      console.log(" newvalues.$set", newvalues.$set);
      var myquery = {  CustomerOrder_Code: req.body.CustomerOrder_Code };
      CustomerOrder.findOneAndUpdate(myquery, newvalues, function(err, field) {
        if (err) {
          return res.send({
            message: "Error"
          });
        }
        if (!field) {
          return res.send({
            message: "Customer order not exists"
          });
        } else {
          return res.send({
            message: true
          });
        }
      }); 
     
    }
  }); 

}



};

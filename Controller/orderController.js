var Order = require("../Model/order-model");
var Store = require("../Model/store");
module.exports = {
    addOrder: function(req,res){
            console.log("1")
            Order.getLastCode(function(err, order) {
                if (order) InsertIntoOrder(order.Order_Code + 1);
                    else InsertIntoOrder(1);
                });
                function InsertIntoOrder(NextCode) {
                    let newOrder=new Order();
                    newOrder.Order_Code=NextCode ;
                    newOrder.Order_Date=req.body.Order_Date ;
                    newOrder.Order_Note=req.body.Order_Note ;
                    newOrder.Order_TotalProductSellingAmount= req.body.Order_TotalProductSellingAmount ;
                    newOrder.Order_TotalProductCostAmount = req.body.Order_TotalProductCostAmount ;
                    newOrder.Order_CreatedType = "AffiliateSeller" ;
                    newOrder.Order_Customer = req.body.Order_Customer;
                    newOrder.Order_Products = req.body.Order_Products ;
                    newOrder.Order_Status = "Created";
                    newOrder.Order_DoneBy_User = req.body.Order_DoneBy_User;
                    newOrder.save((err,orderDocument)=>{
                        if(err){
                            return res.send({
                                message1:err
                            })
                        }else {
                            var count = 0;
                            //we need to update store Store_PendingQuantity property in store model for each ordered product we have in order model
                            orderDocument.Order_Products.forEach((orderProduct)=>{
                                Store.findOne({Store_Product : orderProduct.Product,Origin_Variant:orderProduct.Origin_Variant,Expiration_Variant:orderProduct.Expiration_Variant})
                                .exec(function(err,storeDocument){
                                        if(err){
                                            return res.send({
                                                message3:err
                                            })
                                        }else if(storeDocument){
                                            
                                            storeDocument.Store_PendingQuantity += orderProduct.Quantity ;
                                            storeDocument.save(function(err,updatedStoreDocument){
                                                if(err){
                                                    return res.send({
                                                        message4:err
                                                    })
                                                }else {
                                                    count ++;
                                                    if(count == orderDocument.Order_Products.length - 1)
                                                        return res.send({message : true})
                                                    
                                                }
                                            })
                                        }
                                        else{
                                            return res.send({message : "couldnot found order product in store"})
                                        }
                                    })
                            })  
                           
                            
                                }

                            });           
            }  
    },

    editOrder : function(req,res){
    
       let updatedOrder={};
       updatedOrder.Order_Date=req.body.Order_Date ;
       updatedOrder.Order_Note=req.body.Order_Note ;
       updatedOrder.Order_TotalProductSellingAmount= req.body.Order_TotalProductSellingAmount ;
       updatedOrder.Order_TotalProductCostAmount = req.body.Order_TotalProductCostAmount ;
       updatedOrder.Order_Customer = req.body.Order_Customer;
       updatedOrder.Order_Products = req.body.Order_Products ;
       updatedOrder.Order_DoneBy_User = req.body.Order_DoneBy_User ;

        var newvalues={
            $set:updatedOrder
        }
            Order.findByIdAndUpdate(req.body['_id'],newvalues,{new: true},
            (err,orderDocument)=>{
                if(err){
                    return res.send({
                        message:err
                    })
                }else if(orderDocument) {
                    var count = 0 ;
                    //we need to update store Store_PendingQuantity property in store model for not each ordered product
                    //but for only new added products in order,which doesn't have property isAlreadyOrdered
                    req.body.Order_Products.forEach((orderProduct)=>{
                    Store.findOne({Store_Product : orderProduct.Product,Origin_Variant:orderProduct.Origin_Variant,Expiration_Variant:orderProduct.Expiration_Variant})
                    .exec(function(err,storeDocument){
                            console.log('storeDocument',storeDocument)
                            if(err){
                                return res.send({
                                    message3:err
                                })
                            }else if(storeDocument){
                                //we should increase Store_PendingQuantity property 
                                //but for only new added products in order,which doesn't have property isAlreadyOrdered
                                if(!orderProduct.isAlreadyOrdered){
                                    storeDocument.Store_PendingQuantity += orderProduct.Quantity ; 
                                }
                                storeDocument.save(function(err,updatedStoreDocument){
                                    if(err){
                                        return res.send({
                                            message4:err
                                        })
                                    }else {
                                        count ++ ;
                                        if(count == req.body.Order_Products.length - 1)
                                            return res.send({message : true})
                                    }
                                })   
                        }
                        else{
                            return res.send({message : "couldnot found order product in store"})
                        }
                        })
                    })
                   
                }else{
                    return res.send({
                        message:"updated order is null"
                    })
                }
            })
    },

    deleteProductInOrder : function (req,res){
        Order.findById(req.body.orderId)
        .exec(function(err,orderDocument){
            if(err) return res.send(err);
            else if(orderDocument){
                //first we need to delete the product in property Order_Products of the order document
                console.log("orderDocument.Order_Products",orderDocument.Order_Products)

                orderDocument.Order_Products = orderDocument.Order_Products.filter(x => 
                    x.Product != req.body.deletedProduct.Product
                )
                orderDocument.Order_TotalProductSellingAmount -= (req.body.deletedProduct.Price * req.body.deletedProduct.Quantity);
                orderDocument.Order_TotalProductCostAmount -=  (req.body.deletedProduct.Cost * req.body.deletedProduct.Quantity);
                orderDocument.save(function(err,updatedOrderDocument){
                    if(err) return res.send(err);
                    else{
                        //we need to update Store_PendingQuantity in the store by decreasing it by the quantity of the deleted product of the order
                        Store.findOne({
                            Store_Product : req.body.deletedProduct.Product,
                            Origin_Variant:req.body.deletedProduct.Origin_Variant,
                            Expiration_Variant:req.body.deletedProduct.Expiration_Variant,
                            Store_PendingQuantity : { $gte: 1} //using this instead of filtering by: Store_StoragePlace
                        }).exec(function(err,storeDocument){
                            if(err){
                                return res.send({
                                    message:err
                                })
                            }else if(storeDocument){
                                storeDocument.Store_PendingQuantity -= req.body.deletedProduct.Quantity ;
                                storeDocument.save(function(err,updatedStoreDocument){
                                    if(err){
                                        return res.send({  message2:err })
                                    }
                                    else {
                                         return res.send({message : true})
            
                                    }
                                        
                                })
                            }
                            else return res.send({ message : "storeDocument is null"})
                        })
                    }
                })
            }
            else return res.send({message : "orderProductDocument is null"});
        })
        
    },

    getAll : function(req,res){

        Order.find({})
        .select("-Order_CreatedType -Order_Products")
        .populate({path :"Order_Customer",select : "Customer_Name"})
        .populate({path :"Order_DoneBy_User",select : "User_Name"})
        .exec((err,orders)=>{
            if(err){
                return res.send({
                    message:err
                })
            }else if(orders) {
                return res.send(orders)
            }else{
                return res.send({
                     message:"orders are null"
                })
            }
        
            });
    },

    getOneById : function(req,res){

        Order.findById(req.body._id)
        .select("-Order_CreatedType ")
        .populate({path :"Order_Products.Product",select : "Product_Name"})
        .populate({path :"Order_Products.Origin_Variant",select : "ProductOrigin_Name"})
        .populate({path :"Order_Customer",select : "Customer_Code Customer_Name"})
        .populate({path :"Order_DoneBy_User",select : "User_Name"})
        .exec((err,orders)=>{
            if(err){
                return res.send({
                    message:err
                })
            }else if(orders) {
                return res.send(orders)
            }else{
                return res.send({
                     message:"orders are null"
                })
            }
        
            });
    },
    searchOrders: function(req,res){

        Order.find(req.body)
        .populate({path :"Order_Customer",select : "Customer_Name"})
        .populate({path :"Order_DoneBy_User",select : "User_Name"})
        .exec((err,orders)=>{
            if(err){
                return res.send({
                    message:err
                })
            }else if(orders) {
                return res.send(orders)
            }else{
                return res.send({
                     message:"orders are null"
                })
            }
        
            });
        }
}
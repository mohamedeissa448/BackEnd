var DecreaseInventory = require("../Model/decrease-inventory");
var Store = require("../Model/store");
var ProductTransaction = require("../Model/product-transaction");
var hcm_Product = require("../Model/product")

module.exports={
    addDecreaseInventory:(req,res)=>{
        const UpdateTransactionAndStore = async function() {
            var NextCode = await GetNexCode();
            var DecreaseInventoryProducts = await  InsertIntoDecreaseInventory(NextCode);
            var isInserted = await saveAll(DecreaseInventoryProducts);
            returnMessage();
            function GetNexCode(){
                return new Promise((resolve, reject) => {
                    DecreaseInventory.getLastCode(function(err, DecreaseInventoryItem) {
                        if (DecreaseInventoryItem){ 
                            resolve(DecreaseInventoryItem.DecreaseInventory_Code + 1 );
                        }
                        else {resolve(1)};
                    });
                })
            }

            function InsertIntoDecreaseInventory(NextCode) {
                return new Promise((resolve, reject) => {
                    const newDecreaseInventory= new DecreaseInventory();
                    newDecreaseInventory.DecreaseInventory_Code = NextCode;
                    newDecreaseInventory.DecreaseInventory_Date = req.body.DecreaseInventory_Date;
                    newDecreaseInventory.DecreaseInventory_Note = req.body.DecreaseInventory_Note;
                    newDecreaseInventory.DecreaseInventory_DoneBy_User = req.body.DecreaseInventory_DoneBy_User;
                    newDecreaseInventory.DecreaseInventory_Products = req.body.DecreaseInventory_Products;
                    newDecreaseInventory.save((err,document)=>{
                        if(err){
                            return res.send({
                                message:err
                            })
                        }else { 
                            resolve(document)
                        }
                    })
                })
            }
            
            function saveAll(document){
                return new Promise((resolve, reject) => {
                    document.DecreaseInventory_Products.forEach(function(decreaseInventoryProduct, index){
                        hcm_Product.find({_id: decreaseInventoryProduct.Product}).select("Product_SellingPrice")
                        .exec(function(err,hcm_product){
                            Store.find({Store_Product : decreaseInventoryProduct.Product, Origin_Variant: decreaseInventoryProduct.Origin_Variant, Expiration_Variant:decreaseInventoryProduct.Expiration_Variant })
                            .exec(function(err,storeProduct){
                                //we need to add documents to product transaction model
                                var CostToSubtract = decreaseInventoryProduct.Cost; 
                                const newProductTransaction=new ProductTransaction();
                                newProductTransaction.ProductTransaction_Date = document.DecreaseInventory_Date;
                                newProductTransaction.ProductTransaction_Product = decreaseInventoryProduct.Product;
                                newProductTransaction.Origin_Variant = decreaseInventoryProduct.Origin_Variant;
                                newProductTransaction.Expiration_Variant =decreaseInventoryProduct.Expiration_Variant;
                                newProductTransaction.ProductTransaction_MathSign = -1;
                                newProductTransaction.ProductTransaction_Type = "Decrease Inventory";
                                newProductTransaction.ProductTransaction_DecreaseInventory = document._id;
                                if(storeProduct.length >0){
                                    var TotalStoredQuantity = 0;
                                    storeProduct.forEach(function(storeProductItem, index){
                                        TotalStoredQuantity = TotalStoredQuantity + storeProductItem.Store_Quantity;
                                    })
                                    newProductTransaction.ProductTransaction_QuantityBeforAction = storeProduct[0].Store_Quantity;
                                    newProductTransaction.ProductTransaction_CostBeforAction = storeProduct[0].Store_Cost;
                                    newProductTransaction.ProductTransaction_SellPriceOnAction = hcm_product.Product_SellingPrice;
                                    newProductTransaction.ProductTransaction_QuantityAfterAction = TotalStoredQuantity - decreaseInventoryProduct.Quantity;
                                    CostToSubtract = ((storeProduct[0].Store_Cost * TotalStoredQuantity) - (decreaseInventoryProduct.Cost * decreaseInventoryProduct.Quantity))/ (TotalStoredQuantity - decreaseInventoryProduct.Quantity)//11111;//needs modification
                                    newProductTransaction.ProductTransaction_CostAfterAction =  - storeProduct[0].Store_CostCostToSubtract;
                                    console.log("newProductTransaction:",newProductTransaction)
                                    newProductTransaction.save(function(err,xx){});

                                    //update new cost to current Items on the store
                                    
                                    storeProduct.forEach(function(storeProductItem, index){
                                        storeProductItem.Store_Cost= storeProductItem.Store_Cost - CostToSubtract;
                                        storeProductItem.save(function(err){});
                                    })

                                    //update Store_Quantity for one store document that we decreased product from 
                                    storeProduct [0].Store_Quantity -= decreaseInventoryProduct.Quantity;
                                    storeProduct [0].save(function(err){});
                                    if(index == document.DecreaseInventory_Products.length -1){
                                        resolve(true);
                                    }
                                }else{
                                    return res.send({message : "You can't decrease products that are not found in store"})
                                }
                            })
                        })
                    })
                    
                })
            }
            function returnMessage(){
                res.send({
                    message:true
                });
            }
        }
        UpdateTransactionAndStore();
           
},

getAll:(req,res)=>{
    DecreaseInventory.find({})
    .select("-DecreaseInventory_Products")
    .populate({path:"DecreaseInventory_DoneBy_User", select:"User_Name"})
    .exec((err,decreaseInventories)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(decreaseInventories) {
            return res.send(decreaseInventories)
        }else{
            return res.send({
                message:"decreaseInventories are null"
            })
        }

    })
},


getOneById:(req,res)=>{
    DecreaseInventory.findById(req.body['_id'])
    .populate({path:"DecreaseInventory_DoneBy_User", select:"User_Name"})
    .populate({path:"DecreaseInventory_Products.Product", select:"Product_Name"})
    .populate({path:"DecreaseInventory_Products.Origin_Variant", select:"ProductOrigin_Name"})

    .exec((err,decreaseInventory)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(decreaseInventory) {
            return res.send(decreaseInventory)
        }else{
            return res.send({
                message:"decreaseInventory is null"
            })
        }

    });
},

    searchDecreaseInventory: function(req,res){
        DecreaseInventory.find({ DecreaseInventory_Date : req.body.DecreaseInventory_Date })
        .populate({path:"DecreaseInventory_DoneBy_User", select:"User_Name"})
        .exec((err,decreaseInventory)=>{
            if(err){
                return res.send({
                    message:err
                })
            }else if(decreaseInventory) {
                return res.send(decreaseInventory)
            }else{
                return res.send({
                    message:"decreaseInventory is null"
                })
            }
    
        });
    }
}
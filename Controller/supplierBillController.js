var Bill = require("../Model/bill")
var Supplier = require("../Model/supplier");
var Store = require("../Model/store");
var ProductTransaction = require("../Model/product-transaction");
var hcm_product = require("../Model/product");

module.exports={
    addBill:(req,res)=>{
        const UpdateTransactionAndStore = async function() {
            var NextCode = await GetNexCode();
            var BillDocument = await  InsertIntoBills(NextCode);
            var isInserted = await saveAll(BillDocument);
            var modifySupplier = await updateSupplierFinantial(BillDocument);
            returnMessage();
            function GetNexCode(){
                return new Promise((resolve, reject) => {
                    Bill.getLastCode(function(err, BillItem) {
                        if (BillItem){
                            resolve(BillItem.Bill_Code + 1);
                        }
                        else {resolve(1)};
                    });
                })
            }

            function InsertIntoBills(NextCode) {
                return new Promise((resolve, reject) => {
                    const newBill = new Bill();
                    newBill.Bill_Code = NextCode;
                    newBill.Bill_Date = req.body.Bill_Date;
                    newBill.Bill_Note = req.body.Bill_Note
                    newBill.Bill_DoneBy_User = req.body.Bill_DoneBy_User;
                    newBill.Bill_Supplier = req.body.Bill_Supplier
                    newBill.Bill_TaxAmount = req.body.Bill_TaxAmount
                    newBill.Bill_TotalAmount = req.body.Bill_TotalAmount
                    newBill.Bill_FinalAmount = req.body.Bill_FinalAmount
                    newBill.Bill_PaymentMethod = req.body.Bill_PaymentMethod
                    newBill.Bill_Products = req.body.Bill_Products
                    newBill.save((err,billDocument)=>{
                        if(err){
                            return res.send({
                                message:err
                            })
                        }else { 
                            resolve(billDocument)
                        }
                    })
                })
            }
            
            function saveAll(document){
                return new Promise((resolve, reject) => {
                    document.Bill_Products.forEach(function(billProduct, index){
                        console.log(billProduct)
                        hcm_product.find({_id: billProduct.Product}).select("Product_SellingPrice")//we don't have this property
                        .exec(function(err,productDocument){
                            console.log(productDocument)
                            Store.find({Store_Product : billProduct.Product, Origin_Variant: billProduct.Origin_Variant, Expiration_Variant:billProduct.Expiration_Variant })
                            .exec(function(err,storeProduct){
                                //we need to add documents to product transaction model
                                var CostToAdd = billProduct.Cost; 
                                const newProductTransaction=new ProductTransaction();
                                newProductTransaction.ProductTransaction_Date = document.Bill_Date;
                                newProductTransaction.ProductTransaction_Product = billProduct.Product;
                                newProductTransaction.Origin_Variant = billProduct.Origin_Variant;
                                newProductTransaction.Expiration_Variant =billProduct.Expiration_Variant;
                                newProductTransaction.ProductTransaction_MathSign = 1;
                                newProductTransaction.ProductTransaction_Type = "Bill";
                                newProductTransaction.ProductTransaction_IncreaseInventory = document._id;
                                if(storeProduct && storeProduct.length >0){
                                    var TotalStoredQuantity = 0;
                                    storeProduct.forEach(function(storeProductItem, index){
                                        TotalStoredQuantity = TotalStoredQuantity + storeProductItem.Store_Quantity;
                                    })
                                    newProductTransaction.ProductTransaction_QuantityBeforAction = storeProduct[0].Store_Quantity;
                                    newProductTransaction.ProductTransaction_CostBeforAction = storeProduct[0].Store_Cost;
                                    newProductTransaction.ProductTransaction_SellPriceOnAction = productDocument.Product_SellingPrice;
                                    newProductTransaction.ProductTransaction_QuantityAfterAction = TotalStoredQuantity + billProduct.Quantity;
                                    CostToAdd = ((storeProduct[0].Store_Cost * TotalStoredQuantity) + (billProduct.Cost * billProduct.Quantity))/ (TotalStoredQuantity + billProduct.Quantity)//11111;//needs modification
                                    newProductTransaction.ProductTransaction_CostAfterAction = CostToAdd;
                                    newProductTransaction.save(function(err,xx){});

                                    //update new cost to current Items on the store
                                    
                                    storeProduct.forEach(function(storeProductItem, index){
                                        storeProductItem.Store_Cost=CostToAdd;
                                        storeProductItem.save(function(err){});
                                    })

                                    //insert new store for the new incoming items
                                    let newStoreProduct = new Store();
                                    newStoreProduct.Store_Product=billProduct.Product
                                    newStoreProduct.Origin_Variant=billProduct.Origin_Variant
                                    newStoreProduct.Expiration_Variant=billProduct.Expiration_Variant
                                    newStoreProduct.Store_Quantity=billProduct.Quantity
                                    newStoreProduct.Store_Cost = CostToAdd;
                                    newStoreProduct.Store_StoragePlace = null;
                                    newStoreProduct.save(function(err){});
                                    if(index == document.Bill_Products.length -1){
                                        resolve(true);
                                    }
                                }else{
                                    newProductTransaction.ProductTransaction_QuantityBeforAction = 0;
                                    newProductTransaction.ProductTransaction_CostBeforAction = 0;
                                    newProductTransaction.ProductTransaction_SellPriceOnAction = productDocument.Product_SellingPrice;
                                    newProductTransaction.ProductTransaction_QuantityAfterAction =  billProduct.Quantity;
                                    newProductTransaction.ProductTransaction_CostAfterAction = billProduct.Cost;//needs modification
                                    newProductTransaction.save(function(){})

                                    let newStoreProduct = new Store();
                                    newStoreProduct.Store_Product=billProduct.Product
                                    newStoreProduct.Origin_Variant=billProduct.Origin_Variant
                                    newStoreProduct.Expiration_Variant=billProduct.Expiration_Variant
                                    newStoreProduct.Store_Quantity=billProduct.Quantity
                                    newStoreProduct.Store_Cost=billProduct.Cost
                                    newStoreProduct.Store_StoragePlace = null;
                                    newStoreProduct.save(function(err){});
                                    if(index == document.Bill_Products.length -1){
                                        resolve(true);
                                    }
                                }
                            })
                        })
                    })
                    
                })
            }
            function updateSupplierFinantial(BillDocumant) {
                return new Promise((resolve, reject) => {
                    let updated = {
                        $push : {
                            Supplier_FinancialTransaction : {
                                SupplierFinancialTransaction_Date : BillDocumant.Bill_Date ,
                                SupplierFinancialTransaction_MathSign : 1 ,
                                SupplierFinancialTransaction_Amount  : BillDocumant.Bill_FinalAmount,
                                SupplierFinancialTransaction_Bill : BillDocumant._id,
                                SupplierFinancialTransaction_Type : "Bill"
                            }
                        }
                    };
                    Supplier.findByIdAndUpdate(BillDocumant.Bill_Supplier,updated,{upsert:true,new:true},(err,updatedSupplierDocumnet)=>{
                        if(err)
                            return res.json({ message : err});
                        else if(updatedSupplierDocumnet)   
                            resolve(true)
                        else
                            resolve(true);
                    });
                    
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
    Bill.find({})
    .populate({path :"Bill_Supplier",select : "Supplier_Name"})
    .populate({path :"Bill_DoneBy_User"})
    .exec((err,bills)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(bills) {
            return res.send(bills)
        }else{
            return res.send({
                message:"bills are null"
            })
        }

    })
},


getOneById:(req,res)=>{
    Bill.findById(req.body['_id'])
    .populate({path :"Bill_Supplier" ,select : "Supplier_Name"})
    .populate({path :"Bill_DoneBy_User"})
    .populate({path:"Bill_Products.Product", select:"Product_Name"})
    .populate({path:"Bill_Products.Origin_Variant", select:"ProductOrigin_Name"})
    .populate({path:"Bill_PaymentMethod",select : "PaymentMethod_Name"})
    .exec((err,bill)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(bill) {
            return res.send(bill)
        }else{
            return res.send({
                message:"Bill is null"
            })
        }

    })
},

searchBills: function(req,res){

    Bill.find(req.body)
    .populate({path :"Bill_Supplier",select : "Supplier_Name"})
    .populate({path :"Bill_DoneBy_User"})
    .exec((err,bills)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(bills) {
            return res.send(bills)
        }else{
            return res.send({
                 message:"bills are null"
            })
        }
    
        });
    }
}
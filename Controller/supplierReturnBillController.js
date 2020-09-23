var BillReturn = require("../Model/bill-return");
var Supplier = require("../Model/supplier");

module.exports={
    addBill:(req,res)=>{
        BillReturn.getLastCode(function(err, returnedBill) {
            if (returnedBill) InsertIntoReturnedBill(returnedBill.BillReturn_Code + 1);
            else InsertIntoReturnedBill(1);
        });
        function InsertIntoReturnedBill(NextCode) {
            let newReturnedBill=new BillReturn();
            newReturnedBill.BillReturn_Code =NextCode;
            newReturnedBill.BillReturn_Date = req.body.BillReturn_Date;
            newReturnedBill.BillReturn_Note=req.body.BillReturn_Note
            newReturnedBill.BillReturn_DoneBy_User=req.body.BillReturn_DoneBy_User;
            newReturnedBill.Bill_Supplier=req.body.Bill_Supplier
            newReturnedBill.BillReturn_Products=req.body.BillReturn_Products
            newReturnedBill.save((err,returnedBillDocument)=>{
                if(err){
                    return res.send({
                        message:err
                    })
                }else {
                     //we need to update Supplier_FinancialTransaction in supplier model
                    let updated = {
                        $push : {
                            Supplier_FinancialTransaction : {
                                SupplierFinancialTransaction_Date : returnedBillDocument.BillReturn_Date ,
                                SupplierFinancialTransaction_MathSign : -1 ,
                                SupplierFinancialTransaction_Amount  : req.body.Bill_TotalAmount,
                                SupplierFinancialTransaction_BillReturn : returnedBillDocument._id,
                                SupplierFinancialTransaction_Type : "Return Bill"
                            }
                        }
                    };
                    Supplier.findByIdAndUpdate(returnedBillDocument.Bill_Supplier,updated,{upsert:true,new:true},(err,updatedSupplierDocumnet)=>{
                        if(err)
                            return res.json({ message : err});
                        else if(updatedSupplierDocumnet)   
                            return res.json({ message:true }) ;
                        else
                            return res.json({ message: "updatedSupplierDocumnet is null" });
                    });
                
                }
            })
        }

           
},



getAll:(req,res)=>{
    BillReturn.find({})
    .populate({path :"Bill_Supplier" ,select : "Supplier_Name" })
    .populate({path :"BillReturn_DoneBy_User"})
    .exec((err,increaseInventories)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(increaseInventories) {
            return res.send(increaseInventories)
        }else{
            return res.send({
                message:"increaseInventories are null"
            })
        }

    })
},


getOneById:(req,res)=>{
    BillReturn.findById(req.body['_id'])
    .populate({path :"Bill_Supplier",select : "Supplier_Name"})
    .populate({path :"BillReturn_DoneBy_User"})
    .populate({path:"BillReturn_Products.Product", select:"Product_Name"})
    .populate({path:"BillReturn_Products.Origin_Variant", select:"ProductOrigin_Name"})

    .exec((err,returnedBill)=>{
        if(err){
            return res.send({
                message:err
            })
        }else if(returnedBill) {
            return res.send(returnedBill)
        }else{
            return res.send({
                message:"returnedBill is null"
            })
        }

    })
},

searchBills: function(req,res){

    BillReturn.find(req.body)
    .populate({path :"Bill_Supplier"})
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
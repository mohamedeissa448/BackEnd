var Payment = require("../Model/payment");
var Purchasing = require("../Model/purchasing");

module.exports = {
    addPayment: function(req, res) {
      const newPayment = new Payment(req.body.paymentData);
      newPayment.save((err, paymentDocument) => {
        if (err) {
          return res.send({ message: err });
        } else if (paymentDocument) {
          var Amount_Of_Paying = 0;
          if(paymentDocument.Payment_Method_Name == "cash"){
            Amount_Of_Paying = paymentDocument.Cash_Payment.Amount_Of_Paying;
          }else if(paymentDocument.Payment_Method_Name == "cheque"){
            Amount_Of_Paying = paymentDocument.Cheque_Payment.Amount_Of_Paying;
          }
          //we need to update Total_Paid_Price in purchasing model
          Purchasing.findById(req.body.paymentData.Product_Purchasing_ID,function(err,purchaseDocument){
            if (err) {
              return res.send({ message: err });
            } else if (purchaseDocument) {
              purchaseDocument.Total_Paid_Price += Amount_Of_Paying;
              purchaseDocument.save(function(err,updatedpurchaseDocument){
                if (err) {
                  return res.send({ message: err });
                } else if (updatedpurchaseDocument) {
                  return res.send({ message: true });
                }
              })
            }
            else {
              return res.send({ message: "couldn't find a matched purchasing " });
            }

          })
        } else {
          return res.send({ message: "couldn't create a new payment " });
        }
      });
  },

  addPaymentsForOneBillOrMore: function(req,res){
    Purchasing.find({Product_Incoming_Bill_Number : {$in : req.body.paymentData.BillsNumbers}})
    .select('_id Product_Incoming_Bill_Number Total_Paid_Price Total_Price_After_Taxes')
    .exec( function(err,purchaseDocuments){
      if (err) {
        return res.send({ message1: err });
      } else if (purchaseDocuments) {
        console.log("purchaseDocuments",purchaseDocuments);
        var Total_Bill_Price_After_Taxes = 0;
        purchaseDocuments.forEach((element)=>{
          Total_Bill_Price_After_Taxes += element.Total_Price_After_Taxes;
        })
        var elementsExtraPaidMoney =[];
        var totalAmountComingFromFrontEnd = req.body.paymentData.Amount_Of_Paying ;
        purchaseDocuments.forEach((element,index)=>{
          var elementPricePercentageOfAllBill = (element.Total_Price_After_Taxes / Total_Bill_Price_After_Taxes)  ;
          console.log("elementPricePercentageOfAllBill",elementPricePercentageOfAllBill)
          elementsExtraPaidMoney.push(elementPricePercentageOfAllBill * totalAmountComingFromFrontEnd) ;
          console.log("index",index)
          console.log("elementsExtraPaidMoney",elementsExtraPaidMoney)
          console.log("elementsExtraPaidMoney[index]",elementsExtraPaidMoney[index])
          element.Total_Paid_Price += elementsExtraPaidMoney[index];
         /* if( element.Total_Paid_Price > element.Total_Price_After_Taxes){
            element.Total_Paid_Price = element.Total_Price_After_Taxes;
          }*/
          element.save(function(err,updatedPurchaseDocument){
            if (err) {
              return res.send({ message2: err });
            }else if(updatedPurchaseDocument){
              req.body.paymentData.Cash_Payment ? req.body.paymentData.Cash_Payment.Amount_Of_Paying = elementsExtraPaidMoney[index]: null;
              req.body.paymentData.Cheque_Payment ? req.body.paymentData.Cheque_Payment.Amount_Of_Paying = elementsExtraPaidMoney[index]: null;
              req.body.paymentData.Product_Purchasing_ID = element._id;
              const newPayment = new Payment(req.body.paymentData);
              newPayment.save(function(err,paymentDoc){
                if (err) {
                  return res.send({ message3: err });
                }else if(paymentDoc){
                  if(index == purchaseDocuments.length -1){
                    return res.send({ message: true});
                  }
                }
                else{
                  return res.send({ message: "couldn't add a payment document " });
                }
              })
            }else{
              return res.send({ message: "couldn't update an existing purchase document " });
            }
          })
        })
      }
      else{
        return res.send({ message: "couldn't find a matched purchasing " });
      }
    })
   
  },

  getAllPaymentsForSpecificProductPurchasing: function(req,res){
    Payment.find({Product_Purchasing_ID:req.body.Product_Purchasing_ID})
    .populate({path:"user",select:"User_Code User_Name"})
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("payments not found");
      }
    });
  },

  updatePaymentsForAspecificPurchasingProduct: function(req,res){
    var Total_Paid_Price=0;//we update payment documents first then,we need to update Total_Paid_Price in purchase model,so we initialize it with 0,
    //and add amount of money of cashes and cheques to it 
    req.body.cashPayments.forEach((cashElement,outsideIndex)=>{
      Total_Paid_Price +=cashElement.Cash_Payment.Amount_Of_Paying;
      var updated={
        $set:{
          Cash_Payment:cashElement.Cash_Payment
        }
      }
      saveCashes();
     
      function saveCashes(){
        Payment.findByIdAndUpdate(cashElement._id,updated,function(err,doc){
          if (err) {
            return res.send({ message: err });
          } else if (doc) {
           if(outsideIndex == req.body.cashPayments.length -1 ) {
             //we need to update cheques also
             req.body.chequePayments.forEach((chequeElement,insideIndex)=>{
              Total_Paid_Price +=chequeElement.Cheque_Payment.Amount_Of_Paying;
              var updated={
                $set:{
                  Cheque_Payment:chequeElement.Cheque_Payment
                }
              }
            saveCheques();
            function saveCheques(){
              Payment.findByIdAndUpdate(chequeElement._id,updated,function(err,doc){
                if (err) {
                  return res.send({ message: err });
                } else if (doc) {
                 if(insideIndex == req.body.chequePayments.length -1 ){
                   //we need to update Total_Paid_Price in purchase model
                  var Product_Purchasing_ID;
                   if(req.body.cashPayments.length > 0){
                     Product_Purchasing_ID =req.body.cashPayments[0].Product_Purchasing_ID
                   }else if(req.body.chequePayments.length > 0){
                    Product_Purchasing_ID =req.body.chequePayments[0].Product_Purchasing_ID
                  }
                  Purchasing.findByIdAndUpdate(Product_Purchasing_ID,{$set:{Total_Paid_Price:Total_Paid_Price}},function(err,updatedPurchaseDoc){
                    if (err) {
                      return res.send({ message: err });
                    } else if (updatedPurchaseDoc) {
                      return res.send({ message: true });
                    }else{
                      return res.send({ message: "purchase document not found" });
                    }
                  })
                  
                 } 
                } else {
                  return res.send("doc not found");
                }
              })
            }
          });
           }
          } else {
            return res.send("doc not found");
          }
        })
      }
    });
  


  },

  
};

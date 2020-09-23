var Receivable = require("../Model/receivable");
var Sale = require("../Model/sale");
var Receivable = require("../Model/receivable")
module.exports = {
    addReceivable: function(req, res) {
      const newReceivable = new Receivable(req.body.getPaidData);
      newReceivable.save((err, receivableDocument) => {
        if (err) {
          return res.send({ message: err });
        } else if (receivableDocument) {
          var Amount_Of_Paying = 0;
          if(receivableDocument.Payment_Method_Name == "cash"){
            Amount_Of_Paying = receivableDocument.Cash_Payment.Amount_Of_Paying;
          }else if(receivableDocument.Payment_Method_Name == "cheque"){
            Amount_Of_Paying = receivableDocument.Cheque_Payment.Amount_Of_Paying;
          }
          //we need to update Total_Receivable_Price in sale model
          Sale.findById(req.body.getPaidData.Product_Selling_ID,function(err,saleDocument){
            if (err) {
              return res.send({ message: err });
            } else if (saleDocument) {
              saleDocument.Total_Receivable_Price += Amount_Of_Paying;
              saleDocument.save(function(err,updatedsaleDocument){
                if (err) {
                  return res.send({ message: err });
                } else if (updatedsaleDocument) {
                  return res.send({ message: true });
                }
              })
            }
            else {
              return res.send({ message: "couldn't find a matched sale " });
            }

          })
        } else {
          return res.send({ message: "couldn't create a new receivable " });
        }
      });
  },

  addReceivablesForOneBillOrMore: function(req,res){
    Sale.find({Product_OutGoing_Bill_Number : {$in : req.body.getPaidData.BillsNumbers}})
    .select('_id Product_OutGoing_Bill_Number Total_Receivable_Price Total_Price_After_Taxes')
    .exec( function(err,salesDocuments){
      if (err) {
        return res.send({ message1: err });
      } else if (salesDocuments) {
        console.log("salesDocuments",salesDocuments);
        var Total_Bill_Price_After_Taxes = 0;
        salesDocuments.forEach((element)=>{
          Total_Bill_Price_After_Taxes += element.Total_Price_After_Taxes;
        })
        var elementsExtraPaidMoney =[];
        var totalAmountComingFromFrontEnd = req.body.getPaidData.Amount_Of_Paying ;
        salesDocuments.forEach((element,index)=>{
          var elementPricePercentageOfAllBill = (element.Total_Price_After_Taxes / Total_Bill_Price_After_Taxes)  ;
          console.log("elementPricePercentageOfAllBill",elementPricePercentageOfAllBill)
          elementsExtraPaidMoney.push(elementPricePercentageOfAllBill * totalAmountComingFromFrontEnd) ;
          console.log("index",index)
          console.log("elementsExtraPaidMoney",elementsExtraPaidMoney)
          console.log("elementsExtraPaidMoney[index]",elementsExtraPaidMoney[index])
          element.Total_Receivable_Price += elementsExtraPaidMoney[index];
         /* if( element.Total_Receivable_Price > element.Total_Price_After_Taxes){
            element.Total_Receivable_Price = element.Total_Price_After_Taxes;
          }*/
          element.save(function(err,updatedSaleDocument){
            if (err) {
              return res.send({ message2: err });
            }else if(updatedSaleDocument){
              req.body.getPaidData.Cash_Payment ? req.body.getPaidData.Cash_Payment.Amount_Of_Paying = elementsExtraPaidMoney[index]: null;
              req.body.getPaidData.Cheque_Payment ? req.body.getPaidData.Cheque_Payment.Amount_Of_Paying = elementsExtraPaidMoney[index]: null;
              req.body.getPaidData.Product_Selling_ID = element._id;
              const newReceivable = new Receivable(req.body.getPaidData);
              newReceivable.save(function(err,receivableDoc){
                if (err) {
                  return res.send({ message3: err });
                }else if(receivableDoc){
                  if(index == salesDocuments.length -1){
                    return res.send({ message: true});
                  }
                }
                else{
                  return res.send({ message: "couldn't add a receivable document " });
                }
              })
            }else{
              return res.send({ message: "couldn't update an existing receivable document " });
            }
          })
        })
      }
      else{
        return res.send({ message: "couldn't find a matched sale " });
      }
    })
  },

  getAllReceivablesForSpecificProductSelling: function(req,res){
    Receivable.find({Product_Selling_ID:req.body.Product_Selling_ID})
    .populate({path:"user",select:"User_Code User_Name"})
    .exec(function(err, documents) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (documents) {
        res.send(documents);
      } else {
        
        res.send("receivables not found");
      }
    });
  }

  
};

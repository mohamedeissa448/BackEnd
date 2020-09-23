var InventoryOperation = require('../Model/inventory-op');


module.exports = {
    addInventoryOperation: function (req,res){
        InventoryOperation.getLastCode(function(err,inventoryOperation){
            if (inventoryOperation) InsertIntoInventoryOperation(inventoryOperation.Inventory_Operation_Code + 1);
        else InsertIntoInventoryOperation(1);
        });
        function InsertIntoInventoryOperation (nextCode){
            let newInventoryOperation =new InventoryOperation ();
            newInventoryOperation.Inventory_Operation_Code = nextCode ;
            newInventoryOperation.Inventory_Operation_Date = req.body.Inventory_Operation_Date;
            newInventoryOperation.Inventory_Operation_Info = req.body.Inventory_Operation_Info;
            newInventoryOperation.Inventory_Operation_Related_To_Company = req.body.Inventory_Operation_Related_To_Company;
            newInventoryOperation.Inventory_Operation_Related_To_Branch = req.body.Inventory_Operation_Related_To_Branch; 
            newInventoryOperation.Inventory_Operation_Related_To_Inventory = req.body.Inventory_Operation_Related_To_Inventory;
            newInventoryOperation.Inventory_Operation_Products = req.body.Inventory_Operation_Products;

            newInventoryOperation.save(function(err, doneadd) {
                if (err) {
                  return res.send({ message: err });
                } else {
                    return res.send({ message: true });
                }
              });
        }
        
    },
    editInventoryOperationByCode: function (req,res){
        let query ={ Inventory_Code : req.body.Inventory_Code }
        let updated = {
            $set : {
                Inventory_Operation_Date : req.body.Inventory_Operation_Date,
                Inventory_Operation_Info : req.body.Inventory_Operation_Info,
                Inventory_Operation_Related_To_Company : req.body.Inventory_Operation_Related_To_Company,
                Inventory_Operation_Related_To_Branch : req.body.Inventory_Operation_Related_To_Branch, 
                Inventory_Operation_Related_To_Inventory  : req.body.Inventory_Operation_Related_To_Inventory,
                Inventory_Operation_Products : req.body.Inventory_Operation_Products

            }
        };
        InventoryOperation.findOneAndUpdate(query,updated,{upsert: true ,new : true},function(err,updatedDocument){
            if(err) return res.send({ message : err });
            else
            return res.send({ message : true })
        })
    },
    getAll: function (req,res){
        InventoryOperation.find()
        .populate({path : "Inventory_Operation_Related_To_Company"})
        .populate({path : "Inventory_Operation_Related_To_Branch"})
        .populate({path : "Inventory_Operation_Related_To_Inventory"})

        .exec(function(err,inventoryOperations){
            if(err) return res.send({ message : err });
            else
            return res.send(inventoryOperations)
        })
    },

    searchInventoryOperation : function (req,res){
        var propertySearched =req.body.propertySearched ;
        let filterdObject = {  };
        filterdObject[propertySearched] =  req.body.searchField;
        console.log("filterdObject",filterdObject)
        InventoryOperation.find(filterdObject)
        .populate({path : "Inventory_Operation_Related_To_Company"})
        .populate({path : "Inventory_Operation_Related_To_Branch"})
        .populate({path : "Inventory_Operation_Related_To_Inventory"})
        .exec(function(err,inventoryOperations){
            if(err) return res.send({ message : err });
            else
            return res.send(inventoryOperations)
        })
    },
    
};

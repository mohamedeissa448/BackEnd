var Inventory = require('../Model/inventory');


module.exports = {
    addInventory: function (req,res){
        Inventory.getLastCode(function(err,inventory){
            if (inventory) InsertIntoInventory(inventory.Inventory_Code + 1);
        else InsertIntoInventory(1);
        });
        function InsertIntoInventory (nextCode){
            let newInventory =new Inventory ();
            newInventory.Inventory_Code = nextCode ;
            newInventory.Inventory_Name = req.body.Inventory_Name;
            newInventory.Inventory_Location = req.body.Inventory_Location;
            newInventory.Inventory_Related_To_Company = req.body.Inventory_Related_To_Company;
            newInventory.Inventory_Related_To_Branch = req.body.Inventory_Related_To_Branch; 
            newInventory.Inventory_Keeper = req.body.Inventory_Keeper;

            newInventory.save(function(err, doneadd) {
                if (err) {
                  return res.send({ message: err });
                } else {
                    return res.send({ message: true });
                }
              });
        }
        
    },
    editInventoryByCode: function (req,res){
        let query ={ Inventory_Code : req.body.Inventory_Code }
        let updated = {
            $set : {
                Inventory_Name : req.body.Inventory_Name,
                Inventory_Location : req.body.Inventory_Location,
                Inventory_Related_To_Company : req.body.Inventory_Related_To_Company,
                Inventory_Related_To_Branch : req.body.Inventory_Related_To_Branch, 
                Inventory_Keeper  : req.body.Inventory_Keeper
            }
        };
        Inventory.findOneAndUpdate(query,updated,{upsert: true ,new : true},function(err,updatedDocument){
            if(err) return res.send({ message : err });
            else
            return res.send({ message : true })
        })
    },
    getAll: function (req,res){
        Inventory.find()
        .populate({path : "Inventory_Related_To_Branch"})
        .populate({path : "Inventory_Related_To_Company"})
        .exec(function(err,branches){
            if(err) return res.send({ message : err });
            else
            return res.send(branches)
        })
    },

    searchInventory : function (req,res){
        var propertySearched =req.body.propertySearched ;
        let filterdObject = {  };
        filterdObject[propertySearched] =  req.body.searchField;
        if(propertySearched == 'Inventory_Name')
        filterdObject[propertySearched] = { $regex: new RegExp('.*' +req.body.searchField+ '.*', "i") }
        console.log("filterdObject",filterdObject)
        Inventory.find(filterdObject)
        .populate({path : "Inventory_Related_To_Branch"})
        .populate({path : "Inventory_Related_To_Company"})
        .exec(function(err,inventories){
            if(err) return res.send({ message : err });
            else
            return res.send(inventories)
        })
    },
    
};

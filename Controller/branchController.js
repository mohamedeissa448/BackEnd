var Branch = require('../Model/branch');



module.exports = {
    addBranch: function (req,res){
        Branch.getLastCode(function(err,branch){
            if (branch) InsertIntoBranch(branch.Branch_Code + 1);
        else InsertIntoBranch(1);
        });
        function InsertIntoBranch (nextCode){
            let newBranch =new Branch ();
            newBranch.Branch_Code = nextCode ;
            newBranch.Branch_Name = req.body.Branch_Name;
            newBranch.Branch_Location = req.body.Branch_Location;
            newBranch.Branch_Type_Of_Business = req.body.Branch_Type_Of_Business;
            newBranch.Branch_Accountant = req.body.Branch_Accountant;
            newBranch.Branch_Related_To_Company = req.body.Branch_Related_To_Company; 
            newBranch.Branch_Has_Inventories = req.body.Branch_Has_Inventories;

            newBranch.save(function(err, doneadd) {
                if (err) {
                  return res.send({ message: err });
                } else {
                    return res.send({ message: true });
                }
              });
        }
        
    },
    editBranchByCode: function (req,res){
        let query ={ Branch_Code : req.body.Branch_Code }
        let updated = {
            $set : {
                Branch_Name : req.body.Branch_Name,
                Branch_Location : req.body.Branch_Location,
                Branch_Type_Of_Business : req.body.Branch_Type_Of_Business,
                Branch_Accountant : req.body.Branch_Accountant,
                Branch_Related_To_Company : req.body.Branch_Related_To_Company, 
                Branch_Has_Inventories  : req.body.Branch_Has_Inventories
            }
        };
        Branch.findOneAndUpdate(query,updated,{upsert: true ,new : true},function(err,updatedDocument){
            if(err) return res.send({ message : err });
            else
            return res.send({ message : true })
        })
    },
    getAll: function (req,res){
        Branch.find()
        .populate({path : "Branch_Related_To_Company"})
        .populate({path : "Branch_Type_Of_Business"})
        .exec(function(err,branches){
            if(err) return res.send({ message : err });
            else
            return res.send(branches)
        })
    },

    searchBranch : function (req,res){
        var propertySearched =req.body.propertySearched ;
        let filterdObject = {  };
        filterdObject[propertySearched] =  req.body.searchField;
        if(propertySearched == 'Branch_Name')
        filterdObject[propertySearched] = { $regex: new RegExp('.*' +req.body.searchField+ '.*', "i") }
        console.log("filterdObject",filterdObject)
        Branch.find(filterdObject)
        .populate({path : "Branch_Related_To_Company"})
        .populate({path : "Branch_Type_Of_Business"})
        .exec(function(err,branches){
            if(err) return res.send({ message : err });
            else
            return res.send(branches)
        })
    },
    
};

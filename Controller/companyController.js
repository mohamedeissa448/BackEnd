var Company = require('../Model/company');



module.exports = {
    addCompany: function (req,res){
        Company.getLastCode(function(err,company){
            if (company) InsertIntoCompany(company.Company_Code + 1);
        else InsertIntoCompany(1);
        });
        function InsertIntoCompany (nextCode){
            let newCompany =new Company ();
            newCompany.Company_Code = nextCode ;
            newCompany.Company_Name = req.body.Company_Name;
            newCompany.Company_Telephone = req.body.Company_Telephone;
            newCompany.Company_WebSite = req.body.Company_WebSite;
            newCompany.Company_Email = req.body.Company_Email;
            newCompany.Company_Info  = req.body.Company_Info ; 

            newCompany.save(function(err, doneadd) {
                if (err) {
                  return res.send({ message: err });
                } else {
                    return res.send({ message: true });
                }
              });
        }
        
    },
    editCompanyByCode: function (req,res){
        let query ={ Company_Code : req.body.Company_Code }
        let updated = {
            $set : {
                Company_Name : req.body.Company_Name,
                Company_Telephone : req.body.Company_Telephone,
                Company_WebSite : req.body.Company_WebSite,
                Company_Email : req.body.Company_Email,
                Company_Info  : req.body.Company_Info , 
            }
        };
        Company.findOneAndUpdate(query,updated,{upsert: true ,new : true},function(err,updatedDocument){
            if(err) return res.send({ message : err });
            else
            return res.send({ message : true })
        })
    },
    getAll: function (req,res){
        Company.find()
        .exec(function(err,companies){
            if(err) return res.send({ message : err });
            else
            return res.send(companies)
        })
    },

    searchCompany : function (req,res){
        var propertySearched =req.body.propertySearched ;
        let filterdObject = {  };
        filterdObject[propertySearched] =  req.body.searchField;
        if(propertySearched == 'Company_Name')
        filterdObject[propertySearched] = { $regex: new RegExp('.*' +req.body.searchField+ '.*', "i") }
        
        console.log("filterdObject",filterdObject)
        Company.find(filterdObject)
        .exec(function(err,companies){
            if(err) return res.send({ message : err });
            else
            return res.send(companies)
        })
    },
    
};

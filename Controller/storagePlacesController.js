var StoragePlace = require("../Model/storage-places")

module.exports={
    addStoragePlace:(req,res)=>{
    
        const newStoragePlace=new StoragePlace();
        newStoragePlace.StoragePlace_Identifier = req.body.StoragePlace_Identifier;
        newStoragePlace.StoragePlace_DisplayName = req.body.StoragePlace_DisplayName;
        newStoragePlace.StoragePlace_Parent = req.body.StoragePlace_Parent;
        newStoragePlace.StoragePlace_SubLevelTitle = req.body.StoragePlace_SubLevelTitle;
        newStoragePlace.save((err,document)=>{
            if(err){
                return res.send({
                     message:err
                });
            }else {
                return res.send({
                    message:true
                });
            }
        })
           
    },

    editStoragePlaceById:(req,res)=>{
        var updatedStoragePlace={}
        updatedStoragePlace.StoragePlace_Identifier = req.body.updatedStoragePlace.StoragePlace_Identifier;
        updatedStoragePlace.StoragePlace_DisplayName = req.body.updatedStoragePlace.StoragePlace_DisplayName;
        updatedStoragePlace.StoragePlace_Parent = req.body.updatedStoragePlace.StoragePlace_Parent;
        updatedStoragePlace.StoragePlace_SubLevelTitle = req.body.updatedStoragePlace.StoragePlace_SubLevelTitle;

        StoragePlace.findByIdAndUpdate(req.body['_id'],updatedStoragePlace,{new: true},
            (err,storagePlace)=>{
                if(err){
                    return res.send({
                        message:err
                    })
                }else if(storagePlace) {
                    return res.send({
                        message:true,
                        data:{ newStoragePlace:storagePlace }
                    })
                }else{
                    return res.send({
                        message:"updated storagePlace is null"
                    })
                }
            })
    },

    getAll:(req,res)=>{
        StoragePlace.find({}).exec((err,storagePlaces)=>{
            if(err){
                return res.send({
                    message:err
                })
            }else if(storagePlaces) {
                return res.send(storagePlaces)
            }else{
                return res.send({
                    message:"storagePlaces are null"
                })
            }

        })
    },


    getOneById:(req,res)=>{     
        StoragePlace.findById(req.body['_id'])
        .populate({path:"StoragePlace_Parent"})

        .exec((err,storagePlace)=>{
            if(err){
                return res.send({
                    message:err
                })
            }else if(storagePlace) {
                return res.send(storagePlace)
            }else{
                return res.send({
                    message:"storagePlace is null"
                })
            }

        })
    },
}
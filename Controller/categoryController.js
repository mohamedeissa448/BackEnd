var Category = require('../Model/category');



module.exports = {
	
		getCategories:function(req,res){
			Category.find({}, function(err, category) {
				if (err){
		    		res.send(err);
		    	} else if(category) {
		    		res.send(category);
				}else{
		    		res.send("no Categories found");
				}
			})
		},

		getCategory:function(req,res){
			Category.findOne({Category_ID:Number(req.body.Category_ID)}, function(err, category) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(category) {
		    		res.send(category);
				}else{
		    		res.send("not Category");
				}
			})
		},
		getCategoryByname:function(request, response) {
			var Searchquery = request.body.searchField;
			Category.find({Category_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, category) {
				if (err){
		    		return response.send({
						message: err
					});
		    	}
		    	if (category.length == 0) {
					return response.send({
						message: 'No Category Found !!'
					});
	        	} else {
					return response.send(category);
				}
			})
		}, 
		// GetNextCode:function(req,res){
		// 	Category.getLastCode(function(err,category){
		// 		if (category) {
		// 			console.log(category)
		// 			res.send({
		// 				nextCode: category.Category_ID+1
		// 			})
		// 		}
		// 		else
		// 			res.send({
		// 				nextCode: 1
		// 			});
		// 	})
		// },

		addCategory:function(request,res){
			Category.getLastCode(function(err,category){
				if (category) 
					InsertIntoCategory(category.Category_ID+1);
				else
					InsertIntoCategory(1);
			});
			function InsertIntoCategory(NextCode){
				var newCategory = new Category();
				newCategory.Category_ID    	 		= NextCode;
				newCategory.Category_Name   	 	= request.body.Category_Name;
				newCategory.Category_Description   	= request.body.Category_Description;
				newCategory.Category_IsActive	 	= 1;
				
				newCategory.save(function(error, doneadd){
					if(error){
						return res.send({
							message: error
						});
					}
					else{
						return res.send({
							message: true
						});
					}
				});
			}
		},
		
		editCategory:function(request,res){

			var myquery = { Category_ID: request.body.Category_ID }; 
			var newvalues = { 
				Category_Name	 		: request.body.Category_Name,
				Category_IsActive	 	: request.body.Category_IsActive,
				Category_Description	: request.body.Category_Description,

			 };
			 Category.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Category not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},
		getCategoriesNumber:function(req,res){
			Category.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		}
}
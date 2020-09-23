var SupplierType 	= require('../Model/lut_supplier_types');
var SupplierClass 	= require('../Model/lut_classes');
var Country 		= require('../Model/countries');
var PaymentMethod 	= require('../Model/lut_payment_methods');
var WayOfDelivery 	= require('../Model/lut_ways_of_delivery');
var Form 			= require('../Model/lut_form');
var Packing 		= require('../Model/lut_packing');
var ProductCategory = require('../Model/lut_product_category');
var ReleaseType 	= require('../Model/lut_release_type');
var StorageType 	= require('../Model/lut_storage_type');
var SellingArea 	= require('../Model/lut_sell_area');
var Weight 			= require('../Model/lut_weight');
var Concentration 	= require('../Model/lut_concentration');
var Certificate 	= require('../Model/lut_certificate');
var TemperatureUnit = require('../Model/lut_temperature_unit');
var TypeOfBusiness 	= require('../Model/lut_Type_of_business');
var OrigintVariant = require("../Model/lut-origins-variant");
var ProductUnit    =  require("../Model/lut-product-unit")




module.exports = {
	/******************country ***********/
		getCountries:function(request,res){
			Country.find({})
			.select('Country_Code Country_Name Country_IsActive Country_Tcode')
			.exec(function(err, ctry) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(ctry) {
		    		res.send(ctry);
				}else{
		    		res.send("no Country");
				}
			})
		},
		getCountriesByName:function(request,res){
			var Searchquery = request.body.searchField;
			Country.find({Country_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('Country_Code Country_Name Country_IsActive Country_Tcode')
			.exec(function(err, ctry) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(ctry) {
		    		res.send(ctry);
				}else{
		    		res.send("no Country");
				}
			})
		},
		addCountry:function(request,res){
			Country.getLastCode(function(err,country){
				if (country) 
					InsertIntoCountry(country.Country_Code+1);
				else
					InsertIntoCountry(1);
			});

			function InsertIntoCountry(NextCode){
				var newCountry 	= new Country();

				newCountry.Country_Code    	 = NextCode;
				newCountry.Country_Name   	 = request.body.Country_Name;
				newCountry.Country_IsActive	 = 1;
				newCountry.Country_Tcode	 = request.body.Country_Tcode;
				
				newCountry.save(function(error, doneadd){
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

		editCountry:function(request,res){

			var myquery = { Country_Code: request.body.Country_Code }; 
			var newvalues = { 
				Country_Name	 		: request.body.Country_Name,
				Country_IsActive	 	: request.body.Country_IsActive,
				Country_Tcode	 		: request.body.Country_Tcode,

			 };
			Country.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Country not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},
	
	/****************** Supplier Types ***********/

		getSupplierTypes:function(request,res){
			SupplierType.find({})
			.select('SupplierType_Code SupplierType_Name SupplierType_Description SupplierType_IsActive')
			.exec(function(err, supptype) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(supptype) {
		    		res.send(supptype);
				}else{
		    		res.send("no data");
				}
			})
		},
		getSupplierTypesNumber:function(req,res){
			SupplierType.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},
		getSupplierTypesByName:function(request,res){
			var Searchquery = request.body.searchField;
			SupplierType.find({SupplierType_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('SupplierType_Code SupplierType_Name SupplierType_Description SupplierType_IsActive')
			.exec(function(err, supptype) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(supptype) {
		    		res.send(supptype);
				}else{
		    		res.send("no data");
				}
			})
		},

		addSupplierType:function(request,res){
			SupplierType.getLastCode(function(err,suppliertype){
				if (suppliertype) 
					InsertIntoSupplierType(suppliertype.SupplierType_Code+1);
				else
					InsertIntoSupplierType(1);
			});

			function InsertIntoSupplierType(NextCode){

				var newSupplierType = new SupplierType();
				newSupplierType.SupplierType_Code    	 = NextCode;
				newSupplierType.SupplierType_Name   	 = request.body.SupplierType_Name;
				newSupplierType.SupplierType_Description = request.body.SupplierType_Description;
				newSupplierType.SupplierType_IsActive	 = 1;
				
				newSupplierType.save(function(error, doneadd){
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

		editSupplierType:function(request,res){

			var myquery = { SupplierType_Code: request.body.SupplierType_Code }; 
			var newvalues = { 
				SupplierType_Name	 		: request.body.SupplierType_Name,
				SupplierType_Description	: request.body.SupplierType_Description,
				SupplierType_IsActive	 	: request.body.SupplierType_IsActive,

			 };
			SupplierType.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Supplier Type not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Supplier Class ***********/

		getClasses:function(request,res){
			SupplierClass.find({})
			.select('Class_Code Class_Name Class_Description Class_IsActive')
			.exec(function(err, suplierclass) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(suplierclass) {
		    		res.send(suplierclass);
				}else{
		    		res.send("no data");
				}
			})
		},
		getClassesNumber:function(req,res){
			SupplierClass.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},

		addSupplierClass:function(request,res){
			SupplierClass.getLastCode(function(err,supplierclass){
				if (supplierclass) 
					InsertIntoSupplierClass(supplierclass.Class_Code+1);
				else
					InsertIntoSupplierClass(1);
			});

			function InsertIntoSupplierClass(NextCode){

				var newSupplierClass = new SupplierClass();
				newSupplierClass.Class_Code    		 = NextCode;
				newSupplierClass.Class_Name   	 	 = request.body.Class_Name;
				newSupplierClass.Class_Description   = request.body.Class_Description;
				newSupplierClass.Class_IsActive		 = 1;
				
				newSupplierClass.save(function(error, doneadd){
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

		editSupplierClass:function(request,res){

			var myquery = { Class_Code: request.body.Class_Code }; 
			var newvalues = { 
				Class_Name	 		: request.body.Class_Name,
				Class_Description	: request.body.Class_Description,
				Class_IsActive	 	: request.body.Class_IsActive,

			 };
			SupplierClass.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Supplier Class not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},
		getClassByName:function(request, response) {
			var Searchquery = request.body.searchField;
			SupplierClass.find({Class_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, foundclass) {
				if (err){
		    		return response.send({
						message: err
					});
		    	}
		    	if (foundclass.length == 0) {
					return response.send({
						message: 'No Class Found !!'
					});
	        	} else {
					return response.send(foundclass);
				}
			})
		}, 
	
	/****************** Paymnet Methods ***********/
		
		getPaymentMethods:function(request,res){
			PaymentMethod.find({})
			.select('PaymentMethod_Code PaymentMethod_Name PaymentMethod_Description PaymentMethod_IsActive')
			.exec(function(err, paymentMethod) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(paymentMethod) {
		    		res.send(paymentMethod);
				}else{
		    		res.send("no data");
				}
			})
		},
		getPaymentMethodsByName:function(request,res){
			var Searchquery = request.body.searchField;
			PaymentMethod.find({PaymentMethod_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('PaymentMethod_Code PaymentMethod_Name PaymentMethod_Description PaymentMethod_IsActive')
			.exec(function(err, paymentMethod) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(paymentMethod) {
		    		res.send(paymentMethod);
				}else{
		    		res.send("no data");
				}
			})
		},

		addPaymentMethod:function(request,res){

			PaymentMethod.getLastCode(function(err,paymentmethod){
				if (paymentmethod) 
					InsertIntoPaymentMethod(paymentmethod.PaymentMethod_Code+1);
				else
					InsertIntoPaymentMethod(1);
			});	

			function InsertIntoPaymentMethod(NextCode){

				var newPaymentMethod = new PaymentMethods();
				newPaymentMethod.PaymentMethod_Code    		 = NextCode;
				newPaymentMethod.PaymentMethod_Name   	 	 = request.body.PaymentMethod_Name;
				newPaymentMethod.PaymentMethod_Description   = request.body.PaymentMethod_Description;
				newPaymentMethod.PaymentMethod_IsActive		 = 1;
				
				newPaymentMethod.save(function(error, doneadd){
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

		editPaymentMethod:function(request,res){

			var myquery = { PaymentMethod_Code: request.body.PaymentMethod_Code }; 
			var newvalues = { 
				PaymentMethod_Name	 		: request.body.PaymentMethod_Name,
				PaymentMethod_Description	: request.body.PaymentMethod_Description,
				PaymentMethod_IsActive	 	: request.body.PaymentMethod_IsActive,

			 };
			PaymentMethod.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Payment Method not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Ways Of Delivery ***********/

		getWaysOfDelivery:function(request,res){
			WayOfDelivery.find({})
			.select('WayOfDelivary_Code WayOfDelivary_Name WayOfDelivary_Description WayOfDelivary_IsActive')
			.exec(function(err, waysofDelivery) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(waysofDelivery) {
		    		res.send(waysofDelivery);
				}else{
		    		res.send("no data");
				}
			})
		},

		getWaysOfDeliveryByName:function(request,res){
			var Searchquery = request.body.searchField;
			WayOfDelivery.find({WayOfDelivary_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('WayOfDelivary_Code WayOfDelivary_Name WayOfDelivary_Description WayOfDelivary_IsActive')
			.exec(function(err, waysofDelivery) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(waysofDelivery) {
		    		res.send(waysofDelivery);
				}else{
		    		res.send("no data");
				}
			})
		},

		addWaysOfDelivery:function(request,res){

			WayOfDelivery.getLastCode(function(err,wayofdelivery){
				if (wayofdelivery) 
					InsertIntoWayOfDelivery(wayofdelivery.WayOfDelivary_Code+1);
				else
					InsertIntoWayOfDelivery(1);
			});
			function InsertIntoWayOfDelivery(NextCode){

				var newWayOfDelivery = new WayOfDelivery();
				newWayOfDelivery.WayOfDelivary_Code    		 = NextCode;
				newWayOfDelivery.WayOfDelivary_Name   	 	 = request.body.WayOfDelivary_Name;
				newWayOfDelivery.WayOfDelivary_Description   = request.body.WayOfDelivary_Description;
				newWayOfDelivery.WayOfDelivary_IsActive		 = 1;
				
				newWayOfDelivery.save(function(error, doneadd){
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

		editWaysOfDelivery:function(request,res){

			var myquery = { WayOfDelivary_Code: request.body.WayOfDelivary_Code }; 
			var newvalues = { 
				WayOfDelivary_Name	 		: request.body.WayOfDelivary_Name,
				WayOfDelivary_Description	: request.body.WayOfDelivary_Description,
				WayOfDelivary_IsActive	 	: request.body.WayOfDelivary_IsActive,

			 };
			WayOfDelivery.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Way Of Delivery not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Form ***********/
		getForm:function(request,res){
			Form.find({})
			.select('Form_Code Form_Name Form_Description Form_IsActive')
			.exec(function(err, form) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(form) {
		    		res.send(form);
				}else{
		    		res.send("no Form");
				}
			})
		},
		getFormsNumber: function(req,res){
			Form.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},
		getFormByName:function(request,res){
			var Searchquery = request.body.searchField;
			Form.find({Form_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('Form_Code Form_Name Form_Description Form_IsActive')
			.exec(function(err, form) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(form) {
		    		res.send(form);
				}else{
		    		res.send("no Form");
				}
			})
		},

		addForm:function(request,res){
			Form.getLastCode(function(err,form){
				if (form) 
					InsertIntoForm(form.Form_Code+1);
				else
					InsertIntoForm(1);
			});

			function InsertIntoForm(NextCode){
				var newForm = new Form();
				newForm.Form_Code    		 = NextCode;
				newForm.Form_Name   	 	 = request.body.Form_Name;
				newForm.Form_Description  	 = request.body.Form_Description;
				newForm.Form_IsActive		 = 1;
				
				newForm.save(function(error, doneadd){
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

		editForm:function(request,res){

			var myquery = { Form_Code: request.body.Form_Code }; 
			var newvalues = { 
				Form_Name	 		: request.body.Form_Name,
				Form_Description	: request.body.Form_Description,
				Form_IsActive	 	: request.body.Form_IsActive,

			 };
			Form.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Form not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Packing ***********/

		getPacking:function(request,res){
			Packing.find({})
			.select('Packing_Code Packing_Name Packing_Description Packing_IsActive')
			.exec(function(err, packing) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(packing) {
		    		res.send(packing);
				}else{
		    		res.send("no Packing");
				}
			})
		},
		getPackingByName:function(request,res){
			var Searchquery = request.body.searchField;
			Packing.find({Packing_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('Packing_Code Packing_Name Packing_Description Packing_IsActive')
			.exec(function(err, packing) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(packing) {
		    		res.send(packing);
				}else{
		    		res.send("no Packing");
				}
			})
		},

		addPacking:function(request,res){
			Packing.getLastCode(function(err,packing){
				if (packing) 
					InsertIntoPacking(packing.Packing_Code+1);
				else
					InsertIntoPacking(1);
			});

			function InsertIntoPacking(NextCode){

				var newPacking = new Packing();
				newPacking.Packing_Code    		 = NextCode;
				newPacking.Packing_Name   	 	 = request.body.Packing_Name;
				newPacking.Packing_Description   = request.body.Packing_Description;
				newPacking.Packing_IsActive		 = 1;
				
				newPacking.save(function(error, doneadd){
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

		editPacking:function(request,res){

			var myquery = { Packing_Code: request.body.Packing_Code }; 
			var newvalues = { 
				Packing_Name	 		: request.body.Packing_Name,
				Packing_Description	 	: request.body.Packing_Description,
				Packing_IsActive	 	: request.body.Packing_IsActive,

			 };
			Packing.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Packing not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Product Category ***********/

		getProductCategory:function(request,res){
			ProductCategory.find({})
			.select('ProductCategory_Code ProductCategory_Name ProductCategory_Description ProductCategory_IsActive')
			.exec(function(err, product_category) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(product_category) {
		    		res.send(product_category);
				}else{
		    		res.send("no Product Category");
				}
			})
		},
		getProductCategoriesNumber: function(req,res){
			ProductCategory.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},

		getProductCategoryByName:function(request,res){
			var Searchquery = request.body.searchField;
			ProductCategory.find({ProductCategory_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('ProductCategory_Code ProductCategory_Name ProductCategory_Description ProductCategory_IsActive')
			.exec(function(err, product_category) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(product_category) {
		    		res.send(product_category);
				}else{
		    		res.send("no Product Category");
				}
			})
		},

		addProductCategory:function(request,res){

			ProductCategory.getLastCode(function(err,productcategory){
				if (productcategory) 
					InsertIntoProductCategory(productcategory.ProductCategory_Code+1);
				else
					InsertIntoProductCategory(1);
			});

			function InsertIntoProductCategory(NextCode){

				var newProductCategory = new ProductCategory();
				newProductCategory.ProductCategory_Code    		 = NextCode;
				newProductCategory.ProductCategory_Name   	 	 = request.body.ProductCategory_Name;
				newProductCategory.ProductCategory_Description   = request.body.ProductCategory_Description;
				newProductCategory.ProductCategory_IsActive		 = 1;
				
				newProductCategory.save(function(error, doneadd){
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

		editProductCategory:function(request,res){

			var myquery = { ProductCategory_Code: request.body.ProductCategory_Code }; 
			var newvalues = { 
				ProductCategory_Name	 		: request.body.ProductCategory_Name,
				ProductCategory_Description	 	: request.body.ProductCategory_Description,
				ProductCategory_IsActive	 	: request.body.ProductCategory_IsActive,

			 };
			ProductCategory.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Product Category not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},
	
	/****************** Release Type ***********/

		getReleaseType:function(request,res){
			ReleaseType.find({})
			.select('ReleaseType_Code ReleaseType_Name ReleaseType_Description ReleaseType_IsActive')
			.exec(function(err, release) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(release) {
		    		res.send(release);
				}else{
		    		res.send("no Release");
				}
			})
		},
		getReleaseTypesNumber: function(req,res){
			ReleaseType.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},
		getReleaseTypeByName:function(request,res){
			var Searchquery = request.body.searchField;
			ReleaseType.find({ReleaseType_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('ReleaseType_Code ReleaseType_Name ReleaseType_Description ReleaseType_IsActive')
			.exec(function(err, release) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(release) {
		    		res.send(release);
				}else{
		    		res.send("no Release");
				}
			})
		},
		addReleaseType:function(request,res){
			ReleaseType.getLastCode(function(err,releasetype){
				if (releasetype) 
					InsertIntoReleaseType(releasetype.ReleaseType_Code+1);
				else
					InsertIntoReleaseType(1);
			});

			function InsertIntoReleaseType(NextCode){

				var newReleaseType = new ReleaseType();
				newReleaseType.ReleaseType_Code    		 = NextCode;
				newReleaseType.ReleaseType_Name   	 	 = request.body.ReleaseType_Name;
				newReleaseType.ReleaseType_Description   = request.body.ReleaseType_Description;
				newReleaseType.ReleaseType_IsActive		 = 1;
				
				newReleaseType.save(function(error, doneadd){
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

		editReleaseType:function(request,res){

			var myquery = { ReleaseType_Code: request.body.ReleaseType_Code }; 
			var newvalues = { 
				ReleaseType_Name	 		: request.body.ReleaseType_Name,
				ReleaseType_Description	 	: request.body.ReleaseType_Description,
				ReleaseType_IsActive	 	: request.body.ReleaseType_IsActive,

			 };
			ReleaseType.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Release Type not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},
	
	/****************** Storage Type ***********/

		getStorageType:function(request,res){
			StorageType.find({})
			.select('StorageType_Code StorageType_Name StorageType_Description StorageType_IsActive')
			.exec(function(err, storagetype) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(storagetype) {
		    		res.send(storagetype);
				}else{
		    		res.send("no Storage Type");
				}
			})
		},
		getStorageTypeByName:function(request,res){
			var Searchquery = request.body.searchField;
			StorageType.find({StorageType_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('StorageType_Code StorageType_Name StorageType_Description StorageType_IsActive')
			.exec(function(err, storagetype) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(storagetype) {
		    		res.send(storagetype);
				}else{
		    		res.send("no Storage Type");
				}
			})
		},

		// GetNextCodeStorageType:function(req,res){
		// 	StorageType.getLastCode(function(err,storagetype){
		// 		if (storagetype) 
		// 			res.send( Number(storagetype.StorageType_Code)+1);
		// 		else
		// 			res.send(1);
		// 	})
		// },

		addStorageType:function(request,res){

			StorageType.getLastCode(function(err,storagetype){
				if (storagetype) 
					InsertIntoStorageType(storagetype.StorageType_Code+1);
				else
					InsertIntoStorageType(1);
			});

			function InsertIntoStorageType(NextCode){
				var newStorageType = new StorageType();
				newStorageType.StorageType_Code    		 = NextCode;
				newStorageType.StorageType_Name   	 	 = request.body.StorageType_Name;
				newStorageType.StorageType_Description   = request.body.StorageType_Description;
				newStorageType.StorageType_IsActive		 = 1;
				
				newStorageType.save(function(error, doneadd){
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

		editStorageType:function(request,res){

			var myquery = { StorageType_Code: request.body.StorageType_Code }; 
			var newvalues = { 
				StorageType_Name	 		: request.body.StorageType_Name,
				StorageType_Description	 	: request.body.StorageType_Description,
				StorageType_IsActive	 	: request.body.StorageType_IsActive,

			 };
			StorageType.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Storage Type not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Selling Area ***********/

		getSellingArea:function(request,res){
			SellingArea.find({})
			.select('SellingArea_Code SellingArea_Name SellingArea_Description SellingArea_IsActive')
			.exec(function(err, sellingarea) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(sellingarea) {
		    		res.send(sellingarea);
				}else{
		    		res.send("no Selling Area");
				}
			})
		},
		getSellingAreasNumber: function(req,res){
			SellingArea.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},
		getSellingAreaByName:function(request,res){
			var Searchquery = request.body.searchField;
			SellingArea.find({SellingArea_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('SellingArea_Code SellingArea_Name SellingArea_Description SellingArea_IsActive')
			.exec(function(err, sellingarea) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(sellingarea) {
		    		res.send(sellingarea);
				}else{
		    		res.send("no Selling Area");
				}
			})
		},

		addSellingArea:function(request,res){

			SellingArea.getLastCode(function(err,sellingarea){
				if (sellingarea) 
					InsertIntoSellingArea(sellingarea.SellingArea_Code+1);
				else
					InsertIntoSellingArea(1);
			});

			function InsertIntoSellingArea(NextCode){
				var newSellingArea = new SellingArea();
				newSellingArea.SellingArea_Code    		 = NextCode;
				newSellingArea.SellingArea_Name   	 	 = request.body.SellingArea_Name;
				newSellingArea.SellingArea_Description   = request.body.SellingArea_Description;
				newSellingArea.SellingArea_IsActive		 = 1;
				
				newSellingArea.save(function(error, doneadd){
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

		editSellingArea:function(request,res){

			var myquery = { SellingArea_Code: request.body.SellingArea_Code }; 
			var newvalues = { 
				SellingArea_Name	 		: request.body.SellingArea_Name,
				SellingArea_Description	 	: request.body.SellingArea_Description,
				SellingArea_IsActive	 	: request.body.SellingArea_IsActive,

			 };
			SellingArea.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Selling Area not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

	/****************** Wight ***********/

		getWeight:function(request,res){
			Weight.find({})
			.select('Weight_Code Weight_Name Weight_Description Weight_IsActive')
			.exec(function(err, weight) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(weight) {
					console.log("weights",weight)
		    		res.send(weight);
				}else{
		    		res.send("no Weight");
				}
			})
		},
		getWeightByName:function(request,res){
			var Searchquery = request.body.searchField;
			Weight.find({Weight_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('Weight_Code Weight_Name Weight_Description Weight_IsActive')
			.exec(function(err, weight) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(weight) {
		    		res.send(weight);
				}else{
		    		res.send("no Weight");
				}
			})
		},

		addWeight:function(request,res){

			Weight.getLastCode(function(err,weight){
				if (weight) 
					InsertIntoWeight(weight.Weight_Code+1);
				else
					InsertIntoWeight(1);
			});

			function InsertIntoWeight(NextCode){
				var newWeight = new Weight();
				newWeight.Weight_Code    	   = NextCode;
				newWeight.Weight_Name   	   = request.body.Weight_Name;
				newWeight.Weight_Description   = request.body.Weight_Description;
				newWeight.Weight_IsActive	   = 1;
				
				newWeight.save(function(error, doneadd){
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

		editWeight:function(request,res){
			var myquery = { Weight_Code: request.body.Weight_Code }; 
			var newvalues = { 
				Weight_Name	 		: request.body.Weight_Name,
				Weight_Description	: request.body.Weight_Description,
				Weight_IsActive	 	: request.body.Weight_IsActive,

			 };

			Weight.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Weight not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},


	/****************** Concentration ***********/

		getConcentration:function(request,res){
			Concentration.find({})
			.select('Concentration_Code Concentration_Name Concentration_Description Concentration_IsActive')
			.exec(function(err, concentration) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(concentration) {
		    		res.send(concentration);
				}else{
		    		res.send("no Concentration");
				}
			})
		},
		getConcentrationsNumber:function(req,res){
			Concentration.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},
		getConcentrationByName:function(request,res){
			var Searchquery = request.body.searchField;
			Concentration.find({Concentration_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.select('Concentration_Code Concentration_Name Concentration_Description Concentration_IsActive')
			.exec(function(err, concentration) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(concentration) {
		    		res.send(concentration);
				}else{
		    		res.send("no Concentration");
				}
			})
		},
		addConcentration:function(request,res){

			Concentration.getLastCode(function(err,concentration){
				if (concentration) 
					InsertIntoConcentration(concentration.Concentration_Code+1);
				else
					InsertIntoConcentration(1);
			});

			function InsertIntoConcentration(NextCode){
				var newConcentration = new Concentration();
				newConcentration.Concentration_Code    	   = NextCode;
				newConcentration.Concentration_Name   	   = request.body.Concentration_Name;
				newConcentration.Concentration_Description = request.body.Concentration_Description;
				newConcentration.Concentration_IsActive	   = 1;
				
				newConcentration.save(function(error, doneadd){
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

		editConcentration:function(request,res){
			var myquery = { Concentration_Code: request.body.Concentration_Code }; 
			var newvalues = { 
				Concentration_Name	 		: request.body.Concentration_Name,
				Concentration_Description	: request.body.Concentration_Description,
				Concentration_IsActive	 	: request.body.Concentration_IsActive,

			 };

			Concentration.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Concentration not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},



	/****************** Certificate ***********/

		getCertificate:function(request,res){
			Certificate.find({})
			.select('Certificate_Code Certificate_Name Certificate_Description Certificate_IsActive')
			.exec(function(err, certificate) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(certificate) {
		    		res.send(certificate);
				}else{
		    		res.send("no Certificate");
				}
			})
		},
		getCertificatesNumber:function(req,res){
			Certificate.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		},

		addCertificate:function(request,res){

			Certificate.getLastCode(function(err,certificate){
				if (certificate) 
					InsertIntoCertificate(certificate.Certificate_Code+1);
				else
					InsertIntoCertificate(1);
			});

			function InsertIntoCertificate(NextCode){
				var newCertificate = new Certificate();
				newCertificate.Certificate_Code    	   = NextCode;
				newCertificate.Certificate_Name   	   = request.body.Certificate_Name;
				newCertificate.Certificate_Description = request.body.Certificate_Description;
				newCertificate.Certificate_IsActive	   = 1;
				
				newCertificate.save(function(error, doneadd){
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

		editCertificate:function(request,res){
			var myquery = { Certificate_Code: request.body.Certificate_Code }; 
			var newvalues = { 
				Certificate_Name	 		: request.body.Certificate_Name,
				Certificate_Description		: request.body.Certificate_Description,
				Certificate_IsActive	 	: request.body.Certificate_IsActive,

			 };

			Certificate.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Certificate not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

		getCertificateByname:function(request, response) {
			var Searchquery = request.body.searchField;
			Certificate.find({Certificate_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, certificate) {
				if (err){
		    		return response.send({
						message: err
					});
		    	}
		    	if (certificate.length == 0) {
					return response.send({
						message: 'No Certificate Found !!'
					});
	        	} else {
					return response.send(certificate);
				}
			})
		}, 

		/****************** TemperatureUnit ***********/

		getTemperatureUnit:function(request,res){
			TemperatureUnit.find({})
			.select('TemperatureUnit_Code TemperatureUnit_Name TemperatureUnit_Description TemperatureUnit_IsActive')
			.exec(function(err, temperature_unit) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(temperature_unit) {
		    		res.send(temperature_unit);
				}else{
		    		res.send("no TemperatureUnit");
				}
			})
		},

		addTemperatureUnit:function(request,res){

			TemperatureUnit.getLastCode(function(err,temperatureunit){
				if (temperatureunit) 
					InsertIntoTemperatureUnit(temperatureunit.TemperatureUnit_Code+1);
				else
					InsertIntoTemperatureUnit(1);
			});

			function InsertIntoTemperatureUnit(NextCode){
				var newTemperatureUnit = new TemperatureUnit();
				newTemperatureUnit.TemperatureUnit_Code    	   = NextCode;
				newTemperatureUnit.TemperatureUnit_Name   	   = request.body.TemperatureUnit_Name;
				newTemperatureUnit.TemperatureUnit_Description = request.body.TemperatureUnit_Description;
				newTemperatureUnit.TemperatureUnit_IsActive	   = 1;
				
				newTemperatureUnit.save(function(error, doneadd){
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

		editTemperatureUnit:function(request,res){
			var myquery = { TemperatureUnit_Code: request.body.TemperatureUnit_Code }; 
			var newvalues = { 
				TemperatureUnit_Name	 		: request.body.TemperatureUnit_Name,
				TemperatureUnit_Description		: request.body.TemperatureUnit_Description,
				TemperatureUnit_IsActive	 	: request.body.TemperatureUnit_IsActive,

			 };

			TemperatureUnit.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Temperature Unit not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

		getTemperatureUnitByname:function(request, response) {
			var Searchquery = request.body.searchField;
			TemperatureUnit.find({TemperatureUnit_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, temperature_unit) {
				if (err){
		    		return response.send({
						message: err
					});
		    	}
		    	if (temperature_unit.length == 0) {
					return response.send({
						message: 'Temperature Unit Not Found !!'
					});
	        	} else {
					return response.send(temperature_unit);
				}
			})
		}, 


		/****************** Types Of Business ***********/

		getTypesOfBusiness:function(request,res){
			TypeOfBusiness.find({})
			.exec(function(err, typesOfBusiness) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(typesOfBusiness) {
		    		res.send(typesOfBusiness);
				}else{
		    		res.send("no data");
				}
			})
		},

		getTypesOfBusinessByName:function(request,res){
			var Searchquery = request.body.searchField;
			TypeOfBusiness.find({ Type_Of_Business_Name: { $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, typesOfBusiness) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(typesOfBusiness) {
		    		res.send(typesOfBusiness);
				}else{
		    		res.send("no data");
				}
			})
		},

		addTypeOfBusiness:function(request,res){

			TypeOfBusiness.getLastCode(function(err,typeOfBusiness){
				if (typeOfBusiness) 
					InsertIntoTypeOfBusiness(typeOfBusiness.Type_Of_Business_Code+1);
				else
					InsertIntoTypeOfBusiness(1);
			});
			function InsertIntoTypeOfBusiness(NextCode){

				var newTypeOfBusiness = new TypeOfBusiness();
				newTypeOfBusiness.Type_Of_Business_Code    		 = NextCode;
				newTypeOfBusiness.Type_Of_Business_Name   	 	 = request.body.Type_Of_Business_Name;
				newTypeOfBusiness.Type_Of_Business_Description   = request.body.Type_Of_Business_Description;
				
				newTypeOfBusiness.save(function(error, doneadd){
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

		editTypeOfBusiness:function(request,res){

			var myquery = { Type_Of_Business_Code : request.body.Type_Of_Business_Code }; 
			var newvalues = { 
				Type_Of_Business_Name	 		: request.body.Type_Of_Business_Name,
				Type_Of_Business_Description	: request.body.Type_Of_Business_Description,
				Type_Of_Business_IsActive	 	: request.body.Type_Of_Business_IsActive,

			 };
			TypeOfBusiness.findOneAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Types of business not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

		/****************** origins variants ***********/
		
		getOriginVariants:function(request,res){
			OrigintVariant.find({})
			.exec(function(err, originVariants) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(originVariants) {
		    		res.send(originVariants);
				}else{
		    		res.send("no data");
				}
			})
		},
		getOriginVariantsByName:function(request,res){
			var Searchquery = request.body.searchField;
			OrigintVariant.find({ProductOrigin_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, originVariant) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(originVariant) {
		    		res.send(originVariant);
				}else{
		    		res.send("no data");
				}
			})
		},

		addOriginVariant: function(request,res){

			var newOriginVariant = new OrigintVariant();
			newOriginVariant.ProductOrigin_Name   	 	 = request.body.ProductOrigin_Name;
			newOriginVariant.ProductOrigin_Description   = request.body.ProductOrigin_Description;
				
			newOriginVariant.save(function(error, doneadd){
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
			
		},

		editOriginVariant:function(request,res){

			var myquery = request.body._id; 
			var newvalues = { 
				ProductOrigin_Name	 		: request.body.ProductOrigin_Name,
				ProductOrigin_Description	: request.body.ProductOrigin_Description,
				ProductOrigin_IsActive	 	: request.body.ProductOrigin_IsActive,

			 };
			 OrigintVariant.findByIdAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'product origin not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},


		/****************** product unit ***********/
		
		getProductUnits:function(request,res){
			ProductUnit.find({})
			.exec(function(err, productUnits) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(productUnits) {
		    		res.send(productUnits);
				}else{
		    		res.send("no data");
				}
			})
		},
		getProductUnitsByName:function(request,res){
			var Searchquery = request.body.searchField;
			ProductUnit.find({ProductUnit_Name:{ $regex: new RegExp('.*' +Searchquery+ '.*', "i") }})
			.exec(function(err, productUnit) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(productUnit) {
		    		res.send(productUnit);
				}else{
		    		res.send("no data");
				}
			})
		},

		addProductUnit: function(request,res){

			var newProductUnit = new ProductUnit();
			newProductUnit.ProductUnit_Name   	 	 = request.body.ProductUnit_Name;
			newProductUnit.ProductUnit_Description   = request.body.ProductUnit_Description;
				
			newProductUnit.save(function(error, doneadd){
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
			
		},

		editProductUnit:function(request,res){

			var myquery = request.body._id; 
			var newvalues = { 
				ProductUnit_Name	 		: request.body.ProductUnit_Name,
				ProductUnit_Description	: request.body.ProductUnit_Description,
				ProductUnit_IsActive	 	: request.body.ProductUnit_IsActive,

			 };
			 ProductUnit.findByIdAndUpdate( myquery,newvalues, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'product unit not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},


}	
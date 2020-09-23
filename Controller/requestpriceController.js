
var RequestPrice = require('../Model/request_price');

var Customer = require('../Model/customer');
var Supplier = require('../Model/supplier');
var Prodcut = require('../Model/product');

var crypto = require('crypto'),
 algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
		
		getAllRequestPrice:function(request,res){

			// RequestPrice.aggregate([ 
			// 	{$unwind: "$RequestPrice_Supplier" },
			// 	{$unwind: "$RequestPrice_Supplier.Details" },
			//     { "$group": { 
			//         "_id": '$RequestPrice_Code',
			//         "RequestPrice_Customer_ID" : { $first: '$RequestPrice_Customer_ID' },
			//         "RequestPrice_Create_Date" : { $first: '$RequestPrice_Create_Date' },
			//         "RequestPrice_Product" : { $first: '$RequestPrice_Product' },
			//         "RequestPrice_Supplier" : { $first: '$RequestPrice_Supplier' },
			//         "RequestPrice_Status" : { $first: '$RequestPrice_Status' },
			//         "max": { "$max": "$RequestPrice_Supplier.Details.Price" }, 
			//         "min": { "$min": "$RequestPrice_Supplier.Details.Price" } 
			//     }},
			// ])

			RequestPrice.find({})
			.populate({ path: 'Customer', select: 'Customer_Name Customer_Email' })
			.populate({ path: 'Product', select: 'Product_Name' })
			.populate({ path: 'Weight', select: 'Weight_Name' })
			.populate({ path: 'Supplier', select: 'Supplier_Name' })
			.lean()
			.exec(function(err, supplier) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(supplier) {
		    			res.send(supplier);
					// RequestPrice.populate(supplier, {path: 'Customer', select: 'Customer_Code Customer_Name'}, function(err, customer) {
					// 	RequestPrice.populate(customer, {path: 'Product',select: 'Product_Name'}, function(err, product) {
					// 	   RequestPrice.populate(product, {path: 'Weight' ,select: 'Weight_Name'}, function(err, weight) {
					// 		   RequestPrice.populate(weight, {path: 'Supplier' ,select: 'Supplier_Name'}, function(err, supplierName) {
					// 			   res.send(supplierName);
					// 		   });
					// 	   });
					//    });
				 //   });
			   }else{
		    		res.send("not Request");
				}
			})
		},

		addRequestPrice:function(request,res,URL){
			// console.log(URL);
			var arrayOfSuppliers = [];
			// arrayOfSuppliers = [
			// 	{
			// 		Supplier_ID : 1,
			// 		Supplier_Email : 'osamasabry14@gmail.com',
			// 		Price_Status :0
			// 	},
			// 	{
			// 		Supplier_ID : 2,
			// 		Supplier_Email : 'mahmoud@gmail.com',
			// 		Price_Status :0
			// 	},

			// ];

			// var arrayOfProducts = [{
			// 	Product_ID : 1,
			// 	Quantity_Required : 300,
			// 	Weight_ID :1
			// }];

			if (request.body.Category_ID) {
				CheckData();		
			}else{
				arrayOfSuppliers = request.body.RequestPrice_Supplier;
				GetlastID();
			}

			function CheckData(){
				Supplier.find({Supplier_Category_IDs:request.body.Category_ID})
				.populate({path: 'Category', select: 'Category_ID Category_Name'})
				.lean()
				.exec(function(err, supplier) {
					if (err){
			    		return res.send({
							message: err
						});
			    	} else if(supplier) {
			    		for (var i = supplier.length - 1; i >= 0; i--) {
							var supplierTest = {};
							supplierTest.Supplier_ID = supplier[i]._id;
							supplierTest.Supplier_Email = supplier[i].Supplier_Email;
							supplierTest.Price_Status = 0;
			    			arrayOfSuppliers.push(supplierTest);
			    			
			    		}
		    			GetlastID();
					}else{
			    		res.send("Supplier not found");
					}
				})
			}

			function GetlastID (){

				RequestPrice.getLastCode(function(err,requestprice){
					if (requestprice) 
						InsertIntoRequestPrice(requestprice.RequestPrice_Code+1);
					else
						InsertIntoRequestPrice(1);
				});
			}

			function InsertIntoRequestPrice(NextCode){

				var newRequestPrice = new RequestPrice();
				newRequestPrice.RequestPrice_Code        	        = NextCode;
		        newRequestPrice.RequestPrice_Create_Date            = request.body.RequestPrice_Create_Date;
		        newRequestPrice.RequestPrice_Customer_ID    	    = request.body.RequestPrice_Customer_ID;
		        newRequestPrice.RequestPrice_Product           		= request.body.RequestPrice_Product;
		        // newRequestPrice.RequestPrice_Product           		= arrayOfProducts;
				newRequestPrice.RequestPrice_Supplier     	 	 	= arrayOfSuppliers;
				newRequestPrice.RequestPrice_Status 	     	 	= request.body.RequestPrice_Status;
				
				newRequestPrice.save(function(error, doneadd){
					if(error){
						console.log(error)
						return res.send({
							message: error
						});
					}
					else{

						SendEmail(doneadd);
						
					}
				});
			}

			function encrypt(text){
			    var cipher = crypto.createCipher(algorithm,password)
			    var crypted = cipher.update(text,'utf8','hex')
			    crypted += cipher.final('hex');
			    return crypted;
			}
			
			function SendEmail(row){
				// url: http://highchem.winexme.com/#!/supplier-pricing?spid=asdfsadf&rqid=fgsdfg
				var row_id = row._id;
				row_id = encrypt(String(row_id));
				for (var i = row.RequestPrice_Supplier.length - 1; i >= 0; i--) {
					var supplier_id = encrypt(String(row.RequestPrice_Supplier[i]._id)); 
					var message = '<p>Dear valued supplier, </p>';
					message += '<p>In High Chemicals Market we are much keen on doing business with you and inhance your market share. </p>';
					message += '<p>Some of our customers are willing to request some of your products.  Please click below link and fill in the form to submit your quotation.</p>';
					message += '<h4><a href='+URL+'supplier-fill-price/'+supplier_id+'/'+row_id+'>(click here)</a></h4>';
					message += 'Be informed that, the more flexible your prices and terms are, the more likely your quotation will end up with a closed deal.</br>';
					message += '<p>Have a great sales moment!</p>';
					 const msg = {
					  to: row.RequestPrice_Supplier[i].Supplier_Email,
					  from: 'info@highchem.net',
					  subject: 'Offer',
					  text: 'please fill from',
					  // html: '<h1><a href='+URL+'supplier-pricing/'+supplier_id+'/'+row_id+'></a></h1>',
					  html: message,
					  
					};
					sgMail.send(msg); 
				}

				return res.send({
					message: true
				});
			}
		},

		updateRequestPrice:function(request,res){
			function decrypt(text){
				var decipher = crypto.createDecipher(algorithm,password)
				var dec = decipher.update(text,'hex','utf8')
				dec += decipher.final('utf8');
				return dec;
		  	}
		  
			var  RequestPriceid = decrypt(request.body.ID);
			var RequestPriceSupplierid = decrypt(request.body.RequestPrice_Supplier_ID );
			var myquery = { 
				_id	 						: RequestPriceid,
				'RequestPrice_Supplier._id' : RequestPriceSupplierid
			}; 

			var newvalues = { 
				$set: {
						"RequestPrice_Supplier.$.Valid_Till"   			: request.body.Valid_Till,
						"RequestPrice_Supplier.$.Price_Status" 			: 1,
						"RequestPrice_Supplier.$.Place_of_Delivery"		: request.body.Place_of_Delivery,
						"RequestPrice_Supplier.$.Taxes_Types"			: request.body.Taxes_Types,
						"RequestPrice_Supplier.$.Method_of_Payment"		: request.body.Method_of_Payment,
						"RequestPrice_Supplier.$.Delivery_Time"			: request.body.Delivery_Time,
						"RequestPrice_Supplier.$.Delivery_Cost"			: request.body.Delivery_Cost,
						"RequestPrice_Supplier.$.Work_Time_Off"			: request.body.Work_Time_Off,
						"RequestPrice_Supplier.$.Details"      			: request.body.RequestPrice_Details,	
						"RequestPrice_Status"  				   			: 1,
						
				 },

			 },options = {upsert: true};

			RequestPrice.findOneAndUpdate( myquery,newvalues,options, function(err, field) {
	    	    if (err){
	    	    	return res.send({
						message: 'Error'
					});
	    	    }
	            if (!field) {
	            	return res.send({
						message: 'Request Price not exists'
					});
	            } else {

	                return res.send({
						message: true
					});
				}
			})
		},

		getRequestPriceByID:function(request,res){

			function decrypt(text){
			  	var decipher = crypto.createDecipher(algorithm,password)
			  	var dec = decipher.update(text,'hex','utf8')
			  	dec += decipher.final('utf8');
			  	return dec;
			}
			
			var  id = decrypt(request.body.row_id);
			var supplier_id = decrypt(request.body.supplier_id);
			RequestPrice.findOne({_id:id }).then((data) => {
				var status = data.RequestPrice_Supplier.filter((object) => {
					return object["_id"] == supplier_id;
			})
				if (status[0].Price_Status==0) {
					datarequestprice();
				}else{
					res.send("Link Is Expired");
				}
			})

			function datarequestprice(){
				RequestPrice.findOne({_id:id})
				.select('RequestPrice_Product')
				.populate({ path: 'Product', select: 'Product_Name' })
				.populate({ path: 'Weight', select: 'Weight_Name' })
				.lean()
				.exec(function(err, requestprice) {
					if (err){
			    		return res.send({
							message: err
						});
			    	} else if(requestprice) {
						res.send(requestprice);
						
					}else{
			    		res.send("not Request");
					}
				})
			}
		},
		getAllRequestPricesNumber:function(req,res){
			RequestPrice.find({}).count(function(err, count){
				console.log("Number of docs: ", count );
				if(err){
				  return res.send({err:err})
				}else {
				  return res.send({count:count})
				}
			});
		}
}
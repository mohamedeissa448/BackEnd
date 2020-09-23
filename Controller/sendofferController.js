
var SendOffer = require('../Model/send_offer');

var Customer = require('../Model/customer');
var Supplier = require('../Model/supplier');
var Prodcut = require('../Model/product');

var crypto = require('crypto'),
 algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = { 
		
	getAllSendOffer:function(request,res){
		SendOffer.find({})
		.populate({ path: 'Customer', select: 'Customer_Name' })
		.populate({ path: 'Product', select: 'Product_Name' })
		.populate({ path: 'Weight', select: 'Weight_Name' })
		.lean()
		.exec(function(err, offer) {
			if (err){
	    		return res.send({
					message: err
				});
	    	} else if(offer) {
				res.send(offer);
				
			}else{
	    		res.send("not Offers");
			}
		})
	},

	addSendOffer:function(request,res,URL,WorkingHours){


		// console.log(URL);
		// var arrayOfCustomers = [];
		// var Products = reques;
		// arrayOfCustomers = [
		// 	{
		// 		Customer_ID : 1,
		// 		Customer_Email : 'osamasabry14@gmail.com',
		// 		Price_Status :0
		// 	}
			// ,
			// {
			// 	Customer_ID : 2,
			// 	Customer_Email : 'mahmoud@gmail.com',
			// 	Price_Status :0
			// },

		//];

		// arrayOfProducts = [
		// 	{
		// 		Product_ID : 1,
		// 		Quantity_Required : 300,
		// 		Weight_ID :1
		// 	},
		// 	{
		// 		Product_ID : 2,
		// 		Quantity_Required : 500,
		// 		Weight_ID :2
		// 	},

		// ];

		if (request.body.Category_ID) {
			CheckData();		
		}else{
			arrayOfCustomers = request.body.SendOffer_Customer;
			GetlastID();
		}

		function CheckData(){
			Customer.find({Customer_Category_IDs:request.body.Category_ID})
			.populate({path: 'Category', select: 'Category_ID Category_Name'})
			.lean()
			.exec(function(err, customer) {
				if (err){
		    		return res.send({
						message: err
					});
		    	} else if(customer) {
		    		for (var i = customer.length - 1; i >= 0; i--) {
						var customerobject = {};
						customerobject.Customer_ID = customer[i]._id;
						customerobject.Customer_Email = customer[i].Customer_Email;
						customerobject.Price_Status = 0;
		    			arrayOfCustomers.push(customerobject);
		    			
		    		}
	    			GetlastID();
				}else{
		    		res.send("Customer not found");
				}
			})
		}

		function GetlastID (){

			SendOffer.getLastCode(function(err,sendoffer){
				if (sendoffer) 
					InsertIntoSendOffer(sendoffer.SendOffer_Code+1);
				else
					InsertIntoSendOffer(1);
			});
		}

		function InsertIntoSendOffer(NextCode){

			var newSendOffer = new SendOffer();
			newSendOffer.SendOffer_Code        	        = NextCode;
	        newSendOffer.SendOffer_Create_Date          = new Date(request.body.SendOffer_Create_Date);
	        newSendOffer.SendOffer_Valid_Till    	    = new Date(request.body.SendOffer_Valid_Till + 'T23:59:59.000Z');
	        newSendOffer.SendOffer_Product              = request.body.SendOffer_Product;
	        newSendOffer.SendOffer_Title                = request.body.SendOffer_Title;
	        newSendOffer.SendOffer_Place_of_Delivery    = request.body.SendOffer_Place_of_Delivery;
	        newSendOffer.SendOffer_Taxes_Types          = request.body.SendOffer_Taxes_Types;
	        newSendOffer.SendOffer_Method_of_Payment    = request.body.SendOffer_Method_of_Payment;
	        newSendOffer.SendOffer_Delivery_Time        = request.body.SendOffer_Delivery_Time;
	        newSendOffer.SendOffer_Delivery_Cost        = request.body.SendOffer_Delivery_Cost;
	        newSendOffer.SendOffer_Work_Time_Off        = request.body.SendOffer_Work_Time_Off;
	        
	        // newSendOffer.SendOffer_Product              = arrayOfProducts;
			newSendOffer.SendOffer_Customer     	 	= arrayOfCustomers;
			newSendOffer.SendOffer_Status 	     	 	= request.body.SendOffer_Status;
			
			newSendOffer.save(function(error, doneadd){
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

		function drawtable(data){
			var date = new Date(request.body.SendOffer_Valid_Till + 'T23:59:59.000Z');
			var month = date.getUTCMonth() + 1; //months from 1-12
			var day = date.getUTCDate();
			var year = date.getUTCFullYear();

			var newdate = year + "/" + month + "/" + day;

			var message  = '<p>Dear valued customer,</p>';
			message += '<p>In reply to your request, please find below quotation.  You might want to click below link(s) to see full product specification.</p>';

			message += '<table border ="1" bordercolor="#81a28e"><tr><th>Product Name</th><th>Quantity Required</th><th>Weight</th><th>Price</th><th>Details</th></tr>';
			for (var i = 0; i < data.length; i++) {
				var product_id = encrypt(String(data[i].Product_ID))
				message += '<tr><td>'+data[i].Product_Name+'</td>';
				message += '<td>'+data[i].Quantity_Required+'</td>';
				message += '<td>'+data[i].Weight_Name+'</td>';
				message += '<td>'+data[i].Price+'</td>';
				message += '<td><a href='+URL+'view-product/'+product_id+'>Click Here</a></td></tr>';
				
			}
			
			message +='</table>';
			message +='<p>Please note that payment terms are '+request.body.SendOffer_Method_of_Payment ;
			message +=' and the quotation is valid '+ newdate +'</p>';
			message +='<p> Also please note that place of delivery is ' + request.body.SendOffer_Place_of_Delivery;
			message +='and it will take '+request.body.SendOffer_Delivery_Time;
			message +='and the cost of delivery is '+request.body.SendOffer_Delivery_Cost+'</p>';
			message +='<p>this prices  '+request.body.SendOffer_Taxes_Types+'</p>';

			message +='<p>Should you find the quotation of interest to you, please reply to this email with confirmation as to  commence delivery.</p>';
			message +='<p> faithfully,</p>';
			message +='<p>High Chemicals Market,</p>';
			message +='<p>'+WorkingHours+'</p>';

			return message;
		}
		
		function SendEmail(row){
			// url: http://highchem.winexme.com/#!/supplier-pricing?spid=asdfsadf&rqid=fgsdfg
			var row_id = row._id;
			row_id = encrypt(String(row_id));
			for (var i = row.SendOffer_Customer.length - 1; i >= 0; i--) {
				//var customer_id = encrypt(String(row.SendOffer_Customer[i]._id)); 
				var message = drawtable(request.body.SendOffer_Product);
				 const msg = {
				  to: row.SendOffer_Customer[i].Customer_Email,
				  from: 'info@highchem.com',
				  subject: 'Pricing Offer',
				  text: 'please fill from',
				  // html: '<h1><a href='+URL+'supplier-pricing/'+supplier_id+'/'+row_id+'></a></h1>',
				  // html:'Hello , Show Offer </br><h4><a href='+URL+'customer-show-offer/'+customer_id+'/'+row_id+'>Open Form To Show Offer (click here)</a></h4>',
				  html:message,
				};
				sgMail.send(msg); 
			}

			return res.send({
				message: true
			});
		}
	},


	getProductByID:function(request,res){
		function decrypt(text){
		  	var decipher = crypto.createDecipher(algorithm,password)
		  	var dec = decipher.update(text,'hex','utf8')
		  	dec += decipher.final('utf8');
		  	return dec;
		}
		var  product_id = decrypt(request.body.row_id);
		Prodcut.findOne({Product_Code:product_id})
		.populate({ path: 'Category', select: 'Category_Name' })
		.populate({ path: 'Supplier', select: 'Supplier_Name' })
		.populate({ path: 'productclass', select: 'Class_Name' })
		.populate({ path: 'country', select: 'Country_Name Country_Tcode' })
		.populate({ path: 'productform', select: 'Form_Code Form_Name' })
		.populate({ path: 'productpacking', select: 'Packing_Code Packing_Name' })
		.populate({ path: 'productrelease', select: 'Release_Code Release_Name' })
		.populate({ path: 'productstrage', select: 'StorageType_Code StorageType_Name' })
		.populate({ path: 'productcategory', select: 'ProductCategory_Code ProductCategory_Name' })
		.populate({ path: 'customer', select: 'Customer_Code Customer_Name' })
		.populate({ path: 'weight', select: 'Weight_Code Weight_Name' })
		.populate({ path: 'concentration', select: 'Concentration_Code Concentration_Name' })
		.lean()
		.exec(function(err, sendoffer) {
			if (err){
	    		return res.send({
					message: err
				});
	    	} else if(sendoffer) {
				res.send(sendoffer);
				
			}else{
	    		res.send("not Offer");
			}
		})
	},
	getEncryptedID:function(request,res){
		function encrypt(text){
		    var cipher = crypto.createCipher(algorithm,password)
		    var crypted = cipher.update(text,'utf8','hex')
		    crypted += cipher.final('hex');
		    return crypted;
		}
		console.log(request.body.row_id);
		var encryptId = encrypt(String(request.body.row_id));
		console.log(encryptId);
		res.send(encryptId);
	},
	getAllSendOffersNumber:function(req,res){
		SendOffer.find({}).count(function(err, count){
			console.log("Number of docs: ", count );
			if(err){
			  return res.send({err:err})
			}else {
			  return res.send({count:count})
			}
		});
	}
}
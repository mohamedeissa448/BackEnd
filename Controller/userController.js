var User = require("../Model/user");
// var crypto = require('crypto-js');
var passwordHash = require("password-hash");

module.exports = {
  getAllUsers: function(request, res) {
    User.find({}).exec(function(err, user) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        res.send(user);
      } else {
        res.send("not Users");
      }
    });
  },
  getAllUsersNumber:function(req,res){
    User.find({}).count(function(err, count){
      console.log("Number of docs: ", count );
      if(err){
        return res.send({err:err})
      }else {
        return res.send({count:count})
      }
    });
  },

  getActiveUsers: function(request, response) {
    User.find({ User_IsActive: 1 }).exec(function(err, user) {
      if (err) {
        return res.send({
          message: err
        });
      } else if (user) {
        response.send(user);
      } else {
        response.send("no Users");
      }
    });
  },
  addUser: function(request, res) {
    User.getLastCode(function(err, user) {
      if (user) InsertIntoUser(user.User_Code + 1);
      else InsertIntoUser(1);
    });

    function InsertIntoUser(NextCode) {
      var newUser = new User();
      newUser.User_Code = NextCode;
      newUser.User_Name = request.body.User_Name;
      newUser.User_Password = passwordHash.generate(request.body.User_Password);
      newUser.User_DisplayName = request.body.User_DisplayName;
      newUser.User_Permissions = [];
      newUser.User_IsActive = 1;

      newUser.save(function(error, doneadd) {
        if (error) {
          return res.send({
            message: error
          });
        } else {
          return res.send({
            message: true
          });
        }
      });
    }
  },

  editUserPermissions: function(request, res) {
    var newvalues = {
      $set: {
        User_Permissions: request.body.User_Permissions
      }
    };
    var myquery = { User_Code: request.body.User_Code };
    User.findOneAndUpdate(myquery, newvalues, function(err, field) {
      if (err) {
        return res.send({
          message: "Error"
        });
      }
      if (!field) {
        return res.send({
          message: "User not exists"
        });
      } else {
        return res.send({
          message: true
        });
      }
    });
  },
  changeMyPassword: function(request, res) {
    User.findOne({ User_Code: request.body.User_Code }, function(err, user) {
      if (err) {
        res.send({ message: "Error" });
      } else if (user) {
        if (!user.verifyPassword(request.body.old_password)) {
          res.send({ message: false });
        } else {
          user.updatePassword(request.body.new_password);
          res.send({ message: true });
        }
      } else {
        res.send({ message: "Error" });
      }
    });
  },
  changePassword: function(request, res) {
    User.findOne({ User_Code: request.body.id }, function(err, user) {
      if (err) {
        res.send({ message: err });
      } else if (user) {
        user.updatePassword(request.body.password);
        res.send({ message: true });
      } else {
        res.send({ message: "unknown Error" });
      }
    });
  },

  //Eissa**********************************/
  updateUserAccessCustomers: function(request, res) {
    var newvalues = {
      $set: {
        User_Access_All_Customers: request.body.User_Access_All_Customers,
        User_Allowed_Customers: request.body.User_Allowed_Customers
      }
    };
    var myquery = { User_Code: request.body.User_Code };
    User.findOneAndUpdate(myquery, newvalues, { new: true }, function(
      err,
      user
    ) {
      if (err) {
        res.send({ message: err });
      } else if (user) {
        res.send({ message: true });
      } else {
        res.send({ message: "user does not Exist" });
      }
    });
  },

  updateUserAccessSuppliers: function(request, res) {
    var newvalues = {
      $set: {
        User_Access_All_Suppliers: request.body.User_Access_All_Suppliers,
        User_Allowed_Suppliers: request.body.User_Allowed_Suppliers
      }
    };
    var myquery = { User_Code: request.body.User_Code };
    User.findOneAndUpdate(myquery, newvalues, { new: true }, function(
      err,
      user
    ) {
      if (err) {
        res.send({ message: err });
      } else if (user) {
        res.send({ message: true });
      } else {
        res.send({ message: "user does not Exist" });
      }
    });
  },

  updateUserAccessProducts: function(request, res) {
    var newvalues = {
      $set: {
        User_Access_All_Products: request.body.User_Access_All_Products,
        User_Allowed_Products: request.body.User_Allowed_Products
      }
    };
    var myquery = { User_Code: request.body.User_Code };
    User.findOneAndUpdate(myquery, newvalues, { new: true }, function(
      err,
      user
    ) {
      if (err) {
        res.send({ message: err });
      } else if (user) {
        res.send({ message: true });
      } else {
        res.send({ message: "user does not Exist" });
      }
    });
  },

  //////////////////////////////////
  retrieveUserAccessCustomers: function(request, res) {
    var myquery = { User_Code: request.body.User_Code };
    User.find(myquery)
      .select("User_Access_All_Customers User_Allowed_Customers")
      .populate({ path: "customer", select: "Customer_Name" })
      .lean()
      .sort({ User_Code: -1 })
      .exec(function(err, customer) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (customer) {
          console.log(customer);
          res.send(customer);
        } else {
          res.send("not Supplier");
        }
      });
    /* User.find(myquery)
      .populate({ path: "customer", select: "Customer_Name" })
      .then(user => {
        if (user) {
          res.send({
            User_Access_All_Customers: user.User_Access_All_Customers,
            User_Allowed_Customers: user.User_Allowed_Customers
          });
        } else {
          res.send({ message: "user does not Exist" });
        }
      })
      .catch(err => res.send());*/
  },

  retrieveUserAccessSuppliers: function(request, res) {
    var myquery = { User_Code: request.body.User_Code };
    User.find(myquery)
      .select("User_Access_All_Suppliers User_Allowed_Suppliers")
      .populate({ path: "supplier", select: "Supplier_Name" })
      .lean()
      .sort({ User_Code: -1 })
      .exec(function(err, supplier) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (supplier) {
          console.log(supplier);
          res.send(supplier);
        } else {
          res.send("not Supplier");
        }
      });
  },

  retrieveUserAccessProducts: function(request, res) {
    var myquery = { User_Code: request.body.User_Code };
    User.find(myquery)
      .select("User_Access_All_Products User_Allowed_Products")
      .populate({ path: "product", select: "Product_Name" })
      .lean()
      .sort({ User_Code: -1 })
      .exec(function(err, product) {
        if (err) {
          return res.send({
            message: err
          });
        } else if (product) {
          console.log(product);
          res.send(product);
        } else {
          res.send("not product");
        }
      });
  }
};

/***************Eissa */
var CustomerUser = require("../Model/customer_users");
var Customer = require("../Model/customer");
module.exports = {
  changePassword: (req, res) => {
    CustomerUser.find({ customer_user_code: req.body.customer_user_code })
      .then(customerUser => {
        if (!customerUser) {
          res.send({ error: "This user does not exist" });
        } else {
          customerUser.password =
            customerUser.password == req.body.oldPassword
              ? req.body.newPassword
              : customerUser.password;
          customerUser
            .save()
            .then(() => {
              res.send({ message: true });
            })
            .catch(error => next(error));
        }
      })
      .catch(err => next(err));
  },

  resetPassword: (req, res) => {
    CustomerUser.find({ customer_code: req.body.customer_code })
      .then(customerUser => {
        if (!customerUser) {
          res.send({ error: "This user does not exist" });
        } else {
          Customer.find({ Customer_Code: req.body.customer_code })
            .then(customer => {
              if (customer) customerUser.password = customer.Customer_Phone;
              else res.send({ error: "couldnot reset password" });
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  }
};

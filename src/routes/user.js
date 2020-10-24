const express = require("express");
const router = new express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/userController");



///login routes

router
.route("/login")
.get(userController.getlogin)
router
.route("/login")
.post(userController.login)

//admin
router
.route("/register")
.get(userController.getRegister)
router
.route("/register")
.post([check('firstname').not().isEmpty(),
check('email').isEmail()],userController.register)




//registration employees
router
  .route("/")
   .post([
    check("firstname").not().isEmpty(),
    check("email").not().isEmpty(),
   
  ], userController.createUser)
 
//home page
  router
.route("/dashboard")
.get(userController.home)


//user details
router
.route("/employee")
.get(userController.getUserData)



//filter
  router
  .route("/filter")
 .get(userController.FilterUser)


 //search
  router
  .route("/search")
 .get(userController.SearchUser)

//logout
router
.route("/logout")
.post(userController.logout)


module.exports = router;

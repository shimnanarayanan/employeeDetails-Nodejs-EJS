const { validationResult } = require("express-validator");
const User = require("../models/user");

//adminlogin

exports.getlogin=(req,res) => {

    let user = req.session.user
    if (user)
    {
        res.redirect('/api/user/dashboard')
        return
    }
  
    res.render('adminlogin');
  
}

exports.login = async (req, res, next) => 
{
   const email=req.body.email;
   const password=req.body.password;
 

       let existingUser
    try 
    { 
        existingUser = await User.findOne({ email: email })
    }
    catch (err) 
    {
        res.status(404)
        res.render('adminlogin', {error: true, message: 'Signup operation failed. Please try later'})
        return
    }

    if (!existingUser) 
    {
        console.log("err");
        
        res.status(404)
        res.render('adminlogin', {error: true, message: 'Invalid credentials. Unable to login'})
        return
    }

    existingUser.comparePassword(password, (err, isMatch) => 
    {
        if (err) 
        {
            res.status(404)            
            res.render('adminlogin', {error: true, message: 'Invalid credentials. Unable to login'})
            return
        }
        
        if (isMatch && !err) 
        {
            

            req.session.user = existingUser
            req.session.app = 1

            // redirect to home
           res.redirect('/api/user/dashboard')
            return
        }
        else
        {
            res.status(404)
            res.render('adminlogin', {error: true, message: 'Invalid credentials. Unable to login'})
            return
        }
    })
 
}


///admin registration

exports.getRegister=(req,res) => {
    res.render('adminregister');
  
}

exports.register = async (req, res, next) => 
{
   const firstname=req.body.firstname;
   const email=req.body.email;
   const password=req.body.password;
 console.log(req.body)
    

       let existingUser
       try 
       { 
           existingUser = await User.findOne({ email: email })
       }
       catch (err)
       {
           res.status(404)
           res.render('adminregister', {error: true, message: 'Signup operation failed. Please try later'})
           return
       }
   
       if (existingUser)
       {
           res.status(404)
           res.render('adminregister', {error: true, message: 'User already exists'})
           return 
       }
   
       const createdUser = new User({
           firstname,
             email,
            password
       })
   
       try 
       {
           await createdUser.save()
       } 
       catch (err)
       {
           res.status(404)
           res.render('adminregister', {error: true, message: 'Sigining up failed. Try gain later'}) 
           return
       }
       
       return res.render('adminlogin', {error: false, message: 'Succesfully registered. Login now.'}) 
   
}

/////home

exports.home=(req,res)=>{
    let user = req.session.user
    if (user)
    {
        res.render('admin/home',{app: req.session.app, username: user.firstName })
        return
    }

    res.redirect('/api/user/login')
}

////create user
exports.createUser=async (req,res) => {
    console.log("Body: ", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
     }

    const { firstname, lastname,email, designation} = req.body;

   

    const newUser = new User({
        firstname,
        lastname,
        email,
        designation,
       role:"employee"
      });
    
      try {
        await newUser.save();
        res.redirect("/api/user/dashboard")
      } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creatng user",
          
          });
      }
}

///user Details

exports.getUserData = async (req, res, next) => {
    let user
    try {
      user = await User.find({role:"employee"})

      res.render('admin/employee', {data:user})
      return
   
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error fetchong user details',
           
          })
    }
  }


///search user

  exports.SearchUser = async (req, res, next) => {

    const key = req.query.key.toString().trim()
  
    let users
    try {
      users = await   User.aggregate([
        {$project: { "name" : { $concat : [ "$firstname", " ", "$lastname" ]} }},
        {$match: {"name": { $regex: key, $options: "si" }}}
      ])
      console.log(users)
   res.render("admin/search",{search:users})
     
    } catch (error) {
      console.log("User search error: ", error);
    
    }

  }
  

  //Filter user


  exports.FilterUser = async (req, res, next) => {
    const filter = req.query.filter;
    console.log(filter)
    let users
    if(filter==="a"){
        try {
            user = await User.find({role:"employee"}).sort({createdAt:1})
          console.log(user)
           res.render("admin/filter",{filter:user})
         } catch (error) {
            console.log("User search error: ", error);
          
          }
    }
    else{
        try {
            user = await User.find({role:"employee"}).sort({createdAt:-1})
            console.log(users)
            res.render("admin/filter",{filter:user})
       
         } catch (error) {
            console.log("User search error: ", error);
          
          }
    }
  }


  ///logout


  exports. logout = (req, res) =>
{

  
    if (req.session.user)
    {
        
        req.session.destroy( () =>
        {
            res.redirect('/api/user/login')
            return
        })
    }
}

  
  

 






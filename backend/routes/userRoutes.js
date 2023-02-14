const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
// register user account

router.post('/register', async(req,res)=> {
    try{
       // check if user already exists
       let user = await User.findOne({email : req.body.email})
       if(user){
        return res.send({
            success: false,
            message: "User already exists",
        })
       }
       // hash password
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(req.body.password,salt)
       req.body.password = hashedPassword;
       const newUser = new User(req.body)
       await newUser.save();
       res.send({
        message: "User created successfully",
        data: null,
        success: true,
       })
    }
    catch(error){
        res.send({
            message: error.message,
            success: false,
        })
    }
})

router.post('/login', async(req,res)=>{
    try{
      //check if user exists
      let user = await User.findOne({email : req.body.email})
      if(!user){
        return res.send({
            message: "User does not exist",
            success: false,
        })
      }
      //check if password is correct
      const validPassword = await bcrypt.compare(req.body.password, user.password)
      if(!validPassword){
        return res.send({
            success: false,
            message: "Invalid password",
        })
      }
      
      if(!user.isVerified){
        return res.send({
          success: false,
          message: "user is not verified yet or has been suspended",
        })
      }
      //generate token
      const token = jwt.sign({userid: user._id}, "12345", {expiresIn: "1d"});
      res.send({
        message: "User logged in successfully",
        success: true,
        data: token,
      }) 
    }
    catch(error){
      res.send({
        message: error.message,
        success: false,
      })
    }
})

// get user info
router.post("/get-user-info",authMiddleware,async(req,res)=>{
    try{
      const user = await User.findById(req.body.userid);
      user.password = "";
      res.send({
        message: "user info fetched successfully",
        data: user,
        success: true,
      })
    }
    catch(error){
      res.send({
        message: error.message,
        success: false,
      })
    }
})


//get all users
router.get("/get-all-users",authMiddleware,async(req,res)=>{
  try{
   const users = await User.find();
   res.send({
    data: users,
    message: "Users fetched successfully",
    success: true,
   })
  }
  catch(error){
   res.send({
    message: error.message,
    success: false,
   })
  }
})

// update user verified status
router.post('/update-user-verified-status',authMiddleware,async(req,res)=>{
  try{
     await User.findByIdAndUpdate(req.body.selectedUser,{
      isVerified: req.body.isVerified,
    })
    res.send({
      data: null,
      message: "User verified status updated successfully",
      success: true,
    })
  }
  catch(error){
    res.send({
      data: null,
      message: error.message,
      success: false,
    })
  }
})

module.exports = router;
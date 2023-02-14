const router = require('express').Router();
const { request } = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Request = require('../models/requestsModel');
const User = require('../models/userModel')
const Transaction = require('../models/transactionModel')

//get all requests to a user
router.post('/get-all-requests-by-user',authMiddleware,async(req,res)=>{
    try{
       const requests = await Request.find({
        $or: [{sender: req.body.userid},{receiver: req.body.userid}],
       }).sort({createdAt: -1}).populate('sender').populate('receiver');
       res.send({
        message: "Requests Fetched Successfully",
        data: requests,
        success: true,
       })
    }
    catch(error){
       res.status(500).json({error: error.message});
    }
})


//send a request to another user

router.post("/send-request",authMiddleware, async(req,res)=>{
    try{
        const {receiver, amount, description} = req.body;
        const request = new Request({
            sender: req.body.userid,
            receiver,
            amount,
            description,
        });
        await request.save();
        res.send({
            data: request,
            message: "Request sent successfully",
            success: true,
        });
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})

//update request status

router.post('/update-request-status',authMiddleware, async(req,res)=>{
    try{
      if(req.body.status === "accepted"){
        //create a transaction
        const transaction = new Transaction({
            sender: req.body.receiver._id,
            receiver: req.body.sender._id,
            amount: req.body.amount,
            reference: req.body.description,
            status: "success"
        });
        await transaction.save()
        // update the balance of the users
        // add the amount to the sender (Who has sent the request)
        await User.findByIdAndUpdate(req.body.sender._id,{
            $inc: { balance: +req.body.amount }
        })
        // deduct the amount from the receiver (Who has received the request)
        await User.findByIdAndUpdate(req.body.receiver._id,{
            $inc: { balance: -req.body.amount }
        })
        // update the request status
        await Request.findByIdAndUpdate(req.body._id,{
            status: req.body.status,
        })
      }
      res.send({
        data: null,
        message: "Request status updated successfully",
        success: true,
      })
    }
    catch(error){
      res.send({
        data: null,
        message: "Request status did not get updated successfully",
        success: false,
      })
    }
})



module.exports = router;
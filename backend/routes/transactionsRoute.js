const authMiddleware = require('../middlewares/authMiddleware');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const router = require('express').Router();
const stripe = require("stripe")("sk_test_51MY4zBSF0vmHtKu5RAAstcA77PjEjbhmPbffdCnTYcrcdAvyRIm8JUnG5n6uWlm6zZig2hRZF5x48dnELQOpMa8N00cMBisrzI");
const { uuid } = require('uuidv4')
// transfer money from one account to another
router.post('/transfer-fund', authMiddleware,async(req, res)=>{
    try{
      // save the transaction
      const newTransaction = new Transaction(req.body);
      await newTransaction.save();

      //decrease the sender's balance 
      await User.findByIdAndUpdate(req.body.sender,{
        $inc: { balance: -req.body.amount },
      })

      //increase the receiver's balance
      await User.findByIdAndUpdate(req.body.receiver,{
        $inc: { balance: req.body.amount },
      })
      res.send({
        message: "Transaction Successful",
        data: newTransaction,
        success: true,
      })
    }
    catch(error){
        res.send({
            message: "Transaction Failed",
            data: error.message,
            success: false,
          })
    }
})

//verify receiver's account number
router.post("/verify-account",authMiddleware, async(req,res)=>{
    try{
       const user = await User.findOne({_id: req.body.receiver})
       if(user){
        res.send({
            message: "Account Verified",
            data: user,
            success: true,
        })
       }
       else{
        res.send({
            message: "Account Not Found",
            data: null,
            success: false,
        })
       }
    }
    catch(error){
      res.send({
        message: "Account Does Not Exist",
        data: error.message,
        success: false,
      })
    }
})

// get all transactions for a user

router.post('/get-all-transactions-by-user', authMiddleware, async(req,res)=>{
    try{
      const transactions = await Transaction.find({
        $or: [{ sender: req.body.userid}, {receiver: req.body.userid}],
      }).sort({createdAt: -1}).populate("sender").populate("receiver");
      res.send({
        message: "Transaction Fetched Successfully",
        data: transactions,
        success: true,
      })
    }
    catch(error){
      res.send({
        message: "Transactions Not Fetched Successfully",
        data: null,
        success: false,
      })
    }
})


// Deposit Funds using Stripe
router.post('/deposit-funds',authMiddleware,async(req,res)=>{
  try{
    const { token, amount } = req.body;
    // console.log(stripe);
    //create a customer
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    //create a charge
    const charge = await stripe.paymentIntents.create({
      amount: amount,
      currency: "USD",
      customer: customer.id,
      receipt_email: token.email,
      description: "Deposited to Online Banking System",
    },
    {
      idempotencyKey: uuid()
    }
   );

   // save the transaction
   if(charge.status === 'requires_payment_method'){
    const newTransaction = new Transaction({
      sender: req.body.userid,
      receiver: req.body.userid,
      amount: amount,
      type:"deposit",
      reference: "stripe deposit",
      status:"success",
    })
    await newTransaction.save();

    //increase the user's balance
    await User.findByIdAndUpdate(req.body.userid,{
      $inc: { balance: amount },
    })
    res.send({
      message: "Transaction successful",
      data: newTransaction,
      success: true,
    })
   }
   else{
    res.send({
      message: "Transaction Failed",
      data: charge,
      success: false,
    })
   }
  }
  catch(error){
    res.send({
      message: "Transaction Failed",
      data: error.message,
      success: false,
    })
  }
})


module.exports = router;
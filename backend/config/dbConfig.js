const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://BankingAdmin:AdminPassword@cluster0.lhz0gv8.mongodb.net/?retryWrites=true&w=majority")

const connectionResult = mongoose.connection;

connectionResult.on('error',()=>{
    console.log('connection error')
})
connectionResult.on('connected', ()=>{
    console.log('Connected to database successfully')
})


module.exports = connectionResult;
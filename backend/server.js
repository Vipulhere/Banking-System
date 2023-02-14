const express = require('express');
const app = express();
require('dotenv').config()
const dbConfig = require('./config/dbConfig');
const userRoute = require('./routes/userRoutes');
const transactionRoute = require('./routes/transactionsRoute');
const requestRoute = require('./routes/requestsRoute');

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use('/api/users',userRoute);
app.use('/api/transactions',transactionRoute);
app.use('/api/requests',requestRoute);

app.listen(PORT, ()=>{
   console.log(`Server running on Port ${PORT}`);
})
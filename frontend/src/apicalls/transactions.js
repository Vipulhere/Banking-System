import { axiosInstance } from ".";

// verify receiver account

export const VerifyAccount = async(payload) => {
    try{
      const { data } = await axiosInstance.post('/api/transactions/verify-account',payload);
      return data;
    }
    catch(error){
      return error.response.data;
    }
}

// transfer funds from one user to another

export const TransferFunds = async(payload) => {
    try{
        const { data } = await axiosInstance.post('/api/transactions/transfer-fund',payload);
        return data;
    }
    catch(error){
        return error.response.data;
    }
}

// get all transactions for a user

export const getTransactionsOfUser = async () => {
    try{
       const {data} = await axiosInstance.post('/api/transactions/get-all-transactions-by-user');
       return data;
    }
    catch(error){
        return error.response.data;
    }
}


export const DepositFunds = async(payload) => {
    try{
       const {data} = await axiosInstance.post('/api/transactions/deposit-funds',payload);
       return data;
    }
    catch(error){
        return error.response.data;
    }
}
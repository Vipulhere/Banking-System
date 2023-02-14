import React, {useEffect, useState} from 'react'
import PageTitle from '../../components/PageTitle'
import {message, Table} from 'antd'
import TransferFundsModal from './TransferFundsModal';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactionsOfUser } from '../../apicalls/transactions';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import moment from 'moment';
import DepositModal from './DepositModal';

function Transactions() {
  const [showTransferFundsModal, setShowTransferFundsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [data=[],setData] = useState([]);
  const {user} = useSelector(state=>state.users);
  const dispatch = useDispatch();
  const getData = async() => {
     try{
       dispatch(ShowLoading());
       const response = await getTransactionsOfUser();
       console.log(response.data)
       if(response.success){
        setData(response.data);
       }
       dispatch(HideLoading());
     }
     catch(error){
       dispatch(HideLoading());
       message.error(error.message);
     }
  }
  useEffect(()=>{
    getData();
  },[])
  const columns = [
    {
        title: "Date",
        dataIndex: "date",
        render: (text,record) => {
            return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
        }
    },
    {
        title: "Transaction ID",
        dataIndex: "_id",
    },
    {
        title: "Amount",
        dataIndex: "amount",
    },
    {
        title: "Type",
        dataIndex: "type",
        render: (text,record) => {
            return record.sender._id === user._id? "Debit" : "Credit"
        }
    },
    {
        title: "Reference Account",
        dataIndex: "",
        render: (text,record) => {
            return record.sender._id === user._id? <div>
                <h1 className='text-sm'>
                    {record.receiver.firstName} {record.receiver.lastName}
                </h1>
            </div> : <div>
                <h1 className='text-sm'>
                    {record.sender.firstName} {record.sender.lastName}
                </h1>
            </div>
        }
    },
    {
        title: "Reference",
        dataIndex: "reference",
    },
    {
        title: "Status",
        dataIndex: "status",
    },
  ]
  return (
    <div>
        <div className='flex justify-between items-center'>
        <PageTitle title="Transactions"/>
        <div className='flex gap-1'>
          <button className='primary-outline-btn' onClick={()=>setShowDepositModal(true)}>
            Deposit
          </button>
          <button className='primary-contained-btn' onClick={()=>setShowTransferFundsModal(true)}>
            Transfer
          </button>
        </div>
       </div>
       <Table columns={columns} dataSource={data} className='mt-2'/>
       {showTransferFundsModal && <TransferFundsModal showTransferFundsModal={showTransferFundsModal} setShowTransferFundsModal={setShowTransferFundsModal} reloadData={getData}/>}
       {showDepositModal && <DepositModal showDepositModal={showDepositModal} setShowDepositModal={setShowDepositModal} reloadData={getData}/>}
    </div>
  )
}

export default Transactions
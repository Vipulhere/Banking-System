import React, { useEffect,useState } from 'react'
import PageTitle from '../../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';
import moment from 'moment';
import { Tabs, message, Table } from 'antd'
import NewRequestModal from './NewRequestModal';
import { getAllRequestsByUser, UpdateRequestStatus } from '../../apicalls/requests';
import { ReloadUser } from '../../redux/usersSlice';
const { TabPane } = Tabs;

function Requests() {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [data,setData] = useState([]);
  const {user} = useSelector(state=>state.users);
  const dispatch = useDispatch();
  const getData = async() => {
     try{
       dispatch(ShowLoading());
       const response = await getAllRequestsByUser();
       console.log(response.data)
       if(response.success){
        const sendData = response.data.filter((item)=>item.sender._id===user._id)
        const receiverData = response.data.filter((item)=>item.receiver._id===user._id)
        setData({
            send: sendData,
            receiver: receiverData,
        });
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
  const updateStatus = async(record,status) => {
     try{
       if(status==="accepted" && record.amount > user.balance){
        return;
       }
       else{
        dispatch(ShowLoading());
       const response = await UpdateRequestStatus({
          ...record,
          status,
       })
       dispatch(HideLoading());
       if(response.success){
        message.success(response.message);
        getData();
        dispatch(ReloadUser(true))
       }
       else{
        message.error(response.message);
        }
       }
     }
     catch(error){
       dispatch(HideLoading());
       message.error(error.message)
     }
  }
  const columns = [
    {
        title: "Request ID",
        dataIndex: "_id", 
    },
    {
        title: "Sender",
        dataIndex: "sender",
        render(sender){
            return sender.firstName + " " + sender.lastName;
        },
    },
    {
        title: "Receiver",
        dataIndex: "receiver",
        render(receiver){
            return receiver.firstName + " " + receiver.lastName;
        },
    },
    { 
        title: "Amount",
        dataIndex: "amount",
    },
    {
        title: "Date",
        dataIndex: "date",
        render: (text,record) => {
            return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
        }
    },
    {
        title: "status",
        dataIndex: "status",
    },
    {
        title: "Action",
        dataIndex: "action",
        render:  (text,record) => {
            if(record.status === 'pending' && record.receiver._id===user._id){
                return <div className='flex gap-1'>
                 <h1 className='text-sm underline' onClick={()=>updateStatus(record, "rejected")}>Reject</h1>
                 <h1 className='text-sm underline' onClick={()=>updateStatus(record, "accepted")}>Accept</h1>
                </div>
            }
        }
    },
  ]
  
//   console.log(user);
  
  return (
    <div>
     <div className='flex justify-between'>
      <PageTitle title="Requests"/>
      <button className='primary-outline-btn' onClick={()=>setShowNewRequestModal(true)}>
          Request Funds
      </button>
     </div>
     <Tabs defaultActiveKey="1">
        <TabPane tab="Sent" key="1">
            <Table columns={columns} dataSource={data.send}/>
        </TabPane>
        <TabPane tab="Received" key="2">
            <Table columns={columns} dataSource={data.receiver}/>
        </TabPane>  
      </Tabs>
      {showNewRequestModal && <NewRequestModal showNewRequestModal={showNewRequestModal} setShowNewRequestModal={setShowNewRequestModal} reloadData={getData}/>}
    </div>
  )
}

export default Requests
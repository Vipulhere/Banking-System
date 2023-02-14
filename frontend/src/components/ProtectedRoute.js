import React,{useState,useEffect} from 'react'
import {message} from 'antd'
import { getUserInfo } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser, ReloadUser } from '../redux/usersSlice';
import { HideLoading, ShowLoading } from '../redux/loadersSlice';
import DefaultLayout from './DefaultLayout';

function ProtectedRoute(props) {
    const navigate = useNavigate();
    // const [userData, setUserData] = useState('');
    const {user,reloadUser} = useSelector((state)=>state.users)
    const dispatch = useDispatch();
    const getData = async() => {
      try{
          dispatch(ShowLoading())
          const response = await getUserInfo();
          dispatch(HideLoading())
          if(response.success){
              dispatch(SetUser(response.data));
          }
          else{
            message.error(response.message);
            navigate('/login')
          }
          dispatch(ReloadUser(false))
      }
      catch(error){
          dispatch(HideLoading())
          message.error(error.message);
          navigate('/login');
      }
    }
    useEffect(()=>{
    if(localStorage.getItem('token')){
        if(!user){
            getData();
        }
    }
    else{
        navigate('/login');
    }
    },[])
    useEffect(()=>{
       if(reloadUser){
        getData()
       }
    },[reloadUser])
  return (
    user && <div>
    <DefaultLayout>{props.children}</DefaultLayout>
</div>
  )
}

export default ProtectedRoute
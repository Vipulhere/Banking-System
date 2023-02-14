import React from 'react'
import {useNavigate} from 'react-router-dom';
import {Form, Row, Col, message} from 'antd';
import { LoginUser } from '../../apicalls/users';
import { useSelector, useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onFinish = async(values) => {
    try{
      dispatch(ShowLoading());
      const response = await LoginUser(values);
      console.log(response)
      dispatch(HideLoading());
      if(response.success){
        message.success(response.message);
        localStorage.setItem("token",response.data);
        window.location.href="/";
      }
      else{
        message.error(response.message);
      }
    }
    catch(error){
      dispatch(HideLoading());
      message.error(error.message);
    }
  }
  return (
    <div className='bg-primary flex items-center justify-center h-screen'>
    <div className='card w-400 p-3'>
    <div className='flex items-center justify-between'>
    <h1 className='text-2xl'>Online Banking System - Login</h1>
    </div>
    <hr/>
        <Form layout='vertical' onFinish={onFinish}>
            <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="email" name="email">
                    <input type="email" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Password" name="password">
                    <input type="password"/>
                  </Form.Item>
                </Col>
            </Row>
            <div className='flex justify-end'>
              <button className='primary-contained-btn w-screen' type="submit">Login</button>
            </div>
        </Form>
        <h1 className='text-sm underline mt-2' onClick={()=>navigate('/register')}>
           Not a Member? Register Here
        </h1>
    </div>
    </div>
  )
}

export default Login
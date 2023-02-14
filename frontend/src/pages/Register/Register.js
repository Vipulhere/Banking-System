import React from 'react'
import {Form, Row, Col, message} from 'antd'
import {useNavigate} from 'react-router-dom';
import { RegisterUser } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loadersSlice';

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onFinish = async(values) => {
    try{
      console.log(values);
      dispatch(ShowLoading())
      const response = await RegisterUser(values);
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message);
        navigate('/login');
      }
      else{
        message.error(response.message);
      }
    }
    catch(error){
      dispatch(HideLoading())
      message.error(error.message);
    }
  }
  return (
    <div className='m-5'>
    <div className='flex items-center justify-between'>
    <h1 className='text-2xl'>Online Banking System - Register</h1>
    <h1 className='text-sm underline' onClick={()=>navigate('/login')}>
        Already a Member? Login Here
    </h1>
    </div>
    <hr/>
        <Form layout='vertical' onFinish={onFinish}>
            <Row gutter={40}>
                <Col span={6} className="gutter-row" >
                  <Form.Item label="First Name" name="firstName">
                    <input type="text" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Last Name" name="lastName">
                    <input type="text" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="email" name="email">
                    <input type="email" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Mobile Number" name="phoneNumber">
                    <input type="Number" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Identification Type" name="identificationType">
                    <select>
                        <option value="NATIONAL_ID">National ID</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="DRIVING_LICENSE">Driving License</option>
                        <option value="SOCIAL_CARD">Social Security Card (SSN)</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Identification Number" name="identificationNumber">
                    <input type="Number"/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Address" name="address">
                    <textarea type="text"/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Password" name="password">
                    <input type="password"/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Confirm Password" name="confirmPassword">
                    <input type="password"/>
                  </Form.Item>
                </Col>
            </Row>
            <div className='flex justify-end'>
              <button className='primary-contained-btn' type="submit">Register</button>
            </div>
        </Form>
    </div>
  )
}

export default Register
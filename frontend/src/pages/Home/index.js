import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageTitle from '../../components/PageTitle'

function Home() {
  const {user} = useSelector(state=>state.users)
  const dispatch = useDispatch()
  return (
    <div>
      <PageTitle title={`Hello ${user.firstName} ${user.lastName}, welcome to the online banking system`}/>
      <div className='bg-tertiary p-2 mt-2 w-50 br-3 uppercase flex flex-col gap-1'>
        <div className='flex justify-between'>
          <h1 className='text-md text-white'>
            Account Number
          </h1>
          <h1 className='text-md text-white'>
            {user._id}          
          </h1>
        </div>
        <div className='flex justify-between'>
          <h1 className='text-md text-white'>
            Balance
          </h1>
          <h1 className='text-md text-white'>
            Rs {user.balance || 0}          
          </h1>
        </div>
      </div>
      <div className='card p-2 mt-2 w-50 br-3 uppercase br-3 flex flex-col gap-1'>
        <div className='flex justify-between'>
          <h1 className='text-md'>
            First Name
          </h1>
          <h1 className='text-md'>
            {user.firstName}          
          </h1>
        </div>
        <div className='flex justify-between'>
          <h1 className='text-md'>
            Last Name
          </h1>
          <h1 className='text-md'>
            {user.lastName}          
          </h1>
        </div>
        <div className='flex justify-between'>
          <h1 className='text-md'>
            Email
          </h1>
          <h1 className='text-md'>
            {user.email}          
          </h1>
        </div>
        <div className='flex justify-between'>
          <h1 className='text-md'>
            Mobile Number
          </h1>
          <h1 className='text-md'>
            {user.phoneNumber}          
          </h1>
        </div>
        <div className='flex justify-between'>
          <h1 className='text-md'>
            Identification Type
          </h1>
          <h1 className='text-md'>
            {user.identificationType}          
          </h1>
        </div>
        <div className='flex justify-between'>
          <h1 className='text-md'>
            Identification Number
          </h1>
          <h1 className='text-md'>
            {user.identificationNumber}          
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Home
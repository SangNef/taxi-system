import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-circular-gradient flex flex-col justify-center items-center">
      <h2 className='text-white text-3xl font-bold mb-8'>Taxi</h2>
      { children }
    </div>
  )
}

export default AuthLayout
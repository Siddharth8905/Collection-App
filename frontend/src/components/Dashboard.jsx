import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import "../Styles/dashboard.css"

export default function Dashboard() {
  const [name,Setname]=useState(localStorage.getItem("financename") || "")
  useEffect(() => {
    if (!name) {
      alert("Please login first")
      navigate("/")   // redirect to login
    }
  }, [name])
  return (
    <div className="main">
      <div className="dashboard-container">
        
        <h1 className="dashboard-title">Dashboard {name}</h1>

        <div className="dashboard-links">
          <Link to="/ViewCustomer">View Customers</Link>
          <Link to="/AddCustomer">Add New Customer</Link>
          <Link to="/">Logout</Link>
        </div>

      </div>
    </div>
  )
}
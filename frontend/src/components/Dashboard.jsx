import React from 'react'
import { Link } from 'react-router-dom'
import "../Styles/dashboard.css"

export default function Dashboard() {
  return (
    <div className="main">
      <div className="dashboard-container">

        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-links">
          <Link to="/ViewCustomer">View Customers</Link>
          <Link to="/AddCustomer">Add New Customer</Link>
          <Link to="/">Logout</Link>
        </div>

      </div>
    </div>
  )
}
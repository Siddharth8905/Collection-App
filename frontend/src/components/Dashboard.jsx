import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
        <h1>dashboard</h1>
        View Customer - <Link to="/ViewCustomer">view</Link><br/>
        Add new customer - <Link to="/AddCustomer">Add</Link><br></br>
        Logout ? <Link to="/">Logout</Link>
    </div>
  )
}

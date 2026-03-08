import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import "../Styles/viewcutomer.css"
export default function ViewCustomer() {

    const [customers, setCustomers] = useState([])
    const [input, setInput] = useState("")
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        fetchcust()
    }, [location])

    const fetchcust = async () => {
        try {
            const res = await axios.get("http://localhost:1008/customer/getcustomer")
            console.log("API DATA:", res.data)
            setCustomers(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdate = (id) => {
        navigate(`/Updatecustomer/${id}`)
    }

    const totalInvestment = customers.reduce(
        (sum, cust) => sum + Number(cust.balance || 0),
        0
    )
    const filteredCustomers = customers.filter((cust) =>
        cust.cust_name.toLowerCase().includes(input.toLowerCase())
    )

    return (
        <div className="main">

            <div className="view-container">

                <h1 className="view-title">View Customers</h1>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Enter Customer Name"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <table className="customer-table">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Interest</th>
                            <th>Type</th>
                            <th>Installment</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Balance</th>
                            <th>Update</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((cust) => (
                                <tr key={cust._id}>
                                    <td>{cust.cust_name}</td>
                                    <td>{cust.cust_amt}</td>
                                    <td>{cust.cust_interest}%</td>
                                    <td>{cust.collection_type}</td>
                                    <td>{cust.installment}</td>
                                    <td>{new Date(cust.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(cust.end_date).toLocaleDateString()}</td>
                                    <td>{cust.balance}</td>
                                    <td>
                                        <button onClick={() => handleUpdate(cust._id)}>
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No customers found</td>
                            </tr>
                        )}

                    </tbody>

                </table>

                <div className="summary">
                    Total Investment: ₹ {totalInvestment}
                </div>

                <Link className="back-link" to={"/Dashboard"}>
                    Back
                </Link>

            </div>

        </div>
    )
}
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import "../Styles/update.css"

export default function UpdateCustomer() {

    const { id } = useParams()
    const [customer, setCustomer] = useState(null)
    const [payment, setPayment] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        fetchcust()
    }, [id])

    const fetchcust = async () => {
        const res = await axios.get(`http://localhost:1008/customer/getcustomer/${id}`)
        setCustomer(res.data)
    }

    const updateBalance = async () => {

        const payAmount = Number(payment)

        if (!payAmount || payAmount <= 0) {
            return alert("Enter valid payment amount")
        }

        if (payAmount > customer.balance) {
            return alert("Payment exceeds remaining balance")
        }

        try {

            const newbalance = customer.balance - payAmount
            const newpaid = customer.paid + payAmount

            await axios.put(
                `http://localhost:1008/customer/updatebalance/${id}`,
                {
                    balance: newbalance,
                    paid: newpaid
                }
            )

            await fetchcust()
            alert("Balance Updated")
            navigate("/Viewcustomer")

        }
        catch (err) {
            console.log(err)
        }
    }

    const deleteCustomer = async () => {
        try {
            await axios.delete(`http://localhost:1008/customer/deleteCustomer/${id}`)
            alert("Customer Deleted")
            navigate("/Dashboard")
        }
        catch (err) {
            console.log(err)
        }
    }

    if (!customer) {
        return <h2>Loading...</h2>
    }

    return (
        <div className="main">

            <div className="update-container">

                <h1 className="update-title">Customer Details</h1>

                <form className="update-form">

                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={customer.cust_name} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Amount:</label>
                        <input type="text" value={customer.cust_amt} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Interest:</label>
                        <input type="text" value={customer.cust_interest} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Installment:</label>
                        <input type="text" value={customer.installment} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Amount Paid:</label>
                        <input type="text" value={customer.paid} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Balance:</label>
                        <input type="text" value={customer.balance} readOnly />
                    </div>

                    {customer.balance === 0 ? (

                        <div className="pay-group">
                            <button type="button" className="delete-btn" onClick={deleteCustomer}>
                                Delete
                            </button>
                        </div>

                    ) : (

                        <div className="pay-group">

                            <input
                                type="number"
                                placeholder="Enter payment"
                                value={payment}
                                onChange={(e) => setPayment(Number(e.target.value))}
                            />

                            <button type="button" onClick={updateBalance}>
                                Pay
                            </button>

                        </div>

                    )}

                </form>

                <Link className="back-link" to="/Viewcustomer">
                    Back
                </Link>

            </div>

        </div>
    )
}
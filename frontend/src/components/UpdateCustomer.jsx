import React, { useState, useEffect } from 'react'
import axios from '../services/api'
import { Link, useParams, useNavigate } from 'react-router-dom'
import "../Styles/update.css"

export default function UpdateCustomer() {

    const { id } = useParams()
    const [customer, setCustomer] = useState(null)
    const [payment, setPayment] = useState("")
    const navigate = useNavigate()
    const [name,Setname]=useState(localStorage.getItem("financename") || "")
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        if (!name) {
            alert("Finance name missing. Please login again.")
            navigate("/")
        }
    }, [name])

    useEffect(() => {
        if (name) {
            fetchcust()
            fetchTransactions()
        }
    }, [id, name])

    const fetchcust = async () => {
        const res = await axios.get(`/customer/getcustomer/${name}/${id}`)
        setCustomer(res.data)
        // DEFAULT VALUE = INSTALLMENT
        setPayment(res.data.installment)

    }
    const fetchTransactions = async () => {
        try {
            const res = await axios.get(
                `/customer/transactions/${name}/${id}`
            )
            setTransactions(res.data)
        }
        catch (err) {
            console.log(err)
        }
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

            const currentBalance = Number(customer.balance)
            const newbalance = currentBalance - payAmount

            let penaltyAmount = 0
            if (newbalance === 0) {
                const getYYYYMMDD = (date) => {
                    const d = new Date(date)
                    const year = d.getFullYear()
                    const month = String(d.getMonth() + 1).padStart(2, '0')
                    const day = String(d.getDate()).padStart(2, '0')
                    return `${year}-${month}-${day}`
                }
                const todayStr = getYYYYMMDD(new Date())
                const endStr = getYYYYMMDD(customer.end_date)
                
                if (todayStr > endStr) {
                    const enterPenalty = confirm("This due is being completed after the end date. Do you want to impose a penalty?")
                    if (enterPenalty) {
                        const inputPenalty = prompt("Enter penalty amount (0 for none):", "0")
                        penaltyAmount = Number(inputPenalty) || 0
                    }
                }
            }

            await axios.put(
                `/customer/updatebalance/${name}/${id}`,
                {
                    balance: newbalance,
                    amount: payAmount,
                    type: "payment",
                    penaltyAmount: penaltyAmount
                }
            )

            await fetchcust()
            await fetchTransactions()
            alert("Balance Updated")
            navigate("/Viewcustomer")

        }
        catch (err) {
            console.log(err)
        }
    }

    const withdrawBalance = async () => {

        const reduceamt=Number(prompt("enter amt to withdraw:"))
        if(!reduceamt || reduceamt<=0){
            return alert("Enter a valid amount")
        }
        try {

            const currentBalance = Number(customer.balance)
            // const currentPaid = Number(customer.paid)

            const newbalance = currentBalance + reduceamt
            // const newpaid = currentPaid - reduceamt

            await axios.put(
                `/customer/updatebalance/${name}/${id}`,
                {
                    balance: newbalance,
                    amount: reduceamt,
                    type: "withdraw"
                    // paid: newpaid
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
            const confirm=window.confirm("Do you want to delete the customer ?")
            if(confirm){
                
                await axios.delete(`/customer/deleteCustomer/${name}/${id}`)
                alert("Customer Deleted")
                navigate("/Dashboard")
            }
            else {
                alert("process terminated !")
            }
        }
        catch (err) {
            console.log(err)
        }
    }
    const renewcustomer=()=>{
        navigate(`/RenewCustomer/${id}`,{
            state :{customer}
        })
    }

    if (!customer) {
        return <h2>Loading...</h2>
    }

    return (
        <div className="main">
            <div className="details-wrapper">

                {/* LEFT SIDE */}
                <div className="update-container">

                <h1 className="update-title">{name} Customer Details</h1>

                <form className="update-form">

                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" value={customer.cust_name} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Number:</label>
                        <input type="text" value={customer.cust_number} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Location:</label>
                        <input type="text" value={customer.cust_location} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Amount:</label>
                        <input type="text" value={customer.cust_amt} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Type:</label>
                        <input type="text" value={customer.collection_type} readOnly/>
                    </div>
                    <div className="form-group">
                        <label>Interest:</label>
                        <input type="text" value={customer.cust_interest} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Start Date:</label>
                        <input type="text" value={new Date(customer.start_date).toLocaleDateString("en-GB")} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Installment:</label>
                        <input type="text" value={customer.installment} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Amount Paid:</label>
                        {/* customer.paid */}
                        <input type="text" value={customer.cust_amt-customer.balance} readOnly /> 
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

                            <button type="button" className="delete-btn" onClick={renewcustomer} >
                                Renew Customer
                            </button>
                            <button type="button" className="delete-btn" style={{ background: "rgba(197, 168, 128, 0.15)", color: "var(--accent-gold)", border: "1px solid var(--border-gold)" }} onClick={() => navigate("/CustomerHistory", { state: { customerId: id } })}>
                                History
                            </button>
                            <Link className="back-link" to="/Viewcustomer">Back</Link>
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
                            <button type="button" onClick={withdrawBalance}>
                                WithDraw
                            </button>
                            <button type="button" style={{ background: "rgba(197, 168, 128, 0.15)", color: "var(--accent-gold)", border: "1px solid var(--border-gold)" }} onClick={() => navigate("/CustomerHistory", { state: { customerId: id } })}>
                                History
                            </button><br/>
                            <Link className="back-link" to="/Viewcustomer">Back</Link>
                        </div>
                        

                    )}
                    </form>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="transaction-panel">

                        <h2 className="transaction-title">
                            Transaction History
                        </h2>

                        <div className="transaction-list">

                            {
                                transactions.length > 0 ? (

                                    transactions.map((t) => (

                                        <div
                                            key={t._id}
                                            className="transaction-card"
                                        >

                                            <p>
                                                Type : {t.type}
                                            </p>

                                            <p>
                                                Amount : ₹{t.amount}
                                            </p>

                                            <p>
                                                Date :
                                                {
                                                    new Date(
                                                        t.payment_date
                                                    ).toLocaleDateString("en-GB")
                                                }
                                            </p>

                                        </div>

                                    ))

                                ) : (

                                    <p>No Transactions Found</p>
                                )
                            }

                        </div>

                    </div>
                
                </div>
                
                

            </div>

        
    )
}
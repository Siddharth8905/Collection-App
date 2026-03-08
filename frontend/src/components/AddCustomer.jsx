import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../Styles/addcustomer.css"

export default function AddCustomer() {

    const [custname, setCustname] = useState("")
    const [amount, setAmount] = useState(0)
    const [detectedamt, setDetectedamt] = useState("")
    const [percentage, setPercentage] = useState(0)
    const [type, settype] = useState("")
    const [dailyamt, setDailyamt] = useState("")
    const [weeklyamt, setWeeklyamt] = useState("")
    const [balance, setBalance] = useState("")
    const [status, setstatus] = useState("")
    const [paid, Setpaid] = useState(0)

    const navigate = useNavigate()

    const daysMap = {
        daily: 100,
        weekly: 10
    }

    const days = daysMap[type] || 0

    const [startDate, setstartDate] = useState(new Date())

    const [endDate, setendDate] = useState(() => {
        const nextDate = new Date()
        nextDate.setDate(nextDate.getDate() + days)
        return nextDate
    })

    const handleStartDateChange = (e) => {
        const newStart = new Date(e.target.value)
        setstartDate(newStart)
    }

    useEffect(() => {

        if (type && startDate) {
            const newEnd = new Date(startDate)
            newEnd.setDate(startDate.getDate() + days)
            setendDate(newEnd)
        }

        let newdetected

        if (days !== 0) {

            if (type === "daily") {
                newdetected = amount - ((percentage / 100) * amount)
                setDetectedamt(newdetected)
                setDailyamt((amount) / days)
                setBalance(amount)
            }

            else {
                newdetected = amount + ((percentage / 100) * amount)
                setDetectedamt(newdetected)
                setWeeklyamt((newdetected) / days)
                setBalance(newdetected)
            }
        }

    }, [type, startDate, amount, percentage, days])

    const installment = type === "daily" ? dailyamt : weeklyamt

    const savedata = async (e) => {

        e.preventDefault()

        if (!custname || !amount || !percentage || !type || !startDate) {
            return alert("Fill all the fields")
        }

        try {

            const s = {
                cust_name: custname, cust_amt: amount, cust_interest: percentage, collection_type: type, amount_given: detectedamt, start_date: startDate.toISOString(), end_date: endDate.toISOString(), 
                installment, balance, paid
            }

            const r = await axios.post("http://localhost:1008/customer/registercustomer", s)

            if (r.data.msg === "Customer added") {
                setstatus("Customer Registered Successfully")
                navigate("/Dashboard")
            }

            else if (r.data.msg === "Customer Exist") {
                setstatus("Customer Already Exists")
            }

            else {
                setstatus("Something went wrong")
            }

        }

        catch (err) {
            console.log(err)
            setstatus("Something went wrong")
        }

    }

    return (

        <div className="main">

            <div className="add-container">

                <h1 className="add-title">Add Customer</h1>

                <form className="add-form" onSubmit={savedata}>

                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" required onChange={(e) => setCustname(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Amount:</label>
                        <input type="number" min="0" required onChange={(e) => setAmount(Number(e.target.value))} />
                    </div>

                    <div className="form-group">
                        <label>Interest %:</label>
                        <input type="number" step="0.5" min="0" required onChange={(e) => setPercentage(Number(e.target.value))} />
                    </div>

                    <div className="form-group">
                        <label>Collection Type:</label>
                        <select value={type} onChange={(e) => settype(e.target.value)}>
                            <option value="">Select Type</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{type === "daily" ? "Amount After Deduction:" : "Amount To Pay:"}</label>
                        <input type="number" value={detectedamt} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={handleStartDateChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>End Date:</label>
                        <input
                            type="date"
                            value={endDate.toISOString().split('T')[0]}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>{type === "daily" ? "Daily Installment:" : "Weekly Installment:"}</label>
                        <input type="number" value={installment} readOnly />
                    </div>

                    <button type="submit">Create Customer</button>

                </form>

                <div className="status-msg">{status}</div>

                <Link className="back-link" to="/Dashboard">
                    ← Back
                </Link>

            </div>

        </div>

    )
}
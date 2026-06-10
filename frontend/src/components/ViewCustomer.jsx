import axios from '../services/api'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import "../Styles/viewcutomer.css"

export default function ViewCustomer() {

    const [customers, setCustomers] = useState([])
    const [input, setInput] = useState("")
    const [type, settype] = useState("")
    // NEW STATE FOR PAYMENT VALUES
    const [payments, setPayments] = useState({})

    const navigate = useNavigate()
    const location = useLocation()

    const [name, Setname] = useState(
        localStorage.getItem("financename") || ""
    )

    useEffect(() => {

        if (!name) {
            alert("Finance name missing. Please login again.")
            navigate("/")
        }

    }, [name])

    useEffect(() => {

        if (name) {
            fetchcust()
        }

    }, [location, name])

    const fetchcust = async () => {

        try {

            const res = await axios.get(
                `/customer/getcustomers/${name}`
            )

            console.log("API DATA:", res.data)
            
            setCustomers(res.data)

            // NEWLY ADDED
            // DEFAULT PAYMENT = INSTALLMENT
            const defaultPayments = {}

            res.data.forEach((cust) => {
                defaultPayments[cust._id] = cust.installment
            })

            setPayments(defaultPayments)

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

    const filteredCustomers = customers.filter((cust) => {

    const matchesName =cust.cust_name.toLowerCase().includes(input.toLowerCase())

    const matchesType =type === "" ||cust.collection_type.toLowerCase() === type.toLowerCase()

    return matchesName && matchesType
})

    // NEWLY ADDED FUNCTION
    const updateBalance = async (cust) => {

        try {

            const payAmount = Number(payments[cust._id])
            const currentBalance = Number(cust.balance)
            if (payAmount <= 0) {
                alert("Enter a valid amount")
                return
            }
            if (payAmount > currentBalance) {
                alert("Payment exceeds balance")
                return
            }


            // CALCULATE NEW BALANCE
            const newBalance = currentBalance - payAmount

            let penaltyAmount = 0
            if (newBalance === 0) {
                const getYYYYMMDD = (date) => {
                    const d = new Date(date)
                    const year = d.getFullYear()
                    const month = String(d.getMonth() + 1).padStart(2, '0')
                    const day = String(d.getDate()).padStart(2, '0')
                    return `${year}-${month}-${day}`
                }
                const todayStr = getYYYYMMDD(new Date())
                const endStr = getYYYYMMDD(cust.end_date)

                if (todayStr > endStr) {
                    const enterPenalty = confirm("This due is being completed after the end date. Do you want to impose a penalty?")
                    if (enterPenalty) {
                        const inputPenalty = prompt("Enter penalty amount (0 for none):", "0")
                        penaltyAmount = Number(inputPenalty) || 0
                    }
                }
            }

            // API CALL
            await axios.put(
                `/customer/updatebalance/${name}/${cust._id}`,
                {
                    balance: newBalance,
                    amount: payAmount,
                    type: "payment",
                    penaltyAmount: penaltyAmount
                }
            )

            alert("Payment Updated Successfully")

            // REFRESH CUSTOMER DATA
            fetchcust()

        } catch (err) {
            console.log(err)
        }
    }

    const addFavorite = async (id) => {
        try {
            const res = await axios.put(
                `/customer/favorite/${name}/${id}`
            )
            console.log("Favorite API Response:", res.data)
            fetchcust()
        }
        catch (err) {
            console.error("Error toggling favorite:", err)
            alert("Error updating favorite: " + (err.response?.data?.msg || err.message))
        }
    }
    return (

        <div className="main">

            <div className="view-container">

                <h1 className="view-title">
                    View Customers {name}
                </h1>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Enter Customer Name"
                        value={input}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                    />

                </div>
                <div className="form-group">
                        <label>Collection Type:</label>
                        <select value={type}onChange={(e) => settype(e.target.value)}>
                            <option value="">Select Type</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                </div>

                <div className="table-wrapper">

                    <table className="customer-table">

                        <thead>

                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Interest</th>
                                {/* <th>Type</th> */}
                                <th>Installment</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Balance</th>
                                <th>Pay</th>
                                <th>Update</th>
                                <th>Favorite</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredCustomers.length > 0 ? (

                                filteredCustomers.map((cust) => (

                                    <tr key={cust._id}>

                                        <td>{cust.cust_name}</td>

                                        <td>{cust.cust_amt}</td>

                                        <td>{cust.cust_interest}%</td>

                                        {/* <td>{cust.collection_type}</td> */}

                                        <td>{cust.installment}</td>

                                        <td>
                                            {
                                                new Date(
                                                    cust.start_date
                                                ).toLocaleDateString("en-GB")
                                            }
                                        </td>

                                        <td>
                                            {
                                                new Date(
                                                    cust.end_date
                                                ).toLocaleDateString("en-GB")
                                            }
                                        </td>

                                        <td>{cust.balance}</td>

                                        {/* PAY COLUMN */}
                                        <td>

                                            <input
                                                type="number"

                                                // DEFAULT VALUE
                                                value={
                                                    payments[cust._id] || ""
                                                }

                                                // UPDATE PAYMENT VALUE
                                                onChange={(e) =>
                                                    setPayments({
                                                        ...payments,
                                                        [cust._id]:
                                                            e.target.value
                                                    })
                                                }
                                            />

                                            <button
                                                type="button"

                                                // PASS CUSTOMER
                                                onClick={() =>
                                                    updateBalance(cust)
                                                }
                                            >
                                                Pay
                                            </button>

                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    handleUpdate(cust._id)
                                                }
                                            >
                                                Update
                                            </button>

                                        </td>

                                        <td>
                                            <button
                                                onClick={() => addFavorite(cust._id)}
                                            >
                                                {cust.favorite ? "★" : "☆"}
                                            </button>
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="10">
                                        No customers found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                <div className="summary">
                    Total Investment: ₹ {totalInvestment}
                </div>

                <Link
                    className="back-link"
                    to={"/Dashboard"}
                >
                    Back
                </Link>

            </div>

        </div>
    )
}
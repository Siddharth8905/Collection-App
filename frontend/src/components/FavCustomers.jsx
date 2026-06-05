import React, { useEffect, useState } from "react"
import axios from "../services/api"
import { Link, useNavigate } from "react-router-dom"
import "../Styles/viewcutomer.css"

export default function Favorites() {

    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [payments, setPayments] = useState({})
    const navigate = useNavigate()
    const name = localStorage.getItem("financename") || ""

    useEffect(() => {
        if (!name) {
            alert("Finance name missing. Please login again.")
            navigate("/")
            return
        }
        loadFavorites()
    }, [name])

    const loadFavorites = async () => {
        try {
            setLoading(true)
            const res = await axios.get(
                `/customer/favorites/${name}`
            )
            setFavorites(res.data)
            
            const defaultPayments = {}
            res.data.forEach((cust) => {
                defaultPayments[cust._id] = cust.installment
            })
            setPayments(defaultPayments)
        } catch (err) {
            console.log(
                "ERROR:",
                err.response?.data || err.message
            )
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = (id) => {
        navigate(`/EditCustomer/${id}`)
    }
    if (loading) {
        return <h2>Loading...</h2>
    }
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
            // if(cust.balance-payAmount>=0){
                const newBalance =
                Number(cust.balance) - payAmount

            // }
            
            

            // API CALL
            await axios.put(
                `/customer/updatebalance/${name}/${cust._id}`,
                {
                    balance: newBalance,
                    amount: payAmount,
                    type: "payment"
                }
            )

            // alert("Payment Updated Successfully")

            // REFRESH CUSTOMER DATA
            loadFavorites()

        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className="main">
            <div className="view-container">
                <h1 className="view-title">
                    Daily Ledger - {name}
                </h1>
                <div className="table-wrapper fav-table-wrapper">
                    <table className="customer-table fav-customer-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                {/* <th>Amount</th> */}
                                
                                {/* <th>Installment</th> */}
                                <th>Balance</th>
                                <th>Pay</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favorites.length > 0 ? (
                                favorites.map((cust) => (
                                    <tr key={cust._id}>
                                        <td>{cust.cust_name}</td>
                                        {/* <td>{cust.cust_amt}</td> */}
                                        {/* <td>{cust.installment}</td> */}
                                        <td>{cust.balance}</td>
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
                                            <button onClick={() =>handleUpdate(cust._id)}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">
                                        No favorite customers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Link className="back-link" to="/Dashboard">Back</Link>
            </div>
        </div>
    )
}
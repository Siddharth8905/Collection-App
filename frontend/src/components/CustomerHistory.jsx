import React, { useEffect, useState } from "react"
import axios from "../services/api"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "../Styles/viewcutomer.css"

export default function CustomerHistory() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const name = localStorage.getItem("financename") || ""
    const customerId = location.state?.customerId

    useEffect(() => {
        if (!name) {
            alert("Finance name missing. Please login again.")
            navigate("/")
            return
        }
        fetchHistory()
    }, [name, customerId])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const url = customerId 
                ? `/customer/history/${name}?customerId=${customerId}` 
                : `/customer/history/${name}`
            const res = await axios.get(url)
            setHistory(res.data)
        } catch (err) {
            console.error("Error fetching history:", err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <h2>Loading...</h2>
    }

    return (
        <div className="main">
            <div className="view-container">
                <h1 className="view-title">
                    Customer Due History - {name}
                </h1>
                
                <div className="table-wrapper">
                    <table className="customer-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Borrowed Amount</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Completed Date</th>
                                <th>Penalty Imposed</th>
                                <th>Penalty Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((record) => (
                                    <tr key={record._id}>
                                        <td>{record.cust_name}</td>
                                        <td>₹ {record.borrowed_amount}</td>
                                        <td>
                                            {record.start_date
                                                ? new Date(record.start_date).toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {record.end_date
                                                ? new Date(record.end_date).toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {record.payment_date
                                                ? new Date(record.payment_date).toLocaleDateString("en-GB")
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {record.penalty_amount > 0 ? (
                                                <span style={{ color: "#d4af37", fontWeight: "bold" }}>Yes</span>
                                            ) : (
                                                <span style={{ color: "#a0aec0" }}>No</span>
                                            )}
                                        </td>
                                        <td>
                                            {record.penalty_amount > 0 ? `₹ ${record.penalty_amount}` : "—"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No completed dues found in history.
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

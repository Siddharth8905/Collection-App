import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "../Styles/update.css"

import {Link, useParams, useNavigate, useLocation} from 'react-router-dom'

export default function RenewCustomer() {

    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const oldCustomer = location.state?.customer
    const [name] = useState( localStorage.getItem("financename") || "")
    const [customer, setCustomer] = useState({
        cust_name: "",
        cust_number:"",
        cust_location:"",
        cust_amt: "",
        cust_interest: "",
        collection_type: "",
        installment: "",
        start_date: "",
        end_date: "",
        // paid: 0,
        balance: 0
    })

    useEffect(() => {

        if (!name) {
            alert("Finance name missing. Please login again.")
            navigate("/")
        }
    }, [name, navigate])

    useEffect(() => {
        if (oldCustomer) {
            const today = new Date().toISOString().split("T")[0]

            setCustomer({

                ...oldCustomer,
                start_date: oldCustomer.start_date
                    ? oldCustomer.start_date.split("T")[0]
                    : new Date().toISOString().split("T")[0],
                end_date: oldCustomer.end_date
                    ? oldCustomer.end_date.split("T")[0]
                    : "",
                collection_type: oldCustomer.collection_type || "Daily",
                // paid: 0,
                balance: Number(oldCustomer.cust_amt)
            })

        }
        else {
            alert("Customer data missing")
            navigate("/Viewcustomer")
        }
    }, [oldCustomer, navigate])

    useEffect(() => {
        if (
            customer.start_date &&
            customer.collection_type
        ) {
            const startDate = new Date(
                customer.start_date
            )
            let endDate = new Date(startDate)
            if (
                customer.collection_type
                    .toLowerCase() === "daily"
            ) {
                endDate.setDate(
                    startDate.getDate() + 100
                )
            }
            else if (
                customer.collection_type
                    .toLowerCase() === "weekly"
            ) {
                endDate.setDate(
                    startDate.getDate() + 70
                )
            }

            setCustomer(prev => ({
                ...prev,
                end_date: endDate
                    .toISOString()
                    .split("T")[0]
            }))
        }
        let newBalance=0
            if(customer.collection_type.toLocaleLowerCase()==="weekly"){
                newBalance=Number(customer.cust_amt)+(Number(customer.cust_amt)*Number(customer.cust_interest))/100
            }

            else newBalance =Number(customer.cust_amt)
            setCustomer(prev => ({
                ...prev,
                balance: newBalance
            }))
    }, [
        customer.start_date,
        customer.collection_type,
        customer.cust_amt
    ])
    const renewLoan = async () => {
        try {
            
            const updatedCustomer = {

                ...customer,

                cust_amt: Number(customer.cust_amt),
                cust_number:customer.cust_number,
                cust_location:customer.cust_location,
                cust_interest: Number( customer.cust_interest),
                installment: Number( customer.installment),
                collection_type: customer.collection_type,
                start_date: customer.start_date,
                end_date: customer.end_date,
                // paid: 0,
                balance:customer.balance
            }

            await axios.put( `http://localhost:1008/customer/updatecustomer/${name}/${id}`, updatedCustomer )
            alert(
                "Customer Renewed Successfully"
            )
            navigate("/Viewcustomer")
        }
        catch (err) {
            console.log(err)
            alert("Failed to renew customer")
        }
    }
    let paid=0
    paid=customer.cust_amt-customer.balance
    if(paid<0)paid=0
    return (

        <div className="main">
            <div className="update-container">
                <h1 className="update-title">
                    {name} Renew Details
                </h1>

                <form className="update-form">

                    <div className="form-group">

                        <label>Name:</label>

                        <input
                            type="text"
                            value={customer.cust_name}
                            readOnly
                        />

                    </div>
                    <div className="form-group">
                        <label>Number:</label>
                        <input type="text" value={customer.cust_number} minLength={10} maxLength={10} onChange={(e)=>setCustomer({
                            ...customer,
                            cust_number:e.target.value
                        })} />
                    </div>

                    <div className="form-group">
                        <label>Location:</label>
                        <input type="text" value={customer.cust_location} onChange={(e)=>setCustomer({
                            ...customer,
                            cust_location:e.target.value
                        })} />
                    </div>

                    <div className="form-group">

                        <label>Amount:</label>

                        <input
                            type="number"
                            value={customer.cust_amt}
                            onChange={(e) =>
                                setCustomer({

                                    ...customer,

                                    cust_amt:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Interest:</label>

                        <input
                            type="number"
                            value={customer.cust_interest}
                            onChange={(e) =>
                                setCustomer({

                                    ...customer,

                                    cust_interest:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>Installment:</label>

                        <input
                            type="number"
                            value={customer.installment}
                            onChange={(e) =>
                                setCustomer({

                                    ...customer,

                                    installment:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Collection Type:
                        </label>

                        <select

                            value={
                                customer.collection_type
                            }

                            onChange={(e) =>
                                setCustomer({

                                    ...customer,

                                    collection_type:
                                        e.target.value
                                })
                            }
                        >

                            <option value="">
                                Select Type
                            </option>

                            <option value="Daily">
                                Daily
                            </option>

                            <option value="Weekly">
                                Weekly
                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Start Date:</label>

                        <input
                            type="date"
                            value={customer.start_date}
                            onChange={(e) =>
                                setCustomer({

                                    ...customer,

                                    start_date:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    <div className="form-group">

                        <label>End Date:</label>

                        <input
                            type="date"
                            value={customer.end_date}
                            readOnly
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Amount Paid:
                        </label>

                        <input
                            type="text"
                            value={paid}
                            readOnly
                        />

                    </div>

                    <div className="form-group">

                        <label>Balance:</label>

                        <input
                            type="text"
                            value={customer.balance}
                            readOnly
                        />

                    </div>

                    <div className="pay-group">

                        <button
                            type="button"
                            className="delete-btn"
                            onClick={renewLoan}
                        >

                            Renew Loan

                        </button>

                    </div>

                </form>

                <Link
                    className="back-link"
                    to="/Viewcustomer"
                >

                    Back

                </Link>

            </div>

        </div>
    )
}
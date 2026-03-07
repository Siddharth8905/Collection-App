import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { Link,useParams,useNavigate } from 'react-router-dom'
export default function UpdateCustomer() {
    const{id}=useParams()
    const [customer,setCustomer]=useState(null)
    const [payment,setPayment]=useState(0)
    const navigate=useNavigate()
    useEffect(()=>{
        fetchcust()
    },[id])
    const fetchcust=async()=>{
        const res=await axios.get(`http://localhost:1008/customer/getcustomer/${id}`)
        setCustomer(res.data)
        // console.log(res.data)
    }

    const updateBalance=async()=>{
        const payAmount = Number(payment);
        if (!payAmount || payAmount <= 0) {
            return alert("Enter valid payment amount");
        }

        if (payAmount > customer.balance) {
            return alert("Payment exceeds remaining balance");
        }
        try{
            if(customer.balance-payment>=0){
                const newbalance=customer.balance-payment
                const newpaid=customer.paid+payment
    
                const res= await axios.put(`http://localhost:1008/customer/updatebalance/${id}`,
                    {
                        balance:newbalance,
                        paid:newpaid
                    }
                )
                await fetchcust()
                alert("Balance Updated")
                navigate("/Viewcustomer")
            }
            else{
                if(customer.balance==0){
                    alert("Loan completed")
                }
                else 
                    alert("Customer has a lower due amount ")
            }
        }
        catch(err){
            console.log(err)
        }
    }
    if (!customer) {
        return <h2>Loading...</h2>;
    }

    const deleteCustomer=async()=>{
        try{
            alert("Customer Deleted")
            navigate("/Dashboard")
            const res=await axios.delete(`http://localhost:1008/customer/deleteCustomer/${id}`)

        }
        catch(err){
            console.log(err)
        }
    }
  return (
    <div>
        <h1>Cust details</h1>
        <form>
            <label>Name: <input type="text" value={customer.cust_name} readOnly/></label><br/>
            <label>Amount: <input type="text" value={customer.cust_amt} readOnly/></label><br/>
            <label>Interest: <input type="text" value={customer.cust_interest} readOnly/></label><br/>
            <label>Installment: <input type="text" value={customer.installment} readOnly/></label><br/>
            <label>Amount Paid: <input type="text"  value={customer.paid}readOnly/></label><br/>
            <label>Balance: <input type="text" value={customer.balance} readOnly/></label><br/>
            {/* <label>Pay Now: <input type="Number"  onChange={(e)=>{setPayment(Number(e.target.value))}}required/></label><button type="button" onClick={updateBalance}>Pay</button><br/> */}
            {customer.balance===0 ? (<><button type="button" onClick={deleteCustomer} >delete</button> <button>update</button></>) :
            (<><label>Pay Now: <input type="Number" value={payment} onChange={(e)=>{setPayment(Number(e.target.value))}}required/></label><button type="button" onClick={updateBalance}>Pay</button><br/></>
            )}
        </form>
        back -<Link to="/Viewcustomer">back</Link>
    </div>
  )
}

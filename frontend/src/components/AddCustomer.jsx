import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'

export default function AddCustomer() {
    const [custname,setCustname]=useState("")
    const [amount,setAmount]=useState(0)
    const [detectedamt,setDetectedamt]=useState("")
    const [percentage,setPercentage]=useState(0)
    const [type,settype]=useState("")
    const [dailyamt,setDailyamt]=useState("")
    const [weeklyamt,setWeeklyamt]=useState("")
    const [balance,setBalance]=useState("")
    const [status,setstatus]=useState("")
    const [paid,Setpaid]=useState(0)
    const navigate=useNavigate()
    
    console.log(type)
    const daysMap ={
        daily:100,
        weekly:10
    }
    const days= daysMap[type] || 0
    // console.log(days)


    const [startDate,setstartDate]=useState(new Date())
    const [endDate,setendDate]=useState(()=>{
        const nextDate=new Date()
        nextDate.setDate(nextDate.getDate()+days)
        return nextDate

    })
    

    const handleStartDateChange=(e)=>{
        const newStart=new Date(e.target.value)
        setstartDate(newStart)
        
    }
    useEffect(() => {
        if (type && startDate) {
            const newEnd = new Date(startDate);
            newEnd.setDate(startDate.getDate() + days);
            setendDate(newEnd);
        }
        let newdetected;
        if(days!=0){
            if(type==="daily"){
                newdetected=amount-((percentage/100)*amount)
                setDetectedamt(newdetected)
                setDailyamt((amount)/days)
                setBalance(amount)
            }
            else{
                newdetected=amount+((percentage/100)*amount)
                setDetectedamt(newdetected)
                setWeeklyamt((newdetected)/days)
                setBalance(newdetected)
                // setDetectedamt(amount-((percentage/100)*amount))
            }
            
        }
    }, [type,startDate,amount,percentage,days]);
   
    
    console.log(dailyamt)
    const installment= type==="daily" ? dailyamt : weeklyamt
    const savedata=async(e)=>{
        e.preventDefault()
        if(!custname || !amount || !percentage || !type || !startDate ){
            return alert("Fill all the fields")
        }
        try{
            const s = {
                cust_name: custname,
                cust_amt: amount,
                cust_interest: percentage,
                collection_type: type,
                amount_given: detectedamt,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                installment,balance,paid
            }
            const r= await axios.post("http://localhost:1008/customer/registercustomer",s)
            console.log(r)
            console.log(r.data.msg)

            if(r.data.msg==="Customer added"){
                setstatus("Customer Registered Successfull");
                navigate("/Dashboard")

            }
            else if(r.data.msg=="Customer Exist"){
                setstatus("Customer Alreday Exist")
            }
            else{
                setstatus("Something went Wrong !")
            }
        }
        catch(err){
            console.log(err)
            setstatus("Something went wrong!")
        }
    }

  return (
    <div>
        <h1>customer page</h1>
        <form onSubmit={(e)=>savedata(e)}>
            <label>Name : <input type='text' required onChange={(e)=>{setCustname(e.target.value)}}/></label ><br/>
            <label>Amount : <input type='number' min="0" required onChange={(e)=>{setAmount(Number(e.target.value))}}/></label ><br/>
            <label>Interest Percentage : <input type='number' step="0.5" min="0" required onChange={(e)=>{setPercentage(Number(e.target.value))}}/></label ><br/>
            <label>Colletion Type: <select name="SelectedType" value={type} onChange={(e)=>{settype(e.target.value)}}>
                <option value="">Select Type</option>
                <option value="daily">Daily Collection</option>
                <option value="weekly">Weekly Collection</option>
            </select></label><br/>
            

            {type ==="daily" ?(
                <>
                <label>Amount After detection: <input type='number' value={detectedamt}readOnly/></label ><br/>
                </>
            ):(
                <>
                <label>Amount To Pay: <input type='number' value={detectedamt}readOnly/></label><br/>
                </>
            )}

            <label>Start date : <input type='date' value={startDate.toISOString().split('T')[0]} onChange={handleStartDateChange} required/></label ><br/>
            <label>End Date : <input type='date'value={endDate.toISOString().split('T')[0]} readOnly/></label ><br/>
            {type === "daily" ? (
                <>
                <label>Amount to Pay per day :<input type="number" value={dailyamt} readOnly /></label><br />
                </>
                ) : (<>
                <label>  Amount to Pay per Week : <input type="number" value={weeklyamt} readOnly /></label> <br />
                 </>
            )}
            
            <button type='submit'>Create Customer</button><br/>

        </form>
        <Link to="/Dashboard">Back</Link>
    </div>
  )
}

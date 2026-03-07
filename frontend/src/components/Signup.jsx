import React,{useEffect, useState}from "react";
import axios from 'axios'
import { Link,useNavigate } from 'react-router-dom'
import "../Styles/signup.css"

const Signup = () => {
    const[admin_name, setadmin_name]=useState("");
    const[finance_name,setfinance_name]=useState("");
    const[admin_email,setadmin_email]=useState("");
    const[admin_password,setadmin_password]=useState("");
    const [status, setstatus] = useState("")
    const navigate=useNavigate()

    useEffect(() => {
        console.log("Signup component mounted");
    }, []);
    // const handle=()=>{
    //     if(!admin_name || !finance_name || !admin_email || !admin_password){
    //         alert("Enter all the required credentials")
    //     }
    // }
    const savedata=async(e)=>{
        e.preventDefault()
        if(!admin_name || !finance_name || !admin_email || !admin_password){
            return alert("Enter all the required credentials")
        }
        try{
            const s={admin_name,finance_name,admin_email,admin_password}
            const r= await axios.post("http://localhost:1008/admin/savedata",s)
            console.log(r)
            console.log(r.data.msg)
            
            if(r.data.msg==="Admin added"){
                setstatus("Successfully Registered ...")
                console.log("hi")
                navigate("/Login")
            }
            else if(r.data.msg==="Admin exist"){
                setstatus("Admin Already Exist ...")
            }
            else{
                setstatus("Something went wrong !")
            }
            
        }
        catch(err){
            console.log(err)
            setstatus("Something went wrong !")

        }
    }
    return (
    <div className="main">
        <div className="container">
            <h1>Signup</h1>
            <form onSubmit={(e) => savedata(e)} className="loginform">
                <div className="form-group">
                    <label>Name :</label> <input type="text" placeholder="Name" required onChange={(e) => { setadmin_name(e.target.value) }} />
                </div>
                <div className="form-group">
                    <label>Finance Name :</label><input type="text" placeholder="Finance Name" required onChange={(e) => { setfinance_name(e.target.value) }} />
                </div>

                <div className="form-group">
                    <label>Email :</label> <input type="email" placeholder="Email" required onChange={(e) => { setadmin_email(e.target.value) }} />
                </div>
                <div className="form-group">
                    <label>Password :</label> <input type="password" placeholder="Password" required onChange={(e) => { setadmin_password(e.target.value) }} />
                </div>
                <button type="submit" className="signup-btn">Sign-Up</button>               
                <div className="login-link">
                    Already Have an Account ? <Link to="/Login">Login</Link>
                </div>
            </form>
        </div>
    </div>
)
};

export default Signup;
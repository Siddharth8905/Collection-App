import React, { useEffect, useState } from "react";
import axios from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import "../Styles/signup.css"

const Signup = () => {
    const [admin_name, setadmin_name] = useState("");
    const [finance_name, setfinance_name] = useState("");
    const [admin_email, setadmin_email] = useState("");
    const [admin_password, setadmin_password] = useState("");
    const [status, setstatus] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        console.log("Signup component mounted");
    }, []);
    // const handle=()=>{
    //     if(!admin_name || !finance_name || !admin_email || !admin_password){
    //         alert("Enter all the required credentials")
    //     }
    // }
    const savedata = async (e) => {
        e.preventDefault()
        if (!admin_name || !finance_name || !admin_email || !admin_password) {
            return alert("Enter all the required credentials")
        }
        try {
            const formattedFinanceName = finance_name.trim().toLowerCase().replace(/\s+/g, "_")
            console.log("Formatted Finance Name:", formattedFinanceName)
            const s = { admin_name, finance_name: formattedFinanceName, admin_email, admin_password }
            const r = await axios.post("/admin/savedata", s)
            console.log(r)
            console.log(r.data.msg)

            if (r.data.msg === "Admin added") {
                setstatus("Successfully Registered ...")
                console.log("hi")
                navigate("/Login")
            }
            else if (r.data.msg === "Admin exist") {
                setstatus("Admin Already Exist ...")
            }
            else {
                setstatus("Something went wrong !")
            }

        }
        catch (err) {
            console.log(err)
            setstatus("Something went wrong !")

        }
    }
    return (
        <div className="main">
            <div className="split-container">
                <div className="form-side">
                    <h1 className="form-title">Hello!</h1>
                    {/* <p className="form-subtitle">Let's get started with your 30 days trial</p> */}
                    <form onSubmit={(e) => savedata(e)} className="auth-form">
                        <div className="input-group">
                            <input type="text" placeholder="Admin Name" required onChange={(e) => { setadmin_name(e.target.value) }} />
                        </div>
                        <div className="input-group">
                            <input type="text" placeholder="Finance Name" required onChange={(e) => { setfinance_name(e.target.value) }} />
                        </div>
                        <div className="input-group">
                            <input type="email" placeholder="Email Address" required onChange={(e) => { setadmin_email(e.target.value) }} />
                        </div>
                        <div className="input-group">
                            <input type="password" placeholder="Password" required onChange={(e) => { setadmin_password(e.target.value) }} />
                        </div>

                        {status && <div className="status-msg">{status}</div>}

                        <button type="submit" className="auth-btn">Sign Up</button>
                        <div className="auth-redirect">
                            Already Have an Account? <Link to="/Login">Login</Link>
                        </div>
                    </form>
                </div>
                <div className="image-side">
                    <img src="/fincollect_logo.png" alt="Fincollect Logo" className="display-image" />
                </div>
            </div>
        </div>
    )
};

export default Signup;
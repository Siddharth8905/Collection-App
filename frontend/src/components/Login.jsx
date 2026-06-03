import React, { useEffect,useState } from "react";
import axios from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/signup.css"

const Login=()=>{
    const[admin_email,setadmin_email]=useState("");
    const[admin_password,setadmin_password]=useState("");
    const[status,set_status]=useState("")
    const navigate=useNavigate()

    useEffect(() => {
}, [status])


    const login=async(e)=>{
        e.preventDefault()
        try{
            const user={admin_email:admin_email,admin_password:admin_password}
            console.log(user)
            const result=await axios.post("/admin/adminlogin",user)
            if(result.data.msg==="Invalid Password"){
                set_status("Invalid Password")
                alert("Invalid Password")
            }
            else if(result.data.msg==="Admin email not found"){
                set_status("User Not found")
                alert("admin not found")
            }
            else{
                set_status("Login Success")
                const financeName = result.data.data?.finance_name

                if (!financeName) {
                    alert("Finance name missing from server")
                    return
                }
                // console.log(result)
                // console.log(result.data.data.finance_name)
                // localStorage.setItem("financename",result.data.data.finance_name)
                localStorage.setItem("financename", financeName)

                navigate("/Dashboard")
            }

        }
        catch(error){
            console.log(error)
        }
    }
    
    return (
    <div className="main">
        <div className="split-container">
            <div className="form-side">
                <h1 className="form-title">Hello Again!</h1>
                <p className="form-subtitle">Login to manage your collections</p>
                <form onSubmit={(e) => login(e)} className="auth-form">                
                    <div className="input-group">
                        <input type="email" placeholder="Admin Email" required onChange={(e)=>{setadmin_email(e.target.value)}} />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" required onChange={(e)=>{setadmin_password(e.target.value)}} />
                    </div>
                    
                    {status && <div className="status-msg">{status}</div>}
                    
                    <button type="submit" className="auth-btn"> Login </button>
                    <div className="auth-redirect">
                        New User? <Link to="/">Signup</Link>
                    </div>
                </form>
            </div>
            <div className="image-side">
                <img src="/fincollect_logo.png" alt="Fincollect Logo" className="display-image" />
            </div>
        </div>
    </div>
)

}
export default Login
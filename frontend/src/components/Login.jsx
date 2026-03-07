import React, { useEffect,useState } from "react";
import axios from "axios";
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
            const result=await axios.post("http://localhost:1008/admin/adminlogin",user)
            if(result.data.msg=="Invalid Password"){
                set_status("Invalid Password")
                alert("Invalid Password")
            }
            else if(result.data.msg=="Admin email not found"){
                set_status("User Not found")
                alert("admin not found")
            }
            else{
                set_status("Login Success")
                navigate("/Dashboard")
            }

        }
        catch(error){
            console.log(error)
        }
    }
    
    return (
    <div className="main">
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={(e) => login(e)} className="loginform">                
                <div className="form-group">
                    <label>Admin Email :</label><input type="email" placeholder="Admin email" required onChange={(e)=>{setadmin_email(e.target.value)}} />
                </div>
                <div className="form-group">
                    <label>Admin Password :</label><input type="password" placeholder="Password" required onChange={(e)=>{setadmin_password(e.target.value)}} />
                </div>
                <button type="submit" className="signup-btn"> Login </button>
                <div className="footer-text">
                    New User ? <Link to="/">Signup</Link>
                </div>
            </form>
        </div>
    </div>
)

}
export default Login
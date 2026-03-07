const Admin =require("../Model/AdminModel")

const register_admin=async(req,res)=>{
    try{
        console.log(req.body)
        const {admin_name,finance_name,admin_email,admin_password}=req.body
        
        const check= await Admin.findOne({admin_name})
        if(check) return res.json({msg:"Admin exist"})

        const new_admin=new Admin({admin_name,finance_name,admin_email,admin_password})
        await new_admin.save()
        console.log(new_admin)
        res.json({msg:"Admin added", data:new_admin})
        // res.json(new_admin)

    }
    catch(err){
        res.json({msg:err.message})
    }
}

const admin_login=async(req,res)=>{
    try{
        const {admin_email,admin_password}=req.body
        const admin= await Admin.findOne({admin_email})
        if(!admin) return res.json({msg:"Admin email not found"})
            
        else if(admin_password!=admin.admin_password) return res.json({msg:"Invalid Password"})
    
        else{
            res.json({msg:"Login Success"})
        }
    }
    catch(err){
        res.json({msg:err.message})
    }

}
module.exports={register_admin,admin_login}
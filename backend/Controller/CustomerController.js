const Cust=require("../Model/CustomerModel")

const register_customer=async(req,res)=>{
    try{
        console.log(req.body)
        const{cust_name,cust_amt,cust_interest,collection_type,amount_given,start_date,end_date,installment,balance,paid}=req.body
        const check=await Cust.findOne({cust_name})
        if(check)return res.json({msg:"Customer Exist"})

        const new_cust= new Cust({cust_name,cust_amt,cust_interest,collection_type,amount_given,start_date,end_date,installment,balance,paid})
        await new_cust.save()
        console.log(new_cust)
        res.json({msg:"Customer added", data:new_cust})
    }
    catch(err){
        res.json({msg:err.message})
    }
}

const get_customer=async(req,res)=>{
    try{
       const s=await Cust.find()
       res.json(s)


    }
    catch(err){
        res.json({msg:err.message})
    }
}

const get_single_customer=async(req,res)=>{
    try{
        const s=await Cust.findById(req.params.id)
        res.json(s)
    }
    catch(err){
        res.json({msg:err.message})
    }
}

const update_balance=async(req,res)=>{
    try{
        console.log(req.body)
        const {id}=req.params
        const {balance,paid}=req.body
        console.log("balance:",balance)
        console.log("paid",paid)
        const updatedCustomer=await Cust.findByIdAndUpdate(id,{balance,paid},{new:true})
        if(!updatedCustomer){
            return res.json({msg:"Customer Not found"})
        }
        return res.json({msg:"Customer updated",data:updatedCustomer})
    }
    catch(err){
        res.json({msg:err.message})
    }
}

const delete_customer=async(req,res)=>{
    try{
        const {id}=req.params
        const deletedCustomer=await Cust.findByIdAndDelete(id);
        if(deletedCustomer){
            console.log("Customer deleted Successfully")
        }
        else{
            console.log("Customer Not Found!")
        }
    }
    catch(err){
        console.log(err)
    }
}
module.exports={register_customer,get_customer,get_single_customer,update_balance,delete_customer}
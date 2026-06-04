// const Cust=require("../Model/CustomerModel")
const getCustomerModel = require("../Model/CustomerModel")
const getTransactionModel =require("../Model/TransactionModel")

const register_customer=async(req,res)=>{
    try{
        console.log(req.body)
        const{cust_name,cust_number,cust_location,cust_amt,cust_interest,collection_type,amount_given,start_date,end_date,installment,balance,financename}=req.body
        if (!financename) {
            return res.json({ msg: "Finance name missing" })
        }
        const Cust = getCustomerModel(financename)
        const check=await Cust.findOne({cust_name})
        if(check)return res.json({msg:"Customer Exist"})

        const new_cust= new Cust({cust_name,cust_number,cust_location,cust_amt,cust_interest,collection_type,amount_given,start_date,end_date,installment,balance})
        await new_cust.save()
        console.log("Saved in:", financename)
        console.log(new_cust)
        res.json({msg:"Customer added", data:new_cust})
    }
    catch(err){
        res.json({msg:err.message})
    }
}

const get_customer=async(req,res)=>{
    try{
        const { financename } = req.params
        const Cust = getCustomerModel(financename)
        const s=await Cust.find()
        res.json(s)


    }
    catch(err){
        res.json({msg:err.message})
    }
}

const get_single_customer=async(req,res)=>{
    try{
        const { financename } = req.params
        const Cust = getCustomerModel(financename)
        const s=await Cust.findById(req.params.id)
        res.json(s)
    }
    catch(err){
        res.json({msg:err.message})
    }
}

// const update_balance=async(req,res)=>{
//     try{
//         console.log(req.body)
//         const {financename,id}=req.params
//         const {balance}=req.body
//         const Cust = getCustomerModel(financename)
//         const Transaction = getTransactionModel(financename)
//         console.log("balance:",balance)
//         console.log("paid" )
//         const updatedCustomer=await Cust.findByIdAndUpdate(id,{balance},{new:true})
//         if(!updatedCustomer){
//             return res.json({msg:"Customer Not found"})
//         }
//         return res.json({msg:"Customer updated",data:updatedCustomer})
//     }
//     catch(err){
//         res.json({msg:err.message})
//     }
// }
const update_balance = async (req, res) => {

    try {

        const { financename, id } = req.params
        const { balance, amount, type } = req.body

        const Cust = getCustomerModel(financename)
        const Transaction =
            getTransactionModel(financename)

        const customer = await Cust.findByIdAndUpdate(
            id,
            { balance },
            { new: true }
        )

        if (!customer) {
            return res.json({
                msg: "Customer Not found"
            })
        }

        // STORE TRANSACTION
        await Transaction.create({

            customer_id: customer._id,

            cust_name: customer.cust_name,

            amount: amount,

            type: type
        })

        return res.json({
            msg: "Customer updated",
            data: customer
        })

    } catch (err) {

        res.json({
            msg: err.message
        })
    }
}

const delete_customer=async(req,res)=>{
    try{
        const {financename,id}=req.params
        const Cust = getCustomerModel(financename)
        const deletedCustomer=await Cust.findByIdAndDelete(id);
        if(deletedCustomer){
            console.log("Customer deleted Successfully")
            return res.json({msg:"Customer deleted successfully",data:deletedCustomer})
        }
        else{
            console.log("Customer Not Found!")
            return res.json({msg:"Customer Not Found!"})
        }
    }
    catch(err){
        console.log(err)
        return res.json({msg:err.message})
    }
}

const update_Customer = async (req, res) => {

    try {

        const { financename, id } = req.params

        const Cust = getCustomerModel(financename)

        const updatedCustomer = await Cust.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )

        if (!updatedCustomer) {
            return res.json({ msg: "Customer Not Found!" })
        }

        return res.json({
            msg: "Customer Renewed Successfully",
            data: updatedCustomer
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            msg: err.message
        })
    }
}
const get_transactions = async (req, res) => {

    try {

        const { financename, customerid }
            = req.params

        const Transaction =
            getTransactionModel(financename)

        const transactions =
            await Transaction.find({
                customer_id: customerid
            }).sort({ payment_date: -1 })

        res.json(transactions)

    } catch (err) {

        res.json({
            msg: err.message
        })
    }
}
const add_favorite = async (req, res) => {
    try {
        const { financename, id } = req.params

        const Cust = getCustomerModel(financename)

        const customer = await Cust.findById(id)

        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" })
        }

        const updatedCustomer = await Cust.findByIdAndUpdate(
            id,
            { favorite: !customer.favorite },
            { new: true }
        )

        res.json({
            msg: "Favorite updated",
            data: updatedCustomer
        })

    } catch (err) {
        console.error("Error in add_favorite:", err)
        res.status(500).json({ msg: err.message })
    }
}
const get_favorites = async (req, res) => {
    try {
        const { financename } = req.params

        const Cust = getCustomerModel(financename)

        const favorites = await Cust.find({ favorite: true })

        res.json(favorites)
    }
    catch (err) {
        res.json({ msg: err.message })
    }
}
module.exports={register_customer,get_customer,get_single_customer,update_balance,delete_customer,update_Customer,get_transactions,add_favorite,get_favorites}
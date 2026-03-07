const mongoose=require("mongoose")

const dataschema=mongoose.Schema({
    cust_name:{
        type:String,
        required:true
    },
    cust_amt:{
        type:Number,
        required:true
    },
    cust_interest:{
        type:Number,
        required:true
    },
    collection_type:{
        type:String,
        required:true
    },
    amount_given:{
        type:Number,
        required:true
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    installment:{
        type:Number,
        required:true
    },
    balance:{
        type:Number,
        required:true
    },
    paid:{
        type:Number,
        required:true
    }

})
module.exports=mongoose.model("Customer_Details",dataschema)
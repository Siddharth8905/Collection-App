const mongoose=require("mongoose")

const dataschema=mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    finance_name:{
        type: String,
        required : true
    },
    admin_email:{
        type:String,
        unique: true,
        required:true
    },
    admin_password:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model("Admin_Details",dataschema)
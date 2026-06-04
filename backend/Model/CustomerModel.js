const mongoose=require("mongoose")

const customerSchema = mongoose.Schema({
    cust_name:{
        type:String,
        required:true
    },
    cust_number:{
        type:String,
        required:true
    },
    cust_location:{
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
    financename:{
        type:String
    },
    favorite: {
        type: Boolean,
        default: false
    }
})

// Dynamic model creation function
const getCustomerModel = (financename) => {
    if (!financename) {
        throw new Error('Finance name is required');
    }
    const modelName = `Customer_${financename.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return mongoose.models[modelName] || mongoose.model(modelName, customerSchema);
};

module.exports = getCustomerModel;
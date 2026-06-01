const mongoose = require("mongoose")

const transactionSchema = mongoose.Schema({

    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    cust_name: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        enum: ["payment", "withdraw"],
        required: true
    },

    payment_date: {
        type: Date,
        default: Date.now
    }
})

const getTransactionModel = (financename) => {

    if (!financename) {
        throw new Error("Finance name required")
    }

    const modelName =
        `Transaction_${financename.replace(/[^a-zA-Z0-9]/g, "_")}`

    return mongoose.models[modelName] ||
        mongoose.model(modelName, transactionSchema)
}

module.exports = getTransactionModel
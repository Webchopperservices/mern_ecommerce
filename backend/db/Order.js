const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: String,
    mobile: String,
    address: String,

    totalAmount: Number,

    status: {
        type: String,
        default: "Pending"
    },
    cancelReason: {
        type: String,
        default: ""
    },

    products: [
        {
            productId: String,
            quantity: Number
        }
    ]

}, { timestamps: true })

module.exports = mongoose.model("orders", orderSchema)
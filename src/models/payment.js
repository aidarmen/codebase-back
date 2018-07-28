const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
	user_group: {
		type: mongoose.Schema.ObjectId,
		ref: 'user_group'
	},
	date: { type: Date, default: Date.now },
	amount: {
		type: Number,
		require: true,
		default: -1
	}
})

module.exports = mongoose.model('payment', PaymentSchema)
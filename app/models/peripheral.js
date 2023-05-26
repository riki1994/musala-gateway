let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let status = ['online', 'offline']
let peripheralSchema = new Schema({
    uid: {type: Number, required: true},
    vendor: {type: String, required: true},
    created_at: Date,
    status: {type: String, enum: {values: status, message: 'Non valid option'}, required: true},
    gateway: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gateway',
        required: true
    }
})
let Peripheral = mongoose.model('Peripheral', peripheralSchema)

module.exports.Peripheral = Peripheral


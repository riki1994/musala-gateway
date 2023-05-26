let mongoose = require('mongoose')
let Schema = mongoose.Schema
let Sequence = require("./sequence").Sequence

let matchPattern = [
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'The IPv4 Address is not valid'
]
let gatewaySchema = new Schema({
    id: Number,
    gateway_name: {type: String, required: true},
    ipv4_address: {type: String, required: true, match: matchPattern},
    peripherals: [{
        type: Schema.Types.ObjectId,
        ref: 'Peripheral'
    }]
})
gatewaySchema.pre('save', function (next) {
    let doc = this
    if (!doc.id) {
        Sequence.findByIdAndUpdate({'_id': 'Gateway'}, {$inc: {seq: 1}}).then((sequence) => {
            if (!sequence) {
                let sequence = new Sequence({_id: 'Gateway', seq: 1})
                sequence.save().then((sequence) => {
                    doc.id = sequence.seq;
                    next();
                })
            } else {
                doc.id = sequence.seq;
                next();
            }
        }).catch(error => next(error))
    }
});

let Gateway = mongoose.model('Gateway', gatewaySchema)

module.exports.Gateway = Gateway


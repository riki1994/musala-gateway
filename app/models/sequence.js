let mongoose = require('mongoose')
let Schema = mongoose.Schema

let sequenceSchema = new Schema({
    _id: {type: String, required: true},
    seq: Number,
})

let Sequence = mongoose.model('Sequence', sequenceSchema)

module.exports.Sequence = Sequence
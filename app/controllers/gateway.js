const {Peripheral} = require("../models/peripheral");
const {ObjectId} = require("mongodb");
let Gateway = require("../models/gateway").Gateway;

function get(req, res, next) {
    try {
        Gateway.find(req.query).populate('peripherals').then((records) => {
            res.json(records)
        })
    } catch (err) {
        next(err);
    }
}

function create(req, res, next) {
    try {
        let gateway = new Gateway(req.body)
        gateway.save().then(gateway => {
            res.json({
                gateway: gateway,
                message: 'Gateway added successfully'
            })
        }).catch(error => res.json(error))
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        Gateway.findByIdAndUpdate({'_id': req.params.id}, req.body, {new: true, runValidators: true})
            .then((gateway) => {
                res.json({
                    gateway: gateway,
                    message: 'Gateway updated successfully'
                })
            })
            .catch(error => res.json(error))
    } catch (err) {
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await Peripheral.deleteMany({gateway: new ObjectId(req.params.id)})
        Gateway.findByIdAndRemove(req.params.id).then(() => {
            res.json({message: 'The gateway has been deleted successfully'})
        })
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        Gateway.findById(req.params.id).populate('peripherals').then((record) => {
            res.json(record)
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    get,
    create,
    update,
    remove,
    getById,
};
const {Peripheral} = require("../models/peripheral");
let Gateway = require("../models/gateway").Gateway;

function get(req, res, next) {
    try {
        Peripheral.find(req.query).populate('gateway').then((records) => {
            res.json(records)
        })
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        if (!req.body.gateway) {
            res.json({
                error: true,
                message: 'Gateway cannot be blank',
            })
        }
        let gateway = await Gateway.findById(req.body.gateway).populate('peripherals')
        if (gateway.peripherals.length === 10) {
            res.json({
                error: true,
                message: 'This gateway already has 10 peripherals',
            })
        } else {
            req.body.created_at = new Date()
            let peripheral = new Peripheral(req.body)
            peripheral.save().then((per) => {
                Gateway.findByIdAndUpdate(req.body.gateway, {$push: {peripherals: per._id}}, {new: true})
                  .then(() => {
                      res.json({
                          peripheral: peripheral,
                          message: 'Peripheral created successfully'
                      })
                  })
            }).catch(err => res.json(err))
        }
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        Peripheral.findByIdAndUpdate({'_id': req.params.id}, req.body, {new: true, runValidators: true})
            .then((peripheral) => {
                res.json({
                    peripheral: peripheral,
                    message: 'Peripheral updated successfully'
                })
            })
            .catch(error => res.json(error))
    } catch (err) {
        next(err);
    }
}

function remove(req, res, next) {
    try {
        Peripheral.findByIdAndRemove(req.params.id).then(() => {
            res.json({message: 'The peripheral has been deleted successfully'})
        })
    } catch (err) {
        next(err);
    }
}

function getById(req, res, next) {
    try {
        Peripheral.findById(req.params.id).populate('gateway').then((record) => {
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
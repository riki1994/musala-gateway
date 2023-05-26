let Gateway = require("../models/gateway").Gateway;
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const app = require('../config');
const supertest = require("supertest");
const request = supertest(app);
dotenv.config();

beforeAll(async () => {
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    let uri = process.env.MONGO_URI
    let database = process.env.MONGO_TEST_DATABASE
    await mongoose.connect(uri + database, mongooseOpts)
})

afterAll(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
})

describe('Test Gateways', () => {
    let ID = null
    it('Create Gateway With Exception', done => {
        let gateway = new Gateway({
            "gateway_name": "Some Gateway Name",
            "ipv4_address": "192.165."
        })
        gateway.save().then(_ => {
        }).catch(error => {
            expect(error.errors.ipv4_address).toBeDefined()
            done()
        })
    });

    it('Create Gateway', done => {
        let gateway = new Gateway({
            "gateway_name": "Some Gateway Name",
            "ipv4_address": "192.165.35.21"
        })
        gateway.save().then(result => {
            ID = result._id
            expect(result.gateway_name).toBe('Some Gateway Name')
            done()
        })
    });

    it('Find All Gateway', done => {
        Gateway.find().then(result => {
            expect(result.length).toBeGreaterThanOrEqual(1)
            done()
        })
    });

    it('Find One By ID Gateway', done => {
        Gateway.findById(ID).then(result => {
            expect(result._id).toStrictEqual(ID)
            done()
        })
    });

    it('Update Gateway', done => {
        Gateway.findByIdAndUpdate(ID, {ipv4_address: '10.10.10.10'}, {new: true})
            .then(result => {
                expect(result.ipv4_address).toStrictEqual('10.10.10.10')
                done()
            })
    });

    it('Update Gateway With Validation', done => {
        Gateway.findByIdAndUpdate(ID, {ipv4_address: '10.10.10'}, {new: true, runValidators: true})
            .then(() => {
            }).catch(error => {
            expect(error.errors.ipv4_address).toBeDefined()
            done()
        })
    });

    it('Remove Gateway', done => {
        Gateway.findByIdAndRemove(ID, {new: true})
            .then(gateway => {
                expect(gateway).toBeDefined()
                done()
            })
    });
});

describe('Test Endpoints', () => {
    let ID = null
    it('Create With Exception', done => {
        let gateway = {
            "gateway_name": "Some Gateway Name",
            "ipv4_address": "192.165."
        }
        request.post('/gateway')
            .send(gateway)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.errors).toBeDefined()
                expect(res.body.errors.ipv4_address).toBeDefined()
                return done();
            })
    });

    it('Create Gateway', done => {
        let gateway = {
            "gateway_name": "Some Gateway Name",
            "ipv4_address": "192.165.95.163"
        }
        request.post('/gateway')
            .send(gateway)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.gateway).toBeDefined()
                expect(res.body.gateway._id).toBeDefined()
                ID = res.body.gateway._id
                return done();
            })

    });

    it('Find All Gateway', done => {
        request.get('/gateway')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.length).toBeGreaterThanOrEqual(1)
                return done();
            })
    });

    it('Find One By ID Gateway', done => {
        request.get('/gateway/' + ID)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body._id).toBeDefined()
                expect(res.body._id).toStrictEqual(ID)
                return done();
            })
    });

    it('Update Gateway', done => {
        request.post('/gateway/' + ID)
            .send({ipv4_address: '10.10.10.10'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.gateway._id).toBeDefined()
                expect(res.body.message).toBeDefined()
                expect(res.body.gateway._id).toStrictEqual(ID)
                expect(res.body.gateway.ipv4_address).toStrictEqual('10.10.10.10')
                return done();
            })
    });

    it('Update Gateway With Validation', done => {
        request.post('/gateway/' + ID)
            .send({ipv4_address: '10.10.10'})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.errors).toBeDefined()
                expect(res.body.errors.ipv4_address).toBeDefined()
                return done();
            })
    });

    it('Remove Gateway', done => {
        request.delete(`/gateway/${ID}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                expect(res.body.message).toStrictEqual('The gateway has been deleted successfully')
                return done()
            })
    });
});
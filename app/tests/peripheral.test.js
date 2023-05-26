let Gateway = require("../models/gateway").Gateway;
let Peripheral = require("../models/peripheral").Peripheral;
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

describe('Test Peripherals', () => {
  let ID = null
  let peripheralID = null
  it('Create Peripheral With Exception', done => {
    let peripheral = new Peripheral({
      "vendor": "Some vendor",
      "status": "offline"
    })
    peripheral.save().then(_ => {
    }).catch(error => {
      expect(error.errors.gateway).toBeDefined()
      done()
    })
  });

  it('Create Peripheral', done => {
    let gateway = new Gateway({
      "gateway_name": "Some Gateway Name",
      "ipv4_address": "192.165.35.21"
    })
    gateway.save().then(result => {
      ID = result._id
      expect(result.gateway_name).toBe('Some Gateway Name')

      let peripheral = new Peripheral({
        "vendor": "Some vendor",
        "status": "offline",
        "gateway": ID,
        "uid": new Date().getTime()
      })
      peripheral.save().then(peripheral => {
        peripheralID = peripheral._id
        expect(peripheral.vendor).toBe('Some vendor')
        done()
      })
    })
  });

  it('Find All Peripherals', done => {
    Peripheral.find().then(result => {
      expect(result.length).toBeGreaterThanOrEqual(1)
      done()
    })
  });

  it('Find One By ID Peripheral', done => {
    Peripheral.findById(peripheralID).then(result => {
      expect(result._id).toStrictEqual(peripheralID)
      done()
    })
  });

  it('Update Peripheral', done => {
    Peripheral.findByIdAndUpdate(peripheralID, {status: 'online'}, {new: true})
      .then(result => {
        expect(result.status).toStrictEqual('online')
        done()
      })
  });

  it('Update Peripheral With Validation', done => {
    Peripheral.findByIdAndUpdate(peripheralID, {status: 'other not on the list'}, {
      new: true,
      runValidators: true
    }).then(() => {
    }).catch(error => {
      expect(error.errors.status).toBeDefined()
      done()
    })
  });

  it('Remove Peripheral', done => {
    Peripheral.findByIdAndRemove(peripheralID, {new: true})
      .then(peripheral => {
        expect(peripheral).toBeDefined()
        done()
      })
  });
});

describe('Test Endpoints', () => {
  let peripheralID = null
  let ID = null

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

  it('Create With Exception', done => {
    let peripheral = {
      "vendor": "Some vendor",
      "status": "offline",
      "gateway": ID
    }
    request.post('/peripheral')
      .send(peripheral)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.uid).toBeDefined()
        return done();
      })
  });

  it('Create Peripheral', done => {
    let peripheral = {
      "vendor": "Some vendor",
      "status": "offline",
      "gateway": ID,
      "uid": new Date().getTime()
    }

    request.post('/peripheral')
      .send(peripheral)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.peripheral).toBeDefined()
        expect(res.body.peripheral._id).toBeDefined()
        peripheralID = res.body.peripheral._id
        return done();
      })
  });

  it('Find All Peripherals', done => {
    request.get('/peripheral')
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

  it('Find One By ID Peripheral', done => {
    request.get(`/peripheral/${peripheralID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body._id).toBeDefined()
        expect(res.body._id).toStrictEqual(peripheralID)
        return done();
      })
  });

  it('Update Peripheral', done => {
    request.post(`/peripheral/${peripheralID}`)
      .send({status: 'online'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.peripheral._id).toBeDefined()
        expect(res.body.message).toBeDefined()
        expect(res.body.peripheral._id).toStrictEqual(peripheralID)
        expect(res.body.peripheral.status).toStrictEqual('online')
        return done();
      })
  });

  it('Update Peripheral With Validation', done => {
    request.post(`/peripheral/${peripheralID}`)
      .send({status: 'other not on the list'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.status).toBeDefined()
        return done();
      })
  });


  it('Remove Peripheral', done => {
    request.delete(`/peripheral/${peripheralID}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        expect(res.body.message).toStrictEqual('The peripheral has been deleted successfully')
        return done()
      })
  });
});
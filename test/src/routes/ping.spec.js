const { describe, it, before, after } = require('mocha');
const chai = require('chai');
const { expect } = chai;
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');
chai.use(chaiHttp);

require('dotenv').config();
const bootstrap = require('../../bootstrap');

/** @type {import('express').Express|import('http').Server} */
let app;
let mongoHelper;

describe('ping test', () => {
  before(async () => {
    await bootstrap();

    mongoHelper = require('../../../helpers/mongoose');
    await mongoHelper.clearDb();

    const createApplication = require('../../../src/app');
    app = createApplication();
  });

  after(async () => {
    await mongoHelper.clearDb();
    await mongoHelper.closeConnection();
    // const firebase = require('@firebase/testing');
    // Promise.all(firebase.apps().map(app => app.delete()));
  });

  describe('POST /ping', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).post('/ping');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /ping', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).put('/ping');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /ping', () => {
    it('should fail with a status 404, an empty body, and an error', async () => {
      const res = await chai.request(app).delete('/ping');
      expect(res.error).to.be.an('error');
      expect(res.body).to.be.empty;
      expect(res).to.have.status(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /ping', () => {
    it('should return a status code of 200', async () => {
      const res = await chai.request(app).get('/ping');
      expect(res).to.have.status(HttpStatus.OK);
    });

    it('should return the text \'pong\'', done => {
      chai.request(app).get('/ping').end((_err, res) => {
        expect(res.text).to.equal('pong');
        done();
      });
    });

    it('should have an empty body', done => {
      chai.request(app).get('/ping').end((_err, res) => {
        expect(res.body).to.be.empty;
        done();
      });
    });
  });
});

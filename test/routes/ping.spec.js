const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');

chai.use(chaiHttp);
const expect = chai.expect;

const server = require('../../src/server')();

describe('ping test', () => {
  describe('POST /ping', () => {
    it('should fail with a status 404, an empty body, and an error', done => {
      chai.request(server).post('/ping').end((_err, res) => {
        expect(res.error).to.be.an('error');
        expect(res.body).to.be.empty;
        expect(res).to.have.status(HttpStatus.NOT_FOUND);
        done();
      });
    });
  });

  describe('PUT /ping', () => {
    it('should fail with a status 404, an empty body, and an error', done => {
      chai.request(server).put('/ping').end((_err, res) => {
        expect(res.error).to.be.an('error');
        expect(res.body).to.be.empty;
        expect(res).to.have.status(HttpStatus.NOT_FOUND);
        done();
      });
    });
  });

  describe('DELETE /ping', () => {
    it('should fail with a status 404, an empty body, and an error', done => {
      chai.request(server).delete('/ping').end((_err, res) => {
        expect(res.error).to.be.an('error');
        expect(res.body).to.be.empty;
        expect(res).to.have.status(HttpStatus.NOT_FOUND);
        done();
      });
    });
  });

  describe('GET /ping', () => {
    it('should return a status code of 200', done => {
      chai.request(server).get('/ping').end((_err, res) => {
        expect(res).to.have.status(HttpStatus.OK);
        done();
      });
    });

    it('should return the text \'pong\'', done => {
      chai.request(server).get('/ping').end((_err, res) => {
        expect(res.text).to.equal('pong');
        done();
      });
    });

    it('should have an empty body', done => {
      chai.request(server).get('/ping').end((_err, res) => {
        expect(res.body).to.be.empty;
        done();
      });
    });
  });
});

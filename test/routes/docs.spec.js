const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const HttpStatus = require('http-status-codes');

chai.use(chaiHttp);
const expect = chai.expect;

const server = require('../../src/server')();

describe('Documentation Endpoint Test', () => {
  describe('POST api/v1/openapi.json', () => {
    it('should fail with a status 404, an empty body, and an error', done => {
      chai.request(server).post('/api/v1/openapi.json').end((_err, res) => {
        expect(res.error).to.be.an('error');
        expect(res.body).to.be.empty;
        expect(res).to.have.status(HttpStatus.NOT_FOUND);
        done();
      });
    });
  });

  describe('GET api/v1/openapi.json', () => {
    it('should return a status code of 200', done => {
      chai.request(server).get('/api/v1/openapi.json').end((_err, res) => {
        expect(res).to.have.status(HttpStatus.OK);
        done();
      });
    });
  });

  describe('GET api/v1/docs', () => {
    it('should return a status code of 200', done => {
      chai.request(server).get('/api/v1/docs').end((_err, res) => {
        expect(res).to.have.status(HttpStatus.OK);
        done();
      });
    });
  });
});

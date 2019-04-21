const express = require("express");
const assert = require("assert");
const request = require("supertest");
const requestIp = require('request-ip');
const windowMs = 60000;
const maxPerWindow = 2;
const RateLimit = require('../lib/rateLimit');
const rateLimiter = RateLimit({windowMs, maxPerWindow});

const app = express();
app.use(requestIp.mw());
app.use(rateLimiter);

app.all('/', (req, res) => {
  if (res.statusCode == 200) {
    const ip = req.clientIp;
    const usage = res.usage;
    res.json({ ip, usage });
  }
});

describe('Simple rate limit test', _ => {

  function goodRequest(errorHandler, successHandler) {
    request(app)
      .get("/")
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.log("goodRequest:", err);
          return errorHandler(err);
        }
        if (successHandler) {
          successHandler(null, res);
        }
      });
  }

  function badRequest(errorHandler, successHandler) {
    request(app)
      .get("/")
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(429, { error: 'Too Many Requests' })
      .end((err, res) => {
        if (err) {
          return errorHandler(err);
        }
        if (successHandler) {
          successHandler(null, res);
        }
      });
  }

  it('responds with request ip and usage', (done) => {
    goodRequest(done, (err, res) => {
      assert.equal(res.body.ip, '::ffff:127.0.0.1');
      assert.equal(res.body.usage, 1);
      rateLimiter.resetAll();
      done();
    });
  });

  it('request over maxPerWindow will return 429 and error message', (done) => {
    goodRequest(done);
    goodRequest(done);
    badRequest(done, _ => {
      rateLimiter.resetAll();
      done();
    });
  });

});
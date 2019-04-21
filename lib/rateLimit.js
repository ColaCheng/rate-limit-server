const defaults = require("defaults");
const Cache = require('./cache');

function RateLimit(options) {
  options = defaults(options, {
    windowMs: 60 * 1000, // milliseconds - how long to keep records of requests in memory
    maxPerWindow: 5, // max number of recent connections during `window` milliseconds before sending a 429 response
  });

  options.store = options.store || new Cache(options.windowMs);

  function rateLimit(req, res, next) {
    const cache = options.store;
    const ip = req.clientIp;
    if (!cache.hits[ip] || cache.hits[ip] < options.maxPerWindow) {
      cache.increment(ip);
      res.usage = cache.hits[ip];
      next();
    } else {
      res.status(429);
      res.format({
        html: _ => {
          res.render('429', { ip })
        },
        json: _ => {
          res.json({ error: 'Error' })
        },
        default: _ => {
          res.type('txt').send('Error')
        }
      });
      next();
    }

  }

  rateLimit.resetKey = options.store.resetKey.bind(options.store);
  rateLimit.resetAll = options.store.resetAll.bind(options.store);

  return rateLimit;
}

module.exports = RateLimit;
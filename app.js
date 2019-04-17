const Config = require('config');
const path = require('path');
const express = require('express');
const app = express();
const Cache = require('./lib/cache');
const requestIp = require('request-ip');
const maxPerWindow = Config.get('maxPerWindow');
const port = Config.get('port');
const windowMs = Config.get('windowMs');
const limitCache = new Cache(windowMs);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function rateLimit(req, res, next) {
  const ip = req.clientIp;
  if (!limitCache.hits[ip] || limitCache.hits[ip] < maxPerWindow) {
    limitCache.increment(ip);
    res.usage = limitCache.hits[ip];
    next();
  } else {
    res.status(429);
    res.format({
      html: _ => {
        res.render('429', { ip })
      },
      json: _ => {
        res.json({ error: 'Too Many Requests' })
      },
      default: _ => {
        res.type('txt').send('Too Many Requests')
      }
    });
    next();
  }
}

app.use(requestIp.mw());
app.use(rateLimit);

app.all('/', function (req, res) {
  if (res.statusCode == 200) {
    const ip = req.clientIp;
    const usage = res.usage;
    res.format({
      html: _ => {
        res.render('index', { ip, usage })
      },
      json: _ => {
        res.json({ error: { ip, usage } })
      },
      default: _ => {
        res.type('txt').send(`ip: ${ip}, usage: ${usage}`)
      }
    });
  }
});

app.listen(port, _ => {
  console.log(`Rate limit server listening on port ${port}!`);
});

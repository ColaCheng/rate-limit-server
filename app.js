const path = require('path');
const express = require('express');
const app = express();
const Cache = require('./lib/cache');
const limitCache = new Cache(60000);
const max = 5;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function rateLimit(req, res, next) {
  const ip = req.ip;
  if (!limitCache.hits[ip] || limitCache.hits[ip] < max) {
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

app.use(rateLimit);

app.all('/', function (req, res) {
  if (res.statusCode == 200) {
    const ip = req.ip;
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

app.listen(3000, _ => {
  console.log('Rate limit server listening on port 3000!');
});

const Config = require('config');
const path = require('path');
const express = require('express');
const app = express();
const port = Config.get('port');
const windowMs = Config.get('windowMs');
const maxPerWindow = Config.get('maxPerWindow');
const RateLimit = require('./lib/rateLimit');
const rateLimiter = RateLimit({windowMs, maxPerWindow});
const requestIp = require('request-ip');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(requestIp.mw());
app.use(rateLimiter);

app.all('/', (req, res) => {
  if (res.statusCode == 200) {
    const ip = req.clientIp;
    const usage = res.usage;
    res.format({
      html: _ => {
        res.render('index', { ip, usage })
      },
      json: _ => {
        res.json({ ip, usage })
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

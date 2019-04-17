function calculateNextResetTime(windowMs) {
  const date = new Date();
  date.setMilliseconds(date.getMilliseconds() + windowMs);
  return date;
}

class Cache {
  constructor (windowMs) {
    this.hits = {};
    this.resetTime = calculateNextResetTime(windowMs);
    this.windowMs = windowMs;
    setInterval(this.resetAll.bind(this), this.windowMs);
  }

  increment (key, cb) {
    if (this.hits[key]) {
      this.hits[key]++;
    } else {
      this.hits[key] = 1;
    }
  };

  decrement (key) {
    if (this.hits[key]) {
      this.hits[key]--;
    }
  };

  resetAll () {
    this.hits = {};
    this.resetTime = calculateNextResetTime(this.windowMs);
  };

}

module.exports = Cache;
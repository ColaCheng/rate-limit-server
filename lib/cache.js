class Cache {
  constructor (windowMs) {
    this.hits = {};
    this.windowMs = windowMs;
  }

  increment (key) {
    if (this.hits[key]) {
      this.hits[key]++;
    } else {
      setTimeout(this.resetKey.bind(this, key), this.windowMs);
      this.hits[key] = 1;
    }
  };

  decrement (key) {
    if (this.hits[key]) {
      this.hits[key]--;
    }
  };

  resetKey (key) {
    delete this.hits[key];
  };

  resetAll () {
    this.hits = {};
  };

}

module.exports = Cache;
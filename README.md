# Simple IP Rate limiting Server

[![Build Status](https://travis-ci.org/ColaCheng/rate-limit-server.svg?branch=master)](https://travis-ci.org/ColaCheng/rate-limit-server)

Simple IP rate-limiting server by Express. Stores IP usage in-memory in the node.js process. Does not share state with other servers or processes.

## Demo

https://simple-rate-limit-server.herokuapp.com

## Environments variables

|Name|Default Value|Description|
|----|-------------|-----------|
|PORT|8080|Port of the web server|
|MAX_PER_WINDOW|60|Max number of connections during `WINDOW_MS` milliseconds before sending a 429 response|
|WINDOW_MS|60000|How long in milliseconds to keep records of requests in memory|

## Install

```
npm install
```

## Start

```
npm start
```

## Endpoint

Suppot every HTTP method on this endpoint path. It will return your IP and your usage.

```
/
```

## Test

```
npm test
```

## TODO

* Support database as IP usage counter.
* Implement the lock mechanism to prevent concurrent request with same IP to access the same usage counter.
* Support multiple nodes.
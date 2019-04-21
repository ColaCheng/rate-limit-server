# Simple Rate limiting Server

[![Build Status](https://travis-ci.org/ColaCheng/rate-limit-server.svg?branch=master)](https://travis-ci.org/ColaCheng/rate-limit-server)

Basic rate-limiting server by Express.

## Environments variables

|Name|Default Value|Description|
|----|-------------|-----------|
|PORT|8080|Port of the web server|
|MAX_PER_WINDOW|60|Max number of connections during `WINDOW_MS` milliseconds before sending a 429 response|
|WINDOW_MS|60000|How long in milliseconds to keep records of requests in memory|
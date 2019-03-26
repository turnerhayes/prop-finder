#!/usr/bin/env node

"use strict";

const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..", "..");

require("dotenv").config({
  path: path.join(PROJECT_ROOT, ".env"),
});

const fs = require("fs");

const http = require("http");
const spdy = require("spdy");

const app = require("../app");

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string|number} val the port to normalize; either a port number or
 * a named pipe
 *
 * @return {string|number|false} the normaized port or false if `val` is a
 * number less than 0
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/*
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "4500");
app.set("port", port);

/*
 * Create HTTP server.
 */

let key;
let cert;

try {
  key = fs.readFileSync(
    path.join(PROJECT_ROOT, process.env.APP_SSL_KEY),
    "utf8"
  );

  cert = fs.readFileSync(
    path.join(PROJECT_ROOT, process.env.APP_SSL_CERT),
    "utf8"
  );
} catch (ex) {
  if (ex.code !== "ENOENT") {
    throw ex;
  }
}

let server;

if (key && cert) {
  const options = {
    key,
    cert,
  };

  server = spdy.createServer(options, app);
} else {
  server = http.createServer(app);
}


/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Error} error the error
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ?
    "Pipe " + port :
    "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // eslint-disable-next-line no-console
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      // eslint-disable-next-line no-console
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ?
    "pipe " + addr :
    "port " + addr.port;
  // eslint-disable-next-line no-console
  console.log("Listening on " + bind);
}

/*
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
const path = require("path");
const pathsConfig = require("./paths");

const DEFAULT_PORT = 11220;

let {
  NODE_ENV: environment = "development",
  APTS_HOST: host = "localhost",
  APTS_PORT: port = process.env.PORT || DEFAULT_PORT,
  APTS_EXTERNAL_PORT: externalPort = port,
  APTS_APP_SSL_KEY: sslKeyPath,
  APTS_APP_SSL_CERT: sslCertPath,
  APTS_APP_IS_SECURE: isSecure,
} = process.env;

port = Number(port);
externalPort = Number(externalPort);

if (isNaN(externalPort)) {
  externalPort = port;
}

const HTTP_DEFAULT_PORT = 80;
const HTTPS_DEFAULT_PORT = 443;

if (sslKeyPath) {
  sslKeyPath = path.resolve(pathsConfig.projectRoot, sslKeyPath);
}

if (sslCertPath) {
  sslCertPath = path.resolve(pathsConfig.projectRoot, sslCertPath);
}

isSecure = isSecure || Boolean(
  sslKeyPath &&
  sslCertPath
);

let origin = "http" + (isSecure ? "s" : "") + "://" +
    host;

if (
  !(externalPort === HTTP_DEFAULT_PORT && !isSecure) &&
  !(externalPort === HTTPS_DEFAULT_PORT && isSecure)
) {
  origin += ":" + externalPort;
}

const AppConfig = {
  environment,
  isDevelopment: environment === "development",
  address: {
    host,
    port,
    externalPort,
    origin,
    isSecure: isSecure || Boolean(
      sslKeyPath &&
      sslCertPath
    ),
    ssl: {
      keyPath: sslKeyPath,
      certPath: sslCertPath,
    },
  },
};

module.exports = AppConfig;

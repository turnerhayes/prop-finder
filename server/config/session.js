let connectionString = process.env.APTS_SESSION_DB_URL;

if (!connectionString) {
  const dbConfig = require("./db");

  connectionString = dbConfig.connectionString;
}

const SessionConfig = {
  connectionString,
  tableName: "user_sessions",
  secret: process.env.APTS_SESSION_SECRET,
  cookieName: process.env.APTS_SESSION_COOKIE_NAME || "apts.session",
};

module.exports = SessionConfig;

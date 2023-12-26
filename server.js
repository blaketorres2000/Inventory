/*************************************************
 * Require Satements
 ************************************************/
require('dotenv').config();
const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const addInventoryRoute = require("./routes/addInventoryRoute");
const inventoryUsageRoute = require("./routes/inventoryUsageRoute");
const flash = require("express-flash");
const pool = require("./database/");
const path = require('path');

/*************************************************
 * View Engine and Middleware
 ************************************************/
app.use(express.static(path.join(__dirname, '/public')));
app.set("view engine", "ejs");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));

// Adjust session store based on NODE_ENV
let sessionStore;
if (process.env.NODE_ENV === "development") {
    const MemoryStore = require("express-session").MemoryStore;
    sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  } else {
  // Use a different store for production, such as connect-pg-simple for PostgreSQL
  const PgStore = require("connect-pg-simple")(session);
  sessionStore = new PgStore({
    pool,
    tableName: "session", // replace with your session table name
  });
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
    cookie: {
      secure: process.env.NODE_ENV === "production", // Adjust based on your deployment (https or http)
    },
  })
);

/*************************************************
 * Routes
 ************************************************/
app.use("/add-inventory", addInventoryRoute);
app.use("/inventory-usage", inventoryUsageRoute);

/*************************************************
 * Start the server on port 5400
 ************************************************/
const PORT = process.env.PORT || 5400;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

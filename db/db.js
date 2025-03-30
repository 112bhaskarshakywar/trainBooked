// // db.js - Database Connection with pool
// require('dotenv').config('./.env');
// const { Pool } = require('pg');

// // Create a new PostgreSQL pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool.connect()
//   .then(() => console.log("✅ PostgreSQL Connected Successfully"))
//   .catch(err => console.error("❌ Database Connection Error", err));

// module.exports = pool;


const { Sequelize } = require("sequelize");



// console.log(process.env,'hello');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: console.log(), // Disable logging SQL queries (optional)
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;


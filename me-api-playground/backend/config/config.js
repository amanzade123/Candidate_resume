require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbUrl = process.env.DATABASE_URL || 'sqlite:./database.sqlite';

// If you later switch to Postgres: set DATABASE_URL=postgres://USER:PASS@HOST:PORT/DBNAME
const sequelize = new Sequelize(dbUrl, {
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {}
});

module.exports = sequelize;

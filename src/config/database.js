const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // set to console.log to see the raw SQL queries
});

module.exports = { sequelize };

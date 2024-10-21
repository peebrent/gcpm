const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');

const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('Planning', 'In Progress', 'Completed'),
    defaultValue: 'Planning',
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  imageUrl: {  // Add this new field
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define the relationship
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });

module.exports = { Project };
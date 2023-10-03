'use strict';

const Sequelize= require('sequelize');
const db = {};

let sequelize;
sequelize = new Sequelize('sqlite::memory:');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Company = require('./company')(sequelize, Sequelize);
db.Recruit = require('./recruit')(sequelize, Sequelize);

db.Company.hasMany(db.Recruit, {
    foreignKey: '채용공고_id',
    allowNull: false
});
db.Recruit.belongsTo(db.Company, {
    foreignKey: '채용공고_id'
});

module.exports = db;

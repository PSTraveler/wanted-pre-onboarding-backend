'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = new Sequelize(config);
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Company = require('./company')(sequelize, Sequelize);
db.Recruit = require('./recruit')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

db.Company.hasMany(db.Recruit, {
    as: 'Recruits',
    foreignKey: '회사_id', 
    sourceKey: '회사_id'
});
db.Recruit.belongsTo(db.Company, {
    as: 'Company',
    foreignKey: '회사_id',
    targetKey: '회사_id',
    onDelete: 'CASCADE'
});

db.UserRecruits = sequelize.define('UserRecruits', {}, { timestamps: false });
db.User.belongsToMany(db.Recruit, {
    as: 'Recruits',
    through: db.UserRecruits,
    foreignKey: '사용자_id'
});
db.Recruit.belongsToMany(db.User, {
    as: 'Users',
    through: db.UserRecruits,
    foreignKey: '채용공고_id'
});

module.exports = db;

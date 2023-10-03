'use strict';

module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('회사', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        },
        회사명: {
            type: DataTypes.STRING
        },
        국가: {
            type: DataTypes.STRING
        },
        지역: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
    return Company;
}
'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('사용자', {
        사용자_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        }
    }, {
        timestamps: false,
        tableName: '사용자'
    });
    return User;
}
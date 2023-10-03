'use strict';

module.exports = (sequelize, DataTypes) => {
    const Recruit = sequelize.define('채용공고', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            allowNull: false,
            primaryKey: true
        },
        채용포지션: {
            type: DataTypes.STRING
        },
        채용보상금: {
            type: DataTypes.INTEGER
        },
        채용내용: {
            type: DataTypes.STRING
        },
        사용기술: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
    return Recruit;
}
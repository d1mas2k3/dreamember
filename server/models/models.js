const sequelize = require('../db')
const {Datatypes, DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    deviceID: {type: DataTypes.STRING, unique: true}
})

const Dream = sequelize.define('dream', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceID: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false}
})

// User.hasMany(Dream);
// Dream.belongsTo(User);


module.exports = {
    User, Dream
}
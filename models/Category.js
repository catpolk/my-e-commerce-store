const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class Category extends Model {}

//init initializes a table when an application is started 
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false, //regesters when was updated
    freezeTableName: true,
    underscored: true, //field names will have undersore between multiple words
    modelName: 'category', //name of the table
  }
);

module.exports = Category;

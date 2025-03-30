'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userSeats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // userSeats.belongsTo(models.User, {
      //   foreignKey: "userID",
      //   onDelete: "CASCADE",
      //   onUpdate: "CASCADE",
      // });
    }
  }
  userSeats.init({
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    seatsNumber: {
      type: DataTypes.JSONB, // JSONB is optimized for PostgreSQL
      allowNull: false,
    },
    trainId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Set once at creation
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Initial value
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"), // Auto-update on row modification
    },
  }, {
    sequelize,
    modelName: 'userSeats',
    timestamps:true
  });
  return userSeats;
};
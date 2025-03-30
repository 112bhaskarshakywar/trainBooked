'use strict';
const {
  Model,DataTypes,Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Train extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Train.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
 
    }
  }
  Train.init( {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numOfSeat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seatInRow: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allBooked: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Changed from BOOLEAN to ARRAY of integers
      allowNull: false,
      defaultValue: [], // Default as an empty array
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "Train",
    timestamps: true,
  });
  return Train;
};
// Sequelize
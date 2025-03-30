'use strict';
const {
  Model,DataTypes,Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Seat belongs to Train
      Seat.belongsTo(models.Train, { foreignKey: "trainId", as: "train" });

      // Seat is related to Users (selectedBy, bookedBy, createdBy)
      Seat.belongsTo(models.User, { foreignKey: "selectedBy", as: "selectedUser" });
      Seat.belongsTo(models.User, { foreignKey: "bookedBy", as: "bookedUser" });
      Seat.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
    }
  }
  Seat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      trainId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Trains",
          key: "id",
        },
      },
      bookingStatus: {
        type: DataTypes.ENUM("AVAILABLE", "PENDING", "BOOKED"),
        allowNull: false,
        defaultValue: "AVAILABLE",
      },
      selectedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      bookedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: "Seat",
      timestamps: true,
    }
 );
  return Seat;
};
// Sequelize
"use strict";
const { Model, Sequelize,DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `model
     * s/index` file will call this method automatically.
     */
    async checkPassword(password) {
      console.log(password,this.hash);
      if (!password || !this.hash) {
        throw new Error("Password and hash are required for comparison");
      }
      return bcrypt.compare(password, this.hash);
    }
    
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM("ADMIN", "BUYER", "SELLER"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true, // Ensures Sequelize manages createdAt & updatedAt
      
    }
  );

  return User;
};

// Sequelize
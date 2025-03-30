"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Trains", "allBooked"); // Remove old column

    await queryInterface.addColumn("Trains", "allBooked", {
      type: Sequelize.ARRAY(Sequelize.INTEGER), // Convert to integer array
      allowNull: false,
      defaultValue: [], // Set an empty array as default
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Trains", "allBooked"); // Remove new column

    await queryInterface.addColumn("Trains", "allBooked", {
      type: Sequelize.BOOLEAN, // Restore the old type
      allowNull: false,
      defaultValue: false, // Restore default boolean value
    });
  },
};

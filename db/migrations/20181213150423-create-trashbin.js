'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('trashbins', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      bintype: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      owner: {
        type: Sequelize.STRING,
        defaultValue: null
      },
      address: {
        type: Sequelize.STRING,
        defaultValue: null
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('trashbins');
  }
};
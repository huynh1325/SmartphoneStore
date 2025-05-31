'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MauSacSanPham', {
      maMauSacSanPham: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      maSanPham: {
        type: Sequelize.STRING
      },
      mau: {
        type: Sequelize.INTEGER
      },
      soLuong: {
        type: Sequelize.DECIMAL(15, 2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MauSacSanPham');
  }
};
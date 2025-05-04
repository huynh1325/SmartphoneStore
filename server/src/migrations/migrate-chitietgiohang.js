'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChiTietGioHang', {
      maChiTietGioHang: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maGioHang: {
        type: Sequelize.INTEGER,
        unique: true
      },
      maSanPham: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      soLuong: {
        type: Sequelize.INTEGER,
      },
      gia: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('ChiTietGioHang');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChiTietGioHang', {
      maChiTietGioHang: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      maGioHang: {
        type: Sequelize.STRING,
      },
      maSanPham: {
        type: Sequelize.STRING,
      },
      soLuong: {
        type: Sequelize.INTEGER,
      },
      gia: {
        type: Sequelize.DECIMAL(15, 2),
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
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChiTietPhieuNhap', {
      maChiTietPhieuNhap: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      maPhieuNhap: {
        type: Sequelize.STRING
      },
      maSanPham: {
        type: Sequelize.STRING
      },
      maMauSanPham: {
        type: Sequelize.INTEGER
      },
      soLuong: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('ChiTietPhieuNhap');
  }
};
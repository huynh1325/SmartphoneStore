'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DanhGia', {
      maDanhGia: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      maNguoiDung: {
        type: Sequelize.STRING
      },
      maSanPham: {
        type: Sequelize.STRING
      },
      xepHang: {
        type: Sequelize.DECIMAL(2, 1)
      },
      noiDung: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('DanhGia');
  }
};
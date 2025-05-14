'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HoaDon', {
      maHoaDon: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      maDonHang: {
        type: Sequelize.STRING
      },
      maNguoiDung: {
        type: Sequelize.STRING
      },
      tongTien: {
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
    await queryInterface.dropTable('HoaDon');
  }
};
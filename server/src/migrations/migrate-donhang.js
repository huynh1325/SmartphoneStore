'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DonHang', {
      maDonHang: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maNguoiDung: {
        type: Sequelize.INTEGER
      },
      maKhuyenMai: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      soLuong: {
        type: Sequelize.INTEGER
      },
      trangThai: {
        type: Sequelize.STRING
      },
      ngayDatHang: {
        type: Sequelize.DATE
      },
      tongTien: {
        type: Sequelize.DECIMAL(10, 2)
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
    await queryInterface.dropTable('DonHang');
  }
};